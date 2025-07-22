import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { Toaster } from 'react-hot-toast';
import ClientNavbarWrapper from './components/ClientNavbarWrapper';

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto"
});

export const metadata: Metadata = {
  title: "JAM WITH AIISI",
  description: "Developed BY IAN FRANK ODUNDO",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} antialiased`}>
        <ClientNavbarWrapper />
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
