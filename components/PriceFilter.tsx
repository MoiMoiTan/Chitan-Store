"use client";

import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface PriceFilterProps {
  minPrice: string;
  maxPrice: string;
  onPriceChange: (minPrice: number, maxPrice: number) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onReset: () => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({
  minPrice,
  maxPrice,
  onPriceChange,
  onMinPriceChange,
  onMaxPriceChange,
  onReset
}) => {
  const handleFilter = () => {
    const min = Number(minPrice) || 0;
    const max = Number(maxPrice) || Infinity;
    onPriceChange(min, max);
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
      <h3 className="font-semibold text-lg mb-2 text-darkColor">
      Price range</h3>
      <div className="space-y-2">
        <div>
          <label className="text-sm text-gray-600">Price from ($)</label>
          <Input
            type="number"
            min="0"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            placeholder="0"
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">To ($)</label>
          <Input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            placeholder="1000"
            className="mt-1"
          />
        </div>
        <div className="space-y-2">
          <Button 
            onClick={handleFilter}
            className="w-full bg-darkColor hover:bg-darkColor/90"
          >
            Apply
          </Button>
          <Button 
            onClick={onReset}
            variant="outline"
            className="w-full border-darkColor text-darkColor hover:bg-darkColor hover:text-white"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;