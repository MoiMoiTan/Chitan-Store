"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { CATEGORIES_QUERYResult } from "@/sanity.types";
const HeaderMenu = ({ categories }: { categories: CATEGORIES_QUERYResult }) => {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <div
      className="hidden md:inline-flex w-1/3 items-center 
      gap-5 text-sm capitalize font-semibold"
    >
      <Link
        href="/"
        className={`hover:text-darkColor hoverEffect
            relative group 
            ${pathname === "/" && "text-darkColor"}`}
      >
        Home
        <span
          className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 
          bg-darkColor hoverEffect group-hover:w-1/2 group:left-0 
          ${pathname === "/" && "w-1/2"} `}
        />
        <span
          className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5
          bg-darkColor hoverEffect group-hover:w-1/2 group:right-0
          ${pathname === "/" && "w-1/2"} `}
        />
      </Link>
      {categories?.map((category) => (
        <Link
          key={category?._id}
          href={`/category/${category?.slug?.current}`}
          className={`hover:text-darkColor hoverEffect
            relative group 
            ${pathname === `/category/${category?.slug?.current}` && "text-darkColor"}`}
        >
          {category?.title}
          <span
            className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 
          bg-darkColor hoverEffect group-hover:w-1/2 group:left-0 
          ${pathname === `/category/${category?.slug?.current}` && "w-1/2"} `}
          />
          <span
            className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5
          bg-darkColor hoverEffect group-hover:w-1/2 group:right-0
          ${pathname === `/category/${category?.slug?.current}` && "w-1/2"} `}
          />
        </Link>
      ))}
    </div>
  );
};

export default HeaderMenu;
