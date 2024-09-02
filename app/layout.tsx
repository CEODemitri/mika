import type { Metadata } from "next";
import { Livvic } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar";

const livvic = Livvic({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '700']});

export const metadata: Metadata = {
  title: "Mika: for Kosmonauts",
  description: "Explore the kosmos from your fingertips",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={livvic.className}>
        <Navbar/>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
      </body>
    </html>
  );
}
