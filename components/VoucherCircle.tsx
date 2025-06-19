'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface VoucherCircleProps {
  code: string
  discount: string
}

const VoucherCircle = ({ code, discount }: VoucherCircleProps) => {
  const [isBlinking, setIsBlinking] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(prev => !prev)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      animate={{
        scale: isBlinking ? 1.1 : 1,
        opacity: isBlinking ? 1 : 0.8,
        width: isHovered ? '85px' : '50px',
        height: isHovered ? '85px' : '50px'
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed bottom-10 right-8 z-50 flex flex-col items-center justify-center rounded-full bg-red-500 text-white shadow-lg cursor-pointer hover:bg-red-700 transition-colors ${isHovered ? 'p-2' : ''}`}
    >
      {!isHovered ? (
        <span className="text-lg font-bold">{discount}</span>
      ) : (
        <>
          <span className="text-sm font-semibold">Voucher</span>
          <span className="text-sm font-bold">{discount}</span>
          <span className="text-xs">Code: {code}</span>
        </>
      )}
    </motion.div>
  )
}

export default VoucherCircle 