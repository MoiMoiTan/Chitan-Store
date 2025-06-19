"use client";
import { MY_ORDERS_QUERYResult } from "@/sanity.types";
import React, { useState } from "react";
import { TableBody, TableCell, TableRow } from "./ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { format } from "date-fns";
import PriceFormatter from "./PriceFormatter";
import OrderDetailsDialog from "./OrderDetailsDialog";

const OrdersComponent = ({ orders }: { orders: MY_ORDERS_QUERYResult }) => {
  const [selectedOrder, setSelectedOrder] = useState<
    MY_ORDERS_QUERYResult[number] | null
  >(null);

  return (
    <TooltipProvider>
      <TableBody>
        {orders?.map((order) => (
          <Tooltip key={order?._id}>
            <TooltipTrigger asChild>
              <TableRow
                className="cursor-pointer hover:bg-gray-100 h-12"
                onClick={() => setSelectedOrder(order)}
              >
                <TableCell className="font-medium">
                  {order._id?.slice(-10) ?? "N/A"}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {order?.orderDate &&
                    format(new Date(order.orderDate), "dd/MM/yyyy")}
                </TableCell>
                <TableCell>{order?.customerName}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {order?.email}
                </TableCell>
                <TableCell>
                  <PriceFormatter
                    amount={order?.totalPrice}
                    className="text-black font-medium"
                  />
                </TableCell>
                <TableCell>
                  {order?.status && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : order.status === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "delivered"
                              ? "bg-purple-100 text-purple-800"
                              : order.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status === "paid"
                        ? "Paid"
                        : order.status === "shipped"
                          ? "Shipped"
                          : order.status === "delivered"
                            ? "Delivered"
                            : order.status === "cancelled"
                              ? "Cancelled"
                              : "Pending"}
                    </span>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {order?.invoice?.number ?? "----"}
                </TableCell>
              </TableRow>
            </TooltipTrigger>
            <TooltipContent>Click to view order details</TooltipContent>
          </Tooltip>
        ))}
      </TableBody>
      <OrderDetailsDialog
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </TooltipProvider>
  );
};

export default OrdersComponent;
