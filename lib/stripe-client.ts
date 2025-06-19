import { loadStripe, Stripe } from "@stripe/stripe-js";

const initializeStripe = async (): Promise<Stripe | null> => {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    console.error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined");
    return null;
  }

  try {
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    );
    return stripe;
  } catch (error) {
    console.error("Failed to initialize Stripe:", error);
    return null;
  }
};

const stripePromise = initializeStripe();

export default stripePromise;
