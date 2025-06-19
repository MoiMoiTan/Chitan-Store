"use client";
import React, { useEffect, useState, useRef } from "react";
import { client } from "@/sanity/lib/client";
import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";

const FeaturedSlider = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const positionRef = useRef(0);

  useEffect(() => {
    setIsMounted(true);
    const fetchFeaturedProducts = async () => {
      try {
        const query = `*[_type == "product" && status == "hot"] | order(name asc)[0...8]`;
        const data = await client.fetch(query);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);
  useEffect(() => {
    if (!sliderRef.current || loading || !isMounted) return;

    const slider = sliderRef.current;
    const getScrollWidth = () => {
      if (!products.length) return 0;
      return slider.scrollWidth / 3;
    };

    const scroll = () => {
      if (isPaused || !slider) {
        animationFrameRef.current = requestAnimationFrame(scroll);
        return;
      }
      const totalWidth = getScrollWidth();
      if (!totalWidth) {
        animationFrameRef.current = requestAnimationFrame(scroll);
        return;
      }
      positionRef.current -= 0.5;
      if (Math.abs(positionRef.current) >= totalWidth) {
        positionRef.current = 0;
      }
      slider.style.transform = `translateX(${positionRef.current}px)`;
      animationFrameRef.current = requestAnimationFrame(scroll);
    };

    animationFrameRef.current = requestAnimationFrame(scroll);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPaused, loading, isMounted]);
  if (!isMounted) {
    return null;
  }
  if (loading) {
    return (
      <div className="w-screen h-64 bg-gray-100 animate-pulse flex items-center justify-center">
        <span className="text-gray-500 font-semibold">Loading...</span>
      </div>
    );
  }

  const repeatedProducts = products.length
    ? [...products, ...products, ...products]
    : [];

  return (
    <div className="w-screen overflow-hidden relative py-6 bg-white">
      {/* Gradient overlay for a fading effect on the sides */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

      {/* Slider container */}
      <div
        ref={sliderRef}
        className="flex gap-4 px-4"
        style={{ willChange: "transform" }} // Optimize for performance
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {repeatedProducts.map((product, index) => (
          <Link
            key={`${product._id}-${index}`}
            href={`/product/${product.slug?.current}`}
            className="flex-shrink-0 w-56 h-56 relative group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            {/* Product Image */}
            {product.images && product.images[0] && (
              <Image
                src={urlFor(product.images[0]).url()}
                alt={product.name || "Featured Product"}
                width={224}
                height={224}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
              <span className="text-white font-bold text-lg text-center uppercase tracking-wide">
                {product.name}
              </span>
              <span className="text-pink-400 font-semibold text-sm mt-2">
                Shop Now
              </span>
            </div>

            {/* Hot Badge */}
            <div className="absolute top-2 left-2 bg-pink-400 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Hot
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeaturedSlider;
