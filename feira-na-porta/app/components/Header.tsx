"use client";
import Link from "next/link";
import { useCart } from "../providers/CartContext";

export function Header() {
  const { cart } = useCart();
  
  // Conta quantos itens tem no total (ex: 2 alfaces + 1 queijo = 3 itens)
  const totalItens = cart.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <header className="bg-green-600 p-4 text-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:underline">
          Feira na Porta 🚜
        </Link>
        
        <Link 
          href="/carrinho" 
          className="bg-white text-green-700 px-4 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transition flex items-center gap-2"
        >
          🛒 Carrinho ({totalItens})
        </Link>
      </div>
    </header>
  );
}