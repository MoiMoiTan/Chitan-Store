import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import VoucherCircle from "@/components/VoucherCircle";
import StripeProvider from "@/components/StripeProvider";

const raleway = localFont({
  src: "../fonts/Raleway.woff2",
  variable: "--font-raleway",
  weight: "100 900",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Chitan Store app for shoppers",
  description: "An Ecommerce app for education purposes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={raleway.variable}>
      <body suppressHydrationWarning className="font-raleway antialiased">
        <ClerkProvider>
          <StripeProvider>
            <Header />
            <main>{children}</main>
            {/* <VoucherCircle code="SALE" discount="20%" /> */}
            <Footer />
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "#000000",
                  color: "#ffffff",
                },
              }}
            />
          </StripeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
