"use client";
import React from "react";
import Title from "./Title";
import { motion } from "motion/react";
import banner1 from "@/images/banner/banner1.png";
import banner2 from "@/images/banner/banner2.png";
import banner3 from "@/images/banner/banner3.png";
import banner4 from "@/images/banner/banner4.png";
import Image from "next/image";
import FeaturedSlider from "./FeaturedSlider";

const HomeBanner = () => {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-90 z-0"></div>

      <div className="relative z-10 w-full py-16 md:py-20">
        <div className="container mx-auto px-4 w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 w-full">
            {/* Text Content */}
            <motion.div
              className="flex-1 w-full text-center md:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-darkColor mb-4">
                BEST CLOTHING COLLECTION
              </h1>
              <p className="text-sm text-center md:text-left text-lightColor/80 font-medium max-w-[480px]">
                Find everything you need to look and feel your best, and shop
                the lastest men&apos;s fashion and lifestyle products
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-darkColor text-white px-8 py-3 rounded-full font-medium hover:bg-darkColor/90 transition-colors"
                >
                  Shopping Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-darkColor text-darkColor px-8 py-3 rounded-full font-medium hover:bg-darkColor hover:text-white transition-colors"
                >
                  Explore Product
                </motion.button>
              </div>
            </motion.div>

            {/* Image Grid */}
            <motion.div
              className="flex-1 w-full grid grid-cols-2 gap-4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-full space-y-4">
                <div className="relative w-full h-48 md:h-64 bg-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src={banner1}
                    alt="Fashion Collection 1"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="relative w-full h-48 md:h-64 bg-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src={banner2}
                    alt="Fashion Collection 2"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
              <div className="w-full space-y-4 mt-8">
                <div className="relative w-full h-48 md:h-64 bg-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src={banner3}
                    alt="Fashion Collection 3"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="relative w-full h-48 md:h-64 bg-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src={banner4}
                    alt="Fashion Collection 4"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-darkColor/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-darkColor/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      <FeaturedSlider />
    </div>
  );
};

export default HomeBanner;
