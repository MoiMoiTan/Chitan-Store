import React, { FC } from 'react';
import {motion} from 'motion/react';
import Logo from './Logo';
import { X } from 'lucide-react';
import { headerData } from '@/constants';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import SocialMedia from './SocialMedia';
import { useOutsideClick } from '@/hooks/useOutsideClicl';

interface SidebarProps {
    isOpen:boolean;
    onClose: () => void;
}

const Sidebar: FC<SidebarProps> = ({ isOpen , onClose }) =>{
  const pathname = usePathname();
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);
  return (
    <div className={`fixed inset-y-0 left-0 z-50
    bg-darkColor/50 shadow-xl cursor-auto hoverEffect w-full ${
    isOpen ? "translate-x-0" : "-translate-x-full"
    }`}
  >
      <motion.div 
        initial={{opacity:0}} 
        animate={{opacity:1}} 
        transition={{duration:0.4,delay:0.3}}
        ref={sidebarRef}
        className="min-w-72 max-w-96 bg-darkColor text-white/70 h-full p-10 
        border-r border-r-white flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <button onClick={onClose}>
            <Logo className="text-white">Chitan</Logo>
          </button>
          <button className="hover:text-red-500 hoverEffect"
          onClick={onClose}>
            <X />
          </button>
        </div>
        <div className="flex flex-col gap-3.5 text-base font-semibold
        tracking-wide">
          {headerData?.map((item) => (
            <Link
            onClick={onClose}
              key = {item?.title}
              href={item?.href} 
              className={`hover:text-white hoverEffect w-20
                ${pathname === item?.href && "text-white"}` }  
            >
              {item?.title}
            </Link>
          ))}
        </div>
        <SocialMedia />
      </motion.div>
    </div>

  )
}

export default Sidebar