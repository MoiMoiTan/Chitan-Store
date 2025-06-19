"use client";
import { AlignLeft } from "lucide-react";
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

const MobileMenu = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); 
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <>
      {isMobile ? (
        <>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <AlignLeft className="hover:text-darkColor hoverEffect md:hidden" />
          </button>
          {isSidebarOpen && (
            <div className="fixed inset-0 z-[1000]">
              <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            </div>
          )}
        </>
      ) : null}
    </>
  );
};

export default MobileMenu;
