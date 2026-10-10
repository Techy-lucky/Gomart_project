import { Link } from "react-router-dom";

const Prodcategory = () => {
  const categories = [
    { name: "Electronics", link: "/products/electronics" },
    { name: "Fashion", link: "/products/fashion" },
    { name: "Home & Living", link: "/products/homeliving" },
    { name: "Books", link: "/products/books" },
    { name: "Sports & Outdoors", link: "/products/sports" },
    { name: "Health & Beauty", link: "/products/health_beauty" },
    { name: "Toys & Games", link: "/products/toys_games" },
    { name: "Groceries", link: "/products/groceries" },
    { name: "Pet Supplies", link: "/products/pets_supplies" },
    { name: "Stationary", link: "/products/stationary" },
    { name: "Snacks", link: "/products/snacks" }
  ];

  return (
    <div className="backdrop-blur-md border-2 border-gray-200/40 mb-4 font-outfit  bg-white/10 p-4 rounded-xl shadow-lg  w-80 h-[83vh]">
      <h2 className="text-lg font-semibold mb-4 text-center">Categories</h2>
      <div className="flex flex-col gap-2 text-center h-[70vh] overflow-y-auto px-4
                                [&::-webkit-scrollbar]:w-2
                                [&::-webkit-scrollbar-track]:bg-transparent
                                [&::-webkit-scrollbar-thumb]:bg-gray-800/50
                                [&::-webkit-scrollbar-thumb]:rounded-full">
        {categories.map((category, index) => (
          <Link
            key={index}
            to={category.link}
            className="px-3 py-2 rounded-full flex justify-center hover:border-2 hover:border-gray-200/40  hover:bg-white/60 transition-all duration-100  text-sm"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Prodcategory;
