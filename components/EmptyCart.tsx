'use client';
import emptyCart from "@/images/emptyCart.png";
import React from 'react';
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

const EmptyCart = () => {
  return (
    <div className="py-10 md:py-20 bg-gradient-to-b from-blue-50 to white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full space-y-8"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="w-60 h-60 mx-auto relative"
        >
          <Image
            src={emptyCart}
            alt="Empty Cart Illustration"
            fill
            className="drop-shadow-lg object-contain"
            priority
          />
          <motion.div
            className="absolute -top-4 -right-4 bg-black rounded-full p-2"
            animate={{ x: [0, -10, 10, 0], y: [0, -5, 5, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          >
            <ShoppingCart size={24} className="text-white" />
          </motion.div>
        </motion.div>

        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-800">
            Your Cart is Empty
          </h2>
          <p className="text-gray-600">
            Explore our products and add your favorite items to the cart
          </p>
        </div>

        <Link
          href={"/"}
          className="block bg-darkColor/20 text-center py-2.5 rounded-full text-sm font-semibold tracking-wide hover:border-darkColor hover:bg-darkColor hover:text-white hoverEffect"
        >
          Discover Products
        </Link>
        <div className="text-gray-700 text-sm text-center">
          Need help? {' '}
          <Link href="/contact" className="text-black hover:underline font-medium">
            Contact us
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default EmptyCart;