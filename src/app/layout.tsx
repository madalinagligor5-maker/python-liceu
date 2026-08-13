import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeaderConditional from "@/components/HeaderConditional";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Academia Python — Învață Python pentru liceu, clasele IX-XII",
  description:
    "Platformă educațională pentru disciplina Informatică (Python), conform programei oficiale de liceu. Drum de învățare vizual, exerciții interactive, primele lecții gratuite.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ro"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background">
        <HeaderConditional>
          <Header />
        </HeaderConditional>
        <main className="flex-1">{children}</main>
        <HeaderConditional>
          <Footer />
        </HeaderConditional>
      </body>
    </html>
  );
}
