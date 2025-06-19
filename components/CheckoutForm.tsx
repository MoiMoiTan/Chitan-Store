"use client";

import { useState, useEffect } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserResource } from "@clerk/types";
import { urlFor } from "@/sanity/lib/image";
import Loading from "./Loading";

// Define the CartItem interface
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

// Define the CheckoutFormProps interface
interface CheckoutFormProps {
  items: CartItem[];
  total: number;
  discount: number;
  user?: UserResource | null;
}

// Define the FormData interface
interface FormData {
  customerName: string;
  email: string;
  phoneNumber: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

// Explicitly type the component with CheckoutFormProps
const CheckoutForm: React.FC<CheckoutFormProps> = ({
  items,
  total,
  discount,
  user,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    customerName: "",
    email: "",
    phoneNumber: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "VN",
    },
  });

  // Prefill form with user data if available
  useEffect(() => {
    if (user) {
      setFormData({
        customerName: user.fullName || "",
        email: user.emailAddresses[0]?.emailAddress || "",
        phoneNumber: user.phoneNumbers[0]?.phoneNumber || "",
        address: {
          line1: "",
          line2: "",
          city: "",
          state: "",
          postal_code: "",
          country: "VN",
        },
      });
    }
  }, [user]);

  useEffect(() => {
    if (stripe && elements) {
      setIsReady(true);
    }
  }, [stripe, elements]);

  if (!isReady) {
    return <Loading />;
  }

  // Handle input changes with proper type safety
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof FormData,
    subField?: keyof FormData["address"]
  ) => {
    if (subField && field === "address") {
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [subField]: e.target.value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [field]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      setError("Stripe has not been initialized.");
      return;
    }

    // Validate required fields
    if (
      !formData.customerName ||
      !formData.email ||
      !formData.address.line1 ||
      !formData.address.city ||
      !formData.address.postal_code ||
      !formData.address.country
    ) {
      setError("Please fill in all required fields (name, email, address).");
      return;
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card element not found.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shippingAddress: {
            name: formData.customerName,
            email: formData.email,
            address: formData.address.line1,
            line2: formData.address.line2,
            city: formData.address.city,
            state: formData.address.state,
            postalCode: formData.address.postal_code,
            country: formData.address.country,
            phone: formData.phoneNumber,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment intent.");
      }

      const { clientSecret } = data;
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: formData.customerName,
              email: formData.email,
              phone: formData.phoneNumber,
              address: {
                line1: formData.address.line1,
                line2: formData.address.line2,
                city: formData.address.city,
                state: formData.address.state,
                postal_code: formData.address.postal_code,
                country: formData.address.country,
              },
            },
          },
        });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent?.status === "succeeded") {
        toast.success("Checkout Successfully!");
        router.replace(`/success?payment_intent=${paymentIntent.id}`);
        return;
      } else {
        throw new Error("Payment failed. Please try again.");
      }
    } catch (err: any) {
      setError(
        err.message || "An error occurred during payment. Please try again."
      );
      toast.error(err.message || "Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      {/* Order Summary Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Order Summary
        </h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.product._id}
              className="flex items-center gap-4 border-b pb-4 last:border-b-0"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0">
                {item.product.images && item.product.images[0] && (
                  <img
                    src={urlFor(item.product.images[0]).url()}
                    alt={item.product.name || "Product Image"}
                    className="w-full h-full object-cover rounded-md"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-700">
                  {item.product.name || "Unnamed Product"}
                </p>
                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>
              <p className="font-semibold text-gray-800">
                $
                {(
                  (item.product.discountPrice || item.product.price) *
                  item.quantity
                ).toFixed(2)}
              </p>
            </div>
          ))}
          <div className="border-t pt-4 space-y-3">
            {discount > 0 && (
              <div className="flex justify-between text-gray-600">
                <p>Subtotal:</p>
                <p>${(total + discount).toFixed(2)}</p>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <p>Discount:</p>
                <p>-${discount.toFixed(2)}</p>
              </div>
            )}
            <div className="flex justify-between text-lg font-semibold text-gray-800">
              <p>Total:</p>
              <p>${total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Form Section */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md space-y-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Payment Details
        </h2>
        {error && (
          <p className="text-red-500 bg-red-50 p-3 rounded-md text-sm">
            {error}
          </p>
        )}
        <div className="space-y-5">
          {/* Customer Information */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label
                htmlFor="customerName"
                className="text-gray-700 font-medium"
              >
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => handleInputChange(e, "customerName")}
                required
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm transition-all duration-200"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange(e, "email")}
                required
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <Label
                htmlFor="phoneNumber"
                className="text-gray-700 font-medium"
              >
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange(e, "phoneNumber")}
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm transition-all duration-200"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="line1" className="text-gray-700 font-medium">
                Address Line 1 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="line1"
                value={formData.address.line1}
                onChange={(e) => handleInputChange(e, "address", "line1")}
                required
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm transition-all duration-200"
                placeholder="Enter your address"
              />
            </div>
            <div>
              <Label htmlFor="line2" className="text-gray-700 font-medium">
                Address Line 2 (Optional)
              </Label>
              <Input
                id="line2"
                value={formData.address.line2}
                onChange={(e) => handleInputChange(e, "address", "line2")}
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm transition-all duration-200"
                placeholder="Apartment, suite, etc."
              />
            </div>
            <div>
              <Label htmlFor="city" className="text-gray-700 font-medium">
                City <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                value={formData.address.city}
                onChange={(e) => handleInputChange(e, "address", "city")}
                required
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm transition-all duration-200"
                placeholder="Enter your city"
              />
            </div>
            <div>
              <Label htmlFor="state" className="text-gray-700 font-medium">
                State (Optional)
              </Label>
              <Input
                id="state"
                value={formData.address.state}
                onChange={(e) => handleInputChange(e, "address", "state")}
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm transition-all duration-200"
                placeholder="Enter your state"
              />
            </div>
            <div>
              <Label
                htmlFor="postal_code"
                className="text-gray-700 font-medium"
              >
                Postal Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="postal_code"
                value={formData.address.postal_code}
                onChange={(e) =>
                  handleInputChange(e, "address", "postal_code")
                }
                required
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm transition-all duration-200"
                placeholder="Enter your postal code"
              />
            </div>
            <div>
              <Label
                htmlFor="country"
                className="text-gray-700 font-medium"
              >
                Country <span className="text-red-500">*</span>
              </Label>
              <Input
                id="country"
                value={formData.address.country}
                onChange={(e) => handleInputChange(e, "address", "country")}
                required
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm transition-all duration-200"
                placeholder="Enter your country"
              />
            </div>
          </div>

          {/* Card Details */}
          <div>
            <Label className="text-gray-700 font-medium">
              Card Details <span className="text-red-500">*</span>
            </Label>
            <div className="mt-1 border border-gray-300 rounded-md p-3 bg-gray-50">
              {stripe && elements && (
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": { color: "#aab7c4" },
                      },
                      invalid: { color: "#9e2146" },
                    },
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading || !stripe || !elements}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md shadow-md transition-all duration-200"
        >
          {loading ? "Processing..." : `Pay $${total.toFixed(2)}`}
        </Button>
      </form>
    </div>
  );
};

export default CheckoutForm;
