"use client";
import React, { useEffect, useState } from "react";
import HomeTabbar from "./HomeTabbar";
import { productType } from "@/constants";
import { client } from "@/sanity/lib/client";
import { Product } from "@/sanity.types";
import ProductCard from "./ProductCard";
import NoProductsAvailable from "./NoProductsAvailable";
import { motion, AnimatePresence } from "motion/react";
import { Loader2 } from "lucide-react";
import Pagination from "./Pagination";

const ITEMS_PER_PAGE = 16;

const ProductGrid = () => {
  const [selectedTab, setSelecteTab] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let query;
        let params = {};

        if (selectedTab === "All") {
          query = `*[_type == "product"] | order(name asc)`;
        } else {
          query = `*[_type == "product" && variant == $variant] | order(name asc)`;
          params = { variant: selectedTab.toLowerCase() };
        }

        const response = await client.fetch(query, params);
        setProducts(await response);
        setCurrentPage(1);
      } catch (error) {
        console.log("Product Fetching Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedTab]);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, endIndex);

  const handlePageChange = async (page: number) => {
    setIsPageLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setCurrentPage(page);
    setIsPageLoading(false);
  };

  return (
    <div className="mt-10 flex flex-col items-center">
      <HomeTabbar selectedTab={selectedTab} onTabSelect={setSelecteTab} />
      
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10 w-full">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-72 w-full mb-4"></div>
              <div className="space-y-3 py-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : currentProducts?.length ? (
        <>
          <div
            className={`grid grid-cols-2 md:grid-cols-3
            lg:grid-cols-4 gap-8 mt-10 w-full transition-opacity duration-300 ${isPageLoading ? "opacity-50" : "opacity-100"}`}
          >
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
        <NoProductsAvailable selectedTab={selectedTab} />
      )}
    </div>
  );
};

export default ProductGrid;
