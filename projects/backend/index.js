const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const Admin = require('./models/admin');
const GoogleUser = require('./models/googleUser');
const multer = require('multer');
const Poster = require('./models/poster');
const Product = require('./models/product'); 
const Feedback = require('./models/feedback');
const Order = require('./models/Order');
const Cart = require('./models/cart');
const JobApplication = require('./models/JobApplication');
// const Discount = require('./models/Discount');
const path = require('path'); 
const cart = require('./models/cart');

const app = express();

// Middleware
app.use(cors({ 
    origin: 'http://localhost:5173', 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE' , 'PATCH' ],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({limit: '9000mb'}));
app.use(express.urlencoded({limit: '500mb', extended: true}));
app.use(cookieParser());

// Product.collection.createIndex({ category: 1 });

// Middleware to verify token
const verifyToken = async (req, res, next) => {
  try {
      const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
      
      if (!token) {
          return res.status(401).json({
              success: false,
              message: 'No token provided'
          });
      }

      const decoded = jwt.verify(token, SECRET_KEY);
      req.userId = decoded.userId;
      next();
  } catch (error) {
      return res.status(401).json({
          success: false,
          message: 'Invalid token'
      });
  }
};

// Middleware to verify admin token
const verifyAdminToken = async (req, res, next) => {
  try {
      const token = req.cookies.adminToken;
      
      if (!token) {
          return res.status(401).json({
              success: false,
              message: 'No token provided'
          });
      }

      const decoded = jwt.verify(token, SECRET_KEY);
      req.adminId = decoded.adminId;
      next();
  } catch (error) {
      return res.status(401).json({
          success: false,
          message: 'Invalid token'
      });
  }
};

// Configure multer for image upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  }
});

const SECRET_KEY = 'your_secret_key';

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/gomart', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
})

// mongoose.connect('mongodb+srv://lakshitverma98:password_apl@cluster0.sfw9d.mongodb.net/gomart', {
//     // useNewUrlParser: true,
//     // useUnifiedTopology: true
// })

.then(() => {
    console.log('Successfully connected to MongoDB.');
})
.catch((error) => {
    console.log('MongoDB connection error:', error);
    process.exit(1);
});

// Test route to verify server is working
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

// Register endpoint with detailed logging
app.post('/register', async (req, res) => {
    console.log('Received registration request with body:', req.body);
    
    try {
        const { fullName, contact, email, password } = req.body;

        // Log the received data
        console.log('Processing registration for:', { fullName, email, contact });

        // Check if all required fields are present
        if (!fullName || !contact || !email || !password) {
            console.log('Missing required fields');
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists with email:', email);
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed successfully');

        // Create new user
        const newUser = new User({
            fullName,
            contact,
            email,
            password: hashedPassword
        });

        // Save user to database
        const savedUser = await newUser.save();
        console.log('User saved successfully:', savedUser._id);

        // Generate JWT token
        const token = jwt.sign(
            { userId: savedUser._id },
            SECRET_KEY,
            { expiresIn: '24h' }
        );

        // Set token in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // Send success response
        return res.status(201).json({
            success: true,
            token,
            message: 'Registration successful'
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle mongoose validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: Object.values(error.errors).map(err => err.message).join(', ')
            });
        }

        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        // Handle other errors
        return res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.'
        });
    }
});

// Profile endpoint
app.get('/profile', verifyToken, async (req, res) => {
    try {
        // Try to find user in both collections
        let user = await User.findById(req.userId).select('-password') || 
                  await GoogleUser.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json(user);
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile data'
        });
    }
});

// Logout endpoint
app.post('/logout', (req, res) => {
    try {
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0),
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Logout failed'
        });
    }
});

app.post('/reset-password', async (req, res) => {
  try {
      console.log('Reset password request received:', req.body);

      const { email, newPassword } = req.body;
      if (!email || !newPassword) {
          return res.status(400).json({ success: false, message: 'Email and password are required' });
      }

      const user = await User.findOne({ email });
      console.log('User found:', user);

      if (!user) {
        console.log(`User not found for email: ${email}`);
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      console.log('Hashed Password:', hashedPassword);

      // Update password
      user.password = hashedPassword;
      await user.save();

      console.log('Password reset successful for:', user.email);
      res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
      console.error('Reset Password Error:', error);
      res.status(500).json({ success: false, message: 'Server error, try again later' });
  }
});


// Login endpoint
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Compare password with hashed password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '24h' });

        // Set token in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.json({
            success: true,
            token,
            message: 'Login successful'
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed. Please try again.'
        });
    }
});

// Admin Registration
app.post('/admin/register', async (req, res) => {
    try {
        const { adminId, fname, lname, email, phone, password, secretKey } = req.body;

        // Verify secret key
        if (secretKey !== "APL@admin#123") {
            return res.status(401).json({
                success: false,
                message: 'Invalid admin secret key'
            });
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ 
            $or: [{ adminId }, { email }]
        });
        
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: 'Admin ID or Email already registered'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new admin
        const newAdmin = new Admin({
            adminId,
            fname,
            lname,
            email,
            phone,
            password: hashedPassword
        });

        await newAdmin.save();

        // Generate token
        const token = jwt.sign(
            { adminId: newAdmin._id },
            SECRET_KEY,
            { expiresIn: '24h' }
        );

        // Set token in HTTP-only cookie
        res.cookie('adminToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.status(201).json({
            success: true,
            message: 'Admin registered successfully'
        });

    } catch (error) {
        console.error('Admin registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed'
        });
    }
});

// Admin Login
app.post('/admin/login', async (req, res) => {
    try {
        const { adminId, password, secretKey } = req.body;

        // Verify secret key
        if (secretKey !== "APL@admin#123") {
            return res.status(401).json({
                success: false,
                message: 'Invalid admin secret key'
            });
        }

        // Find admin
        const admin = await Admin.findOne({ adminId });
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, admin.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = jwt.sign(
            { adminId: admin._id },
            SECRET_KEY,
            { expiresIn: '24h' }
        );

        // Set token in HTTP-only cookie
        res.cookie('adminToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.json({
            success: true,
            message: 'Login successful'
        });

    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed'
        });
    }
});

//admin total 
app.get('/admin/profile/all', async (req, res) => {
  const admin = await Admin.find();
  res.send(admin);
});

// Admin Logout
 app.post('/admin/logout', (req, res) => {
    try {
        res.cookie('adminToken', '', {
            httpOnly: true,
            expires: new Date(0),
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Logout failed'
        });
    }
});

// Protected admin route example
app.get('/admin/profile', verifyAdminToken, async (req, res) => {
    try {
        const admin = await Admin.findById(req.adminId).select('-password');
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }
        res.json(admin);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch admin profile'
        });
    }
});

// Add this new endpoint
app.post('/auth/google', async (req, res) => {
    try {
        const { googleId, fullName, email, profilePicture } = req.body;
        console.log('Received Google user data:', { googleId, fullName, email });

        // Check if user exists
        let user = await GoogleUser.findOne({ googleId });

        if (!user) {
            // Create new user if doesn't exist
            user = new GoogleUser({
                googleId,
                fullName,
                email,
                profilePicture
            });
            await user.save();
            console.log('New Google user created:', user._id);
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, isGoogleUser: true },
            SECRET_KEY,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            message: 'Google authentication successful'
        });

    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({
            success: false,
            message: 'Authentication failed'
        });
    }
});

//job resume
app.post('/api/job-applications', express.json(), async (req, res) => {
  try {
      console.log('Received application data:', req.body); // Debug log
      const application = new JobApplication(req.body);
      await application.save();
      res.status(201).json({ 
          success: true, 
          message: 'Application submitted successfully' 
      });
  } catch (error) {
      console.error('Job application error:', error);
      res.status(500).json({ 
          success: false, 
          message: 'Failed to submit application',
          error: error.message 
      });
  }
});

//job send resume
app.get('/api/job-applications', async (req, res) => {
  try {
      const applications = await JobApplication.find().sort({ createdAt: -1 });
      res.json(applications);
  } catch (error) {
      console.error('Fetch error:', error);
      res.status(500).json({ success: false, message: 'Error fetching applications' });
  }
});

//job delete resume
app.delete('/api/job-applications/:id', async (req, res) => {
    try {
        const application = await JobApplication.findByIdAndDelete(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.json({ success: true, message: 'Application deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ message: 'Error deleting application' });
    }
});

// Poster upload endpoint
app.post('/api/posters/upload', verifyAdminToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const newPoster = new Poster({
      name: req.file.originalname,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    });

    await newPoster.save();
    res.status(201).json({ message: 'Poster uploaded successfully' });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading poster' });
  }
});

// Get all posters endpoint
app.get('/api/posters', async (req, res) => {
  try {
    const posters = await Poster.find();
    const formattedPosters = posters.map(poster => ({
      id: poster._id,
      name: poster.name,
      imageUrl: `data:${poster.image.contentType};base64,${poster.image.data.toString('base64')}`,
      uploadDate: poster.uploadDate
    }));
    res.json(formattedPosters);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'Error fetching posters' });
  }
});

// delete poster
app.delete('/api/posters/:id', verifyAdminToken, async (req, res) => {
  try {
    const posterId = req.params.id;
    const deletedPoster = await Poster.findByIdAndDelete(posterId);
    
    if (!deletedPoster) {
      return res.status(404).json({ message: 'Poster not found' });
    }
    
    res.json({ message: 'Poster deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Error deleting poster' });
  }
});

// Product upload endpoint
app.post('/admin/products/upload', verifyAdminToken, upload.array('images', 5), async (req, res) => {
  try {
    const { category, subcategory, name, description, price, stock } = req.body;
    
    // Process uploaded images
    const processedImages = req.files.map(file => ({
      data: file.buffer,
      contentType: file.mimetype
    }));

    const newProduct = new Product({
      category,
      subcategory,
      name,
      description,
      price,
      stock,
      images: processedImages
    });

    await newProduct.save();
    res.status(201).json({ 
      success: true,
      message: 'Product uploaded successfully',
      product: newProduct
    });
  } catch (error) {
    console.error('Product upload error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error uploading product'
    });
  }
});

// Get all products endpoint
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    const formattedProducts = products.map(product => ({
      id: product._id,
      category: product.category,
      subcategory: product.subcategory,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      images: product.images.map(image => ({
        url: `data:${image.contentType};base64,${image.data.toString('base64')}`
      })),
      createdAt: product.createdAt
    }));
    
    res.json({
      success: true,
      products: formattedProducts
    });
  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching products'
    });
  }
});

// app.get('/productss', async (req, res) => {
//   try {
//     const products = await Product.find();
//     const formattedProducts = products.map(product => ({
//       id: product._id,
//       category: product.category,
//       subcategory: product.subcategory,
//       name: product.name,
//       description: product.description,
//       price: product.price,
//       stock: product.stock,
//       images: product.images.map(image => ({
//         url: `data:${image.contentType};base64,${image.data.toString('base64')}`
//       })),
//       createdAt: product.createdAt
//     }));
    
//     res.json({
//       success: true,
//       products: formattedProducts
//     });
//   } catch (error) {
//     console.error('Product fetch error:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Error fetching products'
//     });
//   }
// });

// Delete product endpoint
app.delete('/admin/products/:id', verifyAdminToken, async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);
    
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Product delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product'
    });
  }
});

// Update product endpoint
app.put('/admin/products/:id', verifyAdminToken, async (req, res) => {
    try {
        const productId = req.params.id;
        const { category, subcategory, name, description, price, stock } = req.body;

        // Find and update the product
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                category,
                subcategory,
                name,
                description,
                price,
                stock
            },
            { new: true } // This option returns the updated document
        );

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Format the response
        const formattedProduct = {
            id: updatedProduct._id,
            category: updatedProduct.category,
            subcategory: updatedProduct.subcategory,
            name: updatedProduct.name,
            description: updatedProduct.description,
            price: updatedProduct.price,
            stock: updatedProduct.stock,
            images: updatedProduct.images.map(image => ({
                url: `data:${image.contentType};base64,${image.data.toString('base64')}`
            })),
            createdAt: updatedProduct.createdAt
        };

        res.json({
            success: true,
            message: 'Product updated successfully',
            product: formattedProduct
        });

    } catch (error) {
        console.error('Product update error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
});

// Endpoint to get electronics products with a limit of 4
app.get('/products/electronics', async (req, res) => {
    try {
      const electronicsProducts = await Product.find({ category: 'electronics' }).limit(4);
      const formattedProducts = electronicsProducts.map(product => ({
        id: product._id,
        category: product.category,
        subcategory: product.subcategory,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        images: product.images.map(image => ({
          url: `data:${image.contentType};base64,${image.data.toString('base64')}`
        })),
        createdAt: product.createdAt
      }));
      
      res.json({
        success: true,
        products: formattedProducts
      });
    } catch (error) {
      console.error('Error fetching electronics products:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error fetching electronics products'
      });
    }
  });

  // Endpoint to get Fashion products with a limit of 4
app.get('/products/fashion', async (req, res) => {
    try {
      const FashionsProducts = await Product.find({ category: 'fashions' }).limit(4);
      const formattedProducts = FashionsProducts.map(product => ({
        id: product._id,
        category: product.category,
        subcategory: product.subcategory,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        images: product.images.map(image => ({
          url: `data:${image.contentType};base64,${image.data.toString('base64')}`
        })),
        createdAt: product.createdAt
      }));
      
      res.json({
        success: true,
        products: formattedProducts
      });
    } catch (error) {
      console.error('Error fetching electronics products:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error fetching electronics products'
      });
    }
  });

  // Endpoint to get all electronics products
app.get('/products/electronics/all', async (req, res) => {
    try {
      const electronicsProducts = await Product.find({ category: 'electronics' });
      const formattedProducts = electronicsProducts.map(product => ({
        id: product._id,
        category: product.category,
        subcategory: product.subcategory,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        images: product.images.map(image => ({
          url: `data:${image.contentType};base64,${image.data.toString('base64')}`
        })),
        createdAt: product.createdAt
      }));
      
      res.json({
        success: true,
        products: formattedProducts
      });
    } catch (error) {
      console.error('Error fetching all electronics products:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error fetching all electronics products'
      });
    }
  });

  // Endpoint to get all fashions products
app.get('/products/fashions/all', async (req, res) => {
    try {
      const electronicsProducts = await Product.find({ category: 'fashions' });
      const formattedProducts = electronicsProducts.map(product => ({
        id: product._id,
        category: product.category,
        subcategory: product.subcategory,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        images: product.images.map(image => ({
          url: `data:${image.contentType};base64,${image.data.toString('base64')}`
        })),
        createdAt: product.createdAt
      }));
      
      res.json({
        success: true,
        products: formattedProducts
      });
    } catch (error) {
      console.error('Error fetching all electronics products:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error fetching all electronics products'
      });
    }
  });

  // Endpoint to get all home&living products
app.get('/products/homeliving/all', async (req, res) => {
    try {
      const electronicsProducts = await Product.find({ category: 'home & living' });
      const formattedProducts = electronicsProducts.map(product => ({
        id: product._id,
        category: product.category,
        subcategory: product.subcategory,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        images: product.images.map(image => ({
          url: `data:${image.contentType};base64,${image.data.toString('base64')}`
        })),
        createdAt: product.createdAt
      }));
      
      res.json({
        success: true,
        products: formattedProducts
      });
    } catch (error) {
      console.error('Error fetching all electronics products:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error fetching all electronics products'
      });
    }
  });

  // Endpoints to get all Books products
app.get('/products/books/all', async (req, res) => {
    try {
      const electronicsProducts = await Product.find({ category: 'books' });
      const formattedProducts = electronicsProducts.map(product => ({
        id: product._id,
        category: product.category,
        subcategory: product.subcategory,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        images: product.images.map(image => ({
          url: `data:${image.contentType};base64,${image.data.toString('base64')}`
        })),
        createdAt: product.createdAt
      }));
      
      res.json({
        success: true,
        products: formattedProducts
      });
    } catch (error) {
      console.error('Error fetching all electronics products:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error fetching all electronics products'
      });
    }
  });

app.get('/products/groceries/all', async (req, res) => {
    try {
      const electronicsProducts = await Product.find({ category: 'groceries' });
      const formattedProducts = electronicsProducts.map(product => ({
        id: product._id,
        category: product.category,
        subcategory: product.subcategory,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        images: product.images.map(image => ({
          url: `data:${image.contentType};base64,${image.data.toString('base64')}`
        })),
        createdAt: product.createdAt
      }));
      
      res.json({
        success: true,
        products: formattedProducts
      });
    } catch (error) {
      console.error('Error fetching all electronics products:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error fetching all electronics products'
      });
    }
  });

app.get('/products/pets/all', async (req, res) => {
    try {
      const electronicsProducts = await Product.find({ category: 'pet supplies' });
      const formattedProducts = electronicsProducts.map(product => ({
        id: product._id,
        category: product.category,
        subcategory: product.subcategory,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        images: product.images.map(image => ({
          url: `data:${image.contentType};base64,${image.data.toString('base64')}`
        })),
        createdAt: product.createdAt
      }));
      
      res.json({
        success: true,
        products: formattedProducts
      });
    } catch (error) {
      console.error('Error fetching all electronics products:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error fetching all electronics products'
      });
    }
  });

app.get('/products/stationary/all', async (req, res) => {
    try {
      const electronicsProducts = await Product.find({ category: 'stationary' });
      const formattedProducts = electronicsProducts.map(product => ({
        id: product._id,
        category: product.category,
        subcategory: product.subcategory,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        images: product.images.map(image => ({
          url: `data:${image.contentType};base64,${image.data.toString('base64')}`
        })),
        createdAt: product.createdAt
      }));
      
      res.json({
        success: true,
        products: formattedProducts
      });
    } catch (error) {
      console.error('Error fetching all electronics products:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error fetching all electronics products'
      });
    }
  });

app.get('/products/snacks/all', async (req, res) => {
    try {
      const electronicsProducts = await Product.find({ category: 'snacks' });
      const formattedProducts = electronicsProducts.map(product => ({
        id: product._id,
        category: product.category,
        subcategory: product.subcategory,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        images: product.images.map(image => ({
          url: `data:${image.contentType};base64,${image.data.toString('base64')}`
        })),
        createdAt: product.createdAt
      }));
      
      res.json({
        success: true,
        products: formattedProducts
      });
    } catch (error) {
      console.error('Error fetching all electronics products:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error fetching all electronics products'
      });
    }
  });

app.get('/products/sports/all', async (req, res) => {
    try {
      const electronicsProducts = await Product.find({ category: 'sports & outdoors' });
      const formattedProducts = electronicsProducts.map(product => ({
        id: product._id,
        category: product.category,
        subcategory: product.subcategory,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        images: product.images.map(image => ({
          url: `data:${image.contentType};base64,${image.data.toString('base64')}`
        })),
        createdAt: product.createdAt
      }));
      
      res.json({
        success: true,
        products: formattedProducts
      });
    } catch (error) {
      console.error('Error fetching all electronics products:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error fetching all electronics products'
      });
    }
  });

app.get('/products/health/all', async (req, res) => {
    try {
      const electronicsProducts = await Product.find({ category: 'health & beauty' });
      const formattedProducts = electronicsProducts.map(product => ({
        id: product._id,
        category: product.category,
        subcategory: product.subcategory,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        images: product.images.map(image => ({
          url: `data:${image.contentType};base64,${image.data.toString('base64')}`
        })),
        createdAt: product.createdAt
      }));
      
      res.json({
        success: true,
        products: formattedProducts
      });
    } catch (error) {
      console.error('Error fetching all electronics products:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error fetching all electronics products'
      });
    }
  });

app.get('/products/toys/all', async (req, res) => {
    try {
      const electronicsProducts = await Product.find({ category: 'toys and games' });
      const formattedProducts = electronicsProducts.map(product => ({
        id: product._id,
        category: product.category,
        subcategory: product.subcategory,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        images: product.images.map(image => ({
          url: `data:${image.contentType};base64,${image.data.toString('base64')}`
        })),
        createdAt: product.createdAt
      }));
      
      res.json({
        success: true,
        products: formattedProducts
      });
    } catch (error) {
      console.error('Error fetching all electronics products:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error fetching all electronics products'
      });
    }
  });

  // Endpoint to get a single product by ID
app.get('/product/:id', async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      const formattedProduct = {
        id: product._id,
        category: product.category,
        subcategory: product.subcategory,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        images: product.images.map(image => ({
          url: `data:${image.contentType};base64,${image.data.toString('base64')}`
        })),
        createdAt: product.createdAt
      };
      res.json({ success: true, product: formattedProduct });
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ success: false, message: 'Error fetching product' });
    }
  });
  
  // search page
  app.get('/search', async (req, res) => {
    try {
      const { query } = req.query;
      if (!query) return res.json({ success: true, products: [] });
  
      const searchRegex = new RegExp(query, 'i');
      
      const products = await Product.find({
        $or: [
          { name: { $regex: searchRegex }},
          { category: { $regex: searchRegex }},
          { subcategory: { $regex: searchRegex }},
          { description: { $regex: searchRegex }}
        ]
      });
  
      const formattedProducts = products.map(product => ({
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        subcategory: product.subcategory,
        images: product.images.map(image => ({
          url: `data:${image.contentType};base64,${image.data.toString('base64')}`
        })),
        matchType: 
          product.name.match(searchRegex) ? 'name' :
          product.category.match(searchRegex) ? 'category' :
          product.subcategory.match(searchRegex) ? 'subcategory' : 'description'
      }));
  
      res.json({ success: true, products: formattedProducts });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ success: false, message: 'Error searching products' });
    }
  }); 

  // fetch feedback data
  app.post('/api/feedback', async (req, res) => {
    try {
      const { userName, userEmail, rating, feedback } = req.body;
  
      if (!userName || !userEmail || !rating || !feedback || feedback.length < 10) {
        return res.status(400).json({ success: false, message: 'Invalid input data' });
      }
  
      const newFeedback = new Feedback({ userName, userEmail, rating, feedback });
      await newFeedback.save();
      res.status(201).json({ success: true, feedback: newFeedback });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  
  // Get All Feedback
  app.get('/api/feedbacks', async (req, res) => {
    try {
      const feedbacks = await Feedback.find().sort({ createdAt: -1 }).limit(3);
      res.json({ success: true, feedbacks });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

app.get('/admin/users', verifyAdminToken, async (req, res) => {
  try {
      const normalUsers = await User.find().select('fullName email createdAt');
      const googleUsers = await GoogleUser.find().select('fullName email createdAt');
      
      const allUsers = [
          ...normalUsers.map(user => ({ ...user.toObject(), type: 'normal' })),
          ...googleUsers.map(user => ({ ...user.toObject(), type: 'google' }))
      ];

      res.json({ success: true, users: allUsers });
  } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching users' });
  }
});

app.delete('/admin/users/:userType/:userId', verifyAdminToken, async (req, res) => {
  try {
      const { userId, userType } = req.params;

      // Determine the collection to delete the user from
      const model = userType === 'google' ? GoogleUser : User;

      // Find and delete the user
      const deletedUser = await model.findByIdAndDelete(userId);

      if (!deletedUser) {
          return res.status(404).json({
              success: false,
              message: 'User not found'
          });
      }

      res.json({
          success: true,
          message: 'User deleted successfully'
      });
  } catch (error) {
      console.error('Error deleting user:', error.message);
      res.status(500).json({
          success: false,
          message: 'Failed to delete user'
      });
  }
});

app.post("/api/create-order", async (req, res) => {
  try {
    const { products, deliveryInfo, paymentInfo, totalAmount } = req.body;

    if (!products || !deliveryInfo || !paymentInfo || !totalAmount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newOrder = new Order({
      products,
      deliveryInfo,
      paymentInfo,
      totalAmount,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Fetch Orders Endpoint
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Delete Order Endpoint
app.delete("/api/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

app.patch("/api/orders/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
    
    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
});


app.get('/api/orders/history', verifyToken, async (req, res) => {
  try {
    // Fetch user details from both collections
    const user = await User.findById(req.userId).select('fullName email');
    const googleUser = await GoogleUser.findById(req.userId).select('fullName email');

    // Determine the correct user details (either User or GoogleUser)
    let selectedUser = null;
    if (user) {
        selectedUser = user;
    } else if (googleUser) {
        selectedUser = googleUser;
    }

    if (!selectedUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Fetch only the orders that match the selected user's fullName and email exactly
    const orders = await Order.find({
        'deliveryInfo.fullName': selectedUser.fullName,
        'deliveryInfo.email': selectedUser.email
    }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        orders
    });

} catch (error) {
    res.status(500).json({ message: 'Server error', error });
}
});

 // Get All Feedback
 app.get('/api/feedbacks/all', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json({ success: true, feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/feedbacks/:id', verifyAdminToken, async (req, res) => {
  try {
      const deletedFeedback = await Feedback.findByIdAndDelete(req.params.id);
      if (!deletedFeedback) {
          return res.status(404).json({ message: 'Feedback not found' });
      }
      res.json({ success: true, message: 'Feedback deleted successfully' });
  } catch (error) {
      console.error('Error deleting feedback:', error);
      res.status(500).json({ message: 'Failed to delete feedback' });
  }
});

// POST: Add product to cart
app.post('/api/cart', async (req, res) => {
  try {
    const { productId, productName, price, quantity, image, fullName, email } = req.body;

    // Check if user exists in either User or GoogleUser collection using fullName or email
    const user = await User.findOne({
      $or: [{ email }, { fullName }],
    }) || await GoogleUser.findOne({
      $or: [{ email }, { fullName }],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the product already exists in the user's cart
    let cartItem = await Cart.findOne({
      $or: [
        { 'deliveryInfo.fullName': fullName },
        { 'deliveryInfo.email': email },
      ],
      productId,
    });

    if (cartItem) {
      // If item exists, update the quantity
      cartItem.quantity += quantity;
    } else {
      // If item does not exist, create a new cart entry
      cartItem = new Cart({
        productId,
        productName,
        price,
        quantity,
        image,
        deliveryInfo: { fullName, email },
      });
    }

    await cartItem.save();

    res.status(201).json({ success: true, message: 'Product added to cart.' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Failed to add product to cart.' });
  }
});

// GET: Fetch cart items
app.get('/api/cart', verifyToken , async (req, res) => {
  try {
    // Fetch user details from User or GoogleUser models using fullName or email
    const user = await User.findById(req.userId).select('fullName email') || 
                 await GoogleUser.findById(req.userId).select('fullName email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch all cart items for the user using email or fullName
    const cartItems = await Cart.find({
      $or: [
        { 'deliveryInfo.fullName': user.fullName },
        { 'deliveryInfo.email': user.email },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, cartItems });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ message: 'Failed to fetch cart items.' });
  }
});

// DELETE: Remove cart item
app.delete('/api/cart/:id', verifyToken ,async (req, res) => {
  try {
    const cartItemId = req.params.id;

    // Fetch user details from User or GoogleUser models using fullName or email
    const user = await User.findById(req.userId).select('fullName email') || 
    await GoogleUser.findById(req.userId).select('fullName email');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Find and delete the cart item based on fullName or email
    const deletedItem = await Cart.findOneAndDelete({
      _id: cartItemId,
      $or: [
        { 'deliveryInfo.fullName': user.fullName },
        { 'deliveryInfo.email': user.email },
      ],
    });

    if (!deletedItem) {
      return res.status(404).json({ success: false, message: 'Item not found or unauthorized' });
    }

    res.status(200).json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).json({ success: false, message: 'Failed to remove item from cart' });
  }
});

app.post("/product/:id/feedback", async (req, res) => {
  try {
    console.log("Feedback request received for product:", req.params.id);
    console.log("Received data:", req.body);

    const { id } = req.params;
    const { user, comment } = req.body;

    if (!comment || comment.trim() === "") {
      console.log("Missing comment data");
      return res.status(400).json({ success: false, message: "Feedback cannot be empty" });
    }

    const product = await Product.findById(id);
    if (!product) {
      console.log("Product not found:", id);
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    product.feedback.push({ user: user || "Anonymous", comment });
    await product.save();

    console.log("Feedback saved:", { user, comment });
    res.status(200).json({ success: true, message: "Feedback added", review: { user, comment } });
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get all feedback for a product
app.get("/product/:id/feedback", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).select("feedback");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, feedback: product.feedback });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
