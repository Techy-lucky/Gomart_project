import Electronic from "../../images/img/electronic.png";
import Fashion from "../../images/img/category (1).png";
import Home from "../../images/img/category (4).png";
import Books from "../../images/img/category (3).png";
import { Link } from 'react-router-dom';
import '../../css files/ALLanimation.css'

const BestDeals = () => {
  const categories = [
    {
      title: "Electronics",
      description: "Up to 50% off on gadgets and devices.",
      image: Electronic,
      textColor: "text-green-600",
      link: "/products/electronics",
    },
    {
      title: "Fashion",
      description: "Up to 60% off on trendy apparel.",
      image: Fashion,
      textColor: "text-pink-600",
      link: "/products/fashion",
    },
    {
      title: "Home & Living",
      description: "Save big on furniture and decor.",
      image: Home,
      textColor: "text-blue-600",
      link: "/products/homeliving",
    },
    {
      title: "Books",
      description: "Get up to 40% off on bestsellers.",
      image: Books,
      textColor: "text-stone-700",
      link: "/products/books",
    },
  ];

  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={category.link}
              className={`anime group block rounded-3xl border-2 border-gray-200/40 overflow-hidden shadow-lg bg-white/30 transform hover:scale-105 transition-transform duration-300`}
            >
              <div className={`relative ${category.bgColor} p-6 flex flex-col h-72  items-center`}>
                <h3
                  className={`text-sm font-light bg-white/20  border-2 border-gray-200/40  px-4 py-2 rounded-full  mb-2 ${category.textColor} `}
                >
                  {category.title}
                </h3>
                {/* Category Description */}
                <p className="text-sm text-center text-gray-700">{category.description}</p>
                {/* Category Image */}
                <img
                  src={category.image}
                  alt={category.title}
                  className="h-48 w-auto  object-contain"
                />
                {/* Category Title */}
              </div>
              {/* CTA */}
              <div className="bg-gray-100 p-4 text-center">
                <span className="text-blue-500 font-medium text-sm group-hover:underline">
                  Shop Now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestDeals;
