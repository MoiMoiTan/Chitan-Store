import stripe from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    discountPrice?: number;
  };
  quantity: number;
}

interface Metadata {
  customerName?: string; // Make optional
  userId?: string;
  email?: string; // Make optional
  phoneNumber?: string; // Already optional
  address?: {
    // Make optional
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
  discount?: number;
}

export async function OPTIONS(req: Request) {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }
  );
}

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not initialized" },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    );
  }

  const { userId } = await auth();

  try {
    const { items, shippingAddress } = await req.json();

    // Tạo session ID duy nhất cho đơn hàng này
    const sessionId = `ses_${Math.random().toString(36).substring(2)}`;

    // Tính total (giá gốc)
    const total = items.reduce((acc: number, item: CartItem) => {
      return acc + (item.product.price ?? 0) * item.quantity;
    }, 0);

    // Tính subtotal (giá sau khi cộng thêm discount)
    const subtotal = items.reduce((acc: number, item: CartItem) => {
      const price = item.product.price ?? 0;
      const discount = ((item.product.discountPrice ?? 0) * price) / 100;
      const discountedPrice = price + discount;
      return acc + discountedPrice * item.quantity;
    }, 0);

    // Tính discount amount
    const discountAmount = subtotal - total;

    if (total <= 0) {
      return NextResponse.json(
        { error: "Total amount must be greater than zero" },
        { status: 400 }
      );
    }

    console.log('Creating payment intent:', { 
      total,
      subtotal,
      discountAmount,
      items 
    });

    // Tối ưu dữ liệu items và shipping address trước khi gửi
    const optimizedItems = items.map((item: CartItem) => ({
      id: item.product._id,
      quantity: item.quantity
    }));

    // Kiểm tra và xử lý shippingAddress undefined
    const optimizedShippingAddress = shippingAddress ? {
      name: shippingAddress.name || '',
      address: shippingAddress.line1 || shippingAddress.address || '',
      city: shippingAddress.city || '',
      state: shippingAddress.state || '',
      postalCode: shippingAddress.postal_code || shippingAddress.postalCode || '',
      country: shippingAddress.country || '',
      phone: shippingAddress.phone || '',
      email: shippingAddress.email || ''
    } : {
      name: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      phone: '',
      email: ''
    };

    console.log('Optimized shipping address:', optimizedShippingAddress);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderItems: JSON.stringify(optimizedItems),
        shippingAddress: JSON.stringify(optimizedShippingAddress),
        userId: userId || '',
        sessionId: sessionId,
        customerName: optimizedShippingAddress.name,
        email: optimizedShippingAddress.email || ''
      }
    });

    return NextResponse.json(
      { clientSecret: paymentIntent.client_secret },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    );
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create payment intent" },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    );
  }
}
