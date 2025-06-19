import React from "react";
import Image from "next/image";
import bannerhellosummer from "@/images/banner/bannerhellosummer.png";
import HiringSection from "@/components/HiringSection";

const NewSection = () => {
  return (
    <div className="bg-white py-10 text-center w-full">
      <Image
        src={bannerhellosummer}
        alt="Fashion Sale"
        className="mx-auto mb-6"
      />
      <HiringSection />
    </div>
  );
};

export default NewSection;
