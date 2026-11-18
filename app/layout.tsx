import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Navbar from "@/components/Navbar";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Learnmate | AI learning companions",
  description: "Build a learning habit with personal, voice-powered AI companions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bricolage.variable} antialiased`}>
        <ClerkProvider appearance={{ variables: {
          colorPrimary: "#21695c",
          colorBackground: "#fbfcf8",
          colorText: "#20352f",
          colorInputBackground: "#fbfcf8",
          colorInputText: "#20352f",
        } }}>
          <Navbar />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
