import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import LoadingScreen from "@/components/LoadingScreen";
import CustomCursor from "@/components/CustomCursor";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Dang E Drive P.V.T. Limited - Reliable Taxi Service Across Nepal",
  description: "Dang E Drive P.V.T. Limited offers premium, reliable, and comfortable taxi and rental services connecting Dang with Kathmandu, Pokhara, Butwal, Nepalgunj, Chitwan, and other destinations across Nepal.",
  keywords: "dang taxi service, nepal travel, dang e drive, kathmandu taxi, pokhara travel booking, rental cars nepal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F8FAF8] text-[#1A1A1A] font-sans selection:bg-[#4CAF50] selection:text-white">
        <LoadingScreen />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
