"use client";
import { CATEGORIES_QUERYResult, Product } from "@/sanity.types";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { client } from "@/sanity/lib/client";
import { AnimatePresence, motion } from "motion/react";
import ProductCard from "./ProductCard";
import NoProductsAvailable from "./NoProductsAvailable";
import Pagination from "./Pagination";
import Loading from "./Loading";
import Title from "./Title";
import PriceFilter from "./PriceFilter";

const ITEMS_PER_PAGE = 12;

interface Props {
  categories: CATEGORIES_QUERYResult;
  slug: string;
}

const CategoryProduct = ({ categories, slug }: Props) => {
  const [currentSlug, setCurrentSlug] = useState(slug);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<any>(null);
  
  // Price filter states
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [priceRange, setPriceRange] = useState<{min: number, max: number}>({
    min: 0,
    max: Infinity
  });

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange({ min, max });
    setCurrentPage(1);
  };

  const handlePriceReset = () => {
    setMinPriceInput("");
    setMaxPriceInput("");
    setPriceRange({ min: 0, max: Infinity });
  };

  const fetchProducts = async (categorySlug: string) => {
    try {
      setLoading(true);
      const category = categories?.find(cat => cat?.slug?.current === categorySlug);
      setCurrentCategory(category);

      let query;
      let params = {};

      if (categorySlug === "all") {
        query = `*[_type == "product"] | order(name asc)`;
      } else {
        query = `*[_type == 'product' && references(*[_type == 'category' && slug.current == $categorySlug]._id)] | order(name asc)`;
        params = { categorySlug };
      }

      const data = await client.fetch(query, params);
      setProducts(data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching products: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentSlug);
  }, [currentSlug]);

  const filteredProducts = products.filter(product => {
    const price = product.price || 0;
    return price >= priceRange.min && price <= priceRange.max;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = async (page: number) => {
    setIsPageLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setCurrentPage(page);
    setIsPageLoading(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Category Sidebar */}
        <div className="w-full md:w-60 flex-shrink-0 space-y-4">
          <div className="top-5 flex flex-col gap-2 bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-xl text-gray-800 mb-4">Categories</h3>
            <Button
              onClick={() => {
                setCurrentSlug("all");
                handlePriceReset();
              }}
              variant={currentSlug === "all" ? "default" : "ghost"}
              className="w-full text-left font-medium py-3 rounded-xl transition-all hover:bg-gray-200"
            >
              All products
            </Button>
            {categories?.map((item) => (
              <Button
                key={item._id}
                onClick={() => setCurrentSlug(item?.slug?.current as string)}
                variant={item?.slug?.current === currentSlug ? "default" : "ghost"}
                className="w-full text-left font-medium py-3 rounded-xl transition-all hover:bg-gray-200"
              >
                {item?.title}
              </Button>
            ))}
          </div>
          
          {/* Price Filter */}
          <PriceFilter 
            minPrice={minPriceInput}
            maxPrice={maxPriceInput}
            onPriceChange={handlePriceChange}
            onMinPriceChange={setMinPriceInput}
            onMaxPriceChange={setMaxPriceInput}
            onReset={handlePriceReset}
          />
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {currentProducts?.length ? (
            <>
              <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 transition-opacity duration-300 ${isPageLoading ? "opacity-50" : "opacity-100"}`}>
                {currentProducts.map((product: Product) => (
                  <AnimatePresence key={product?._id}>
                    <motion.div
                      layout
                      initial={{ opacity: 0.2 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  </AnimatePresence>
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  isLoading={isPageLoading}
                />
              )}
            </>
          ) : (
            <NoProductsAvailable
              selectedTab={currentCategory?.title || currentSlug}
              className="mt-0"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryProduct;
