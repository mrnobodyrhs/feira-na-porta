"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Definição do que é um Item no carrinho
interface CartItem {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
}

// Definição das funções que o carrinho vai ter
interface CartContextType {
  cart: CartItem[];
  addToCart: (produto: any) => void;
  removeFromCart: (id: number) => void;
  total: number;
  clearCart: () => void; // Função para limpar tudo
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // 1. Carregar carrinho salvo ao abrir o site (Persistência)
  useEffect(() => {
    const savedCart = localStorage.getItem("carrinho-feira");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // 2. Salvar carrinho sempre que mudar
  useEffect(() => {
    localStorage.setItem("carrinho-feira", JSON.stringify(cart));
  }, [cart]);

  // Função: Adicionar Produto
  function addToCart(produto: any) {
    setCart((prev) => {
      // Verifica se o item já existe
      const itemExistente = prev.find((item) => item.id === produto.id);

      if (itemExistente) {
        // Se já existe, só aumenta a quantidade (+1)
        return prev.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      } else {
        // Se não existe, adiciona o novo
        return [...prev, { 
          id: produto.id, 
          nome: produto.nome, 
          preco: produto.preco, 
          quantidade: 1 
        }];
      }
    });
    alert("Produto adicionado ao carrinho!"); // Feedback visual rápido
  }

  // Função: Remover Produto
  function removeFromCart(id: number) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  // Função: Limpar Carrinho
  function clearCart() {
    setCart([]);
  }

  // Mágica: Calcular Total R$
  const total = cart.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, total, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

// Hook para usar o carrinho em qualquer lugar
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart deve ser usado dentro de um CartProvider");
  return context;
}