import stripe from "@/lib/stripe";
import { backendClient } from "@/sanity/lib/backendClient";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

interface ShippingAddress {
  name?: string;
  address?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Creating order in Sanity for payment:', paymentIntent.id);
    
    // Lấy metadata từ payment intent
    const metadata = paymentIntent.metadata;
    console.log('Payment intent metadata:', metadata);
    
    let orderItems = [];
    let shippingAddress = {} as ShippingAddress;
    
    try {
      orderItems = JSON.parse(metadata.orderItems || '[]');
      console.log('Parsed order items:', orderItems);
    } catch (error) {
      console.error('Error parsing orderItems:', error);
      orderItems = [];
    }

    try {
      shippingAddress = JSON.parse(metadata.shippingAddress || '{}') as ShippingAddress;
      console.log('Parsed shipping address:', shippingAddress);
    } catch (error) {
      console.error('Error parsing shippingAddress:', error);
      shippingAddress = {} as ShippingAddress;
    }

    // Log thêm để debug
    console.log('Raw metadata:', metadata);
    console.log('Shipping address before processing:', shippingAddress);

    // Lấy thông tin invoice nếu có
    let invoice = null;
    try {
      // Tạo customer nếu chưa có
      let customer = paymentIntent.customer as string;
      if (!customer) {
        const email = metadata.email || paymentIntent.receipt_email;
        if (email) {
          const customerData = await stripe.customers.create({
            email: email,
            name: metadata.customerName || shippingAddress.name || undefined,
            phone: shippingAddress.phone || undefined
          });
          customer = customerData.id;
        }
      }

      if (!customer) {
        throw new Error('No customer ID available for invoice creation');
      }

      // Tạo invoice item
      const invoiceItem = await stripe.invoiceItems.create({
        customer: customer,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        description: `Order ${paymentIntent.id}`
      });

      // Tạo invoice
      invoice = await stripe.invoices.create({
        customer: customer,
        collection_method: 'charge_automatically',
        auto_advance: true,
        metadata: {
          paymentIntentId: paymentIntent.id
        }
      });

      // Finalize invoice
      if (invoice.status === 'draft') {
        invoice = await stripe.invoices.finalizeInvoice(invoice.id);
      }
      
      // Pay invoice
      if (invoice.status === 'open') {
        invoice = await stripe.invoices.pay(invoice.id);
      }

      console.log('Created and finalized invoice:', invoice);
    } catch (error) {
      console.error('Error creating/finalizing invoice:', error);
    }
    
    // Tạo order trong Sanity với đầy đủ trường theo schema
    const orderData = {
      _type: 'order',
      orderNumber: paymentIntent.id,
      stripePaymentIntentId: paymentIntent.id,
      stripeCustomerId: paymentIntent.customer as string || 'anonymous',
      clerkUserId: metadata.userId || 'anonymous',
      customerName: shippingAddress.name || metadata.customerName || 'Guest',
      email: metadata.email || paymentIntent.receipt_email || 'no-email@example.com',
      products: orderItems.map((item: any) => ({
        _key: Math.random().toString(36).substring(7),
        product: {
          _type: 'reference',
          _ref: item.id
        },
        quantity: item.quantity
      })),
      totalPrice: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      amountDiscount: 0,
      status: 'paid',
      orderDate: new Date().toISOString(),
      shippingAddress: {
        name: shippingAddress.name || '',
        line1: shippingAddress.address || '',
        line2: shippingAddress.line2 || '',
        city: shippingAddress.city || '',
        state: shippingAddress.state || '',
        postal_code: shippingAddress.postalCode || '',
        country: shippingAddress.country || '',
        phone: shippingAddress.phone || ''
      },
      invoice: {
        id: invoice?.id || '',
        number: invoice?.number || '',
        hosted_invoice_url: invoice?.hosted_invoice_url || '',
        invoice_pdf: invoice?.invoice_pdf || ''
      },
      stripeCheckoutSessionId: metadata.sessionId || ''
    };

    console.log('Creating order with data:', JSON.stringify(orderData, null, 2));
    const order = await backendClient.create(orderData);
    console.log('Order created successfully:', order);
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_KEY!
    );

    console.log('Webhook event received:', event.type);

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Processing payment intent:', paymentIntent.id);
        const order = await handlePaymentIntentSucceeded(paymentIntent);
        console.log('Order created:', order._id);
        break;

      case 'charge.succeeded':
        const charge = event.data.object as Stripe.Charge;
        console.log('Charge succeeded:', charge.id);
        // Không cần xử lý thêm vì payment_intent.succeeded đã tạo order
        break;

      case 'payment_intent.created':
        console.log('Payment intent created:', event.data.object.id);
        break;

      case 'charge.updated':
        console.log('Charge updated:', event.data.object.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: `Webhook Error: ${error}` },
      { status: 400 }
    );
  }
}
