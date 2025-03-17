"use client";
import { MY_ORDERS_QUERYResult } from "@/sanity.types";
import React, { useState } from "react";
import { TableBody, TableCell, TableRow } from "./ui/table";
import { Tooltip, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const OrdersComponent = ({ orders }: { orders: MY_ORDERS_QUERYResult }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  console.log(orders);

  return (
    <>
      <TableBody>
        <TooltipProvider>
          {orders?.map((order) => (
            <Tooltip key={order?.orderNumber}>
              <TooltipTrigger asChild>
                <TableRow>
                  <TableCell>{order.orderNumber}</TableCell>
                </TableRow>
              </TooltipTrigger>
            </Tooltip>
          ))}
        </TooltipProvider>
      </TableBody>
    </>
  );
};

export default OrdersComponent;
