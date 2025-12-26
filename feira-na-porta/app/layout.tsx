import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./providers/CartContext";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Feira na Porta 🚜",
  description: "Produtos frescos, direto do produtor para sua mesa. Peça pelo WhatsApp!",
  openGraph: {
    title: "Feira na Porta 🚜",
    description: "Faça sua feira online e receba em casa.",
    siteName: "Feira na Porta",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {/* Envolvemos o site inteiro com o Provider */}
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}