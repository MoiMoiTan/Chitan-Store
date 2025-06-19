"use client";

import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import useCartStore from "@/store";
import CheckoutForm from "@/components/CheckoutForm";
import Container from "@/components/Container";
import { stripeAppearance } from "./stripe-appearance";
import Image from "next/image";
import stripePromise from "@/lib/stripe-client";
import { useUser } from "@clerk/nextjs";
import Loading from "@/components/Loading";

// Define CartItem interface to match CheckoutForm.tsx
interface CartItem {
  product: {
    _id: string;
    name?: string;
    price: number;
    discountPrice?: number;
    images?: any[];
    variant?: string;
    slug?: { current: string };
  };
  quantity: number;
}

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { getGroupedItems, getTotalPrice, getSubtotalPrice } = useCartStore();
  const { user } = useUser();

  const items: CartItem[] = getGroupedItems().map((item) => ({
    ...item,
    product: {
      ...item.product,
      price: item.product.price ?? 0,
      discountPrice: item.product.discount ?? undefined,
      slug: item.product.slug
        ? { current: item.product.slug.current || "" }
        : undefined,
    },
  }));

  const total = getTotalPrice();
  const subtotal = getSubtotalPrice();
  const amountDiscount = subtotal - total;

  useEffect(() => {
    // Tránh tạo payment intent khi không cần thiết
    if (!items.length) return;
    
    const timer = setTimeout(() => {
      if (!clientSecret) {
        createPaymentIntent();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [items, clientSecret]);

  const createPaymentIntent = async () => {
    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          metadata: {
            customerName: user?.fullName || "",
            email: user?.emailAddresses[0]?.emailAddress || "",
            phoneNumber: user?.phoneNumbers[0]?.phoneNumber || "",
            address: {
              line1: "",
              line2: "",
              city: "",
              state: "",
              postal_code: "",
              country: "VN",
            },
            discount: amountDiscount,
          },
        }),
      });

      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        setError(data.error || "Failed to create payment session.");
      }
    } catch (err) {
      setError(
        "An error occurred while creating the payment session. Please try again."
      );
    }
  };

  if (items.length === 0) {
    return (
      <Container>
        <div className="py-8 text-red-500 text-lg font-semibold text-center">
          Your cart is empty. Please add products to continue.
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="py-8 text-red-500 text-lg font-semibold text-center">
          {error}
        </div>
      </Container>
    );
  }

  if (!clientSecret) {
    return <Loading />;
  }

  return (
    <Container>
      <div className="py-8">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold">Checkout - Chitan Store</h1>
        </div>
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: stripeAppearance,
            locale: "en",
          }}
        >
          <CheckoutForm
            items={items}
            total={total}
            discount={amountDiscount}
            user={user}
          />
        </Elements>
      </div>
    </Container>
  );
}
