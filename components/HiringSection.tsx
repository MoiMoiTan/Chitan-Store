import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import hiring from "@/images/hiring.png";

const HiringSection = () => {
  const positions = [
    "Sales Representative",
    "Store Manager",
    "Fashion Consultant",
  ];

  return (
    <div className="w-full bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Cột trái - Hình ảnh */}
          <div className="relative bg-black rounded-2xl overflow-hidden">
            <div className="aspect-[4/3] relative">
              <Image
                src={hiring}
                alt="We're Hiring"
                fill
                className="object-cover opacity-90"
                priority
              />
            </div>
          </div>

          {/* Cột phải - Nội dung */}
          <div className="space-y-8">
            <div>
              <h2 className="text-5xl font-bold mb-4">WE'RE HIRING!</h2>
              <p className="text-gray-600 text-lg">
                Join us to develop your career in the fashion industry fashion
              </p>
            </div>

            {/* Vị trí tuyển dụng */}
            <div>
              <h3 className="text-2xl font-semibold mb-4">
                Currently Hiring Positions
              </h3>
              <ul className="space-y-4">
                {positions.map((position) => (
                  <li key={position} className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-pink-500"></div>
                    <span className="text-lg">{position}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Thông tin liên hệ */}
            <div>
              <h3 className="text-2xl font-semibold mb-4">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-pink-500" />
                  <span className="text-lg">0916686863</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-pink-500" />
                  <span className="text-lg">chitan@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-pink-500" />
                  <span className="text-lg">Cau Giay, Ha Noi</span>
                </div>
              </div>
            </div>

            {/* Nút Apply */}
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-black text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-black/90 transition-colors"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiringSection;
