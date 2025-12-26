"use client"; // Importante: Agora é interativo
import { useCart } from "../providers/CartContext";

interface ProductProps {
  produto: {
    id: number;
    nome: string;
    preco: number;
    produtor: string;
    imagem: string;
  }
}

export function ProductCard({ produto }: ProductProps) {
  const { addToCart } = useCart(); // Pegamos a função do cérebro

  // Verifica se é URL (Foto) ou Emoji
  const isFoto = produto.imagem.startsWith('http');

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white flex flex-col justify-between">
      <div>
        <div className="h-48 w-full mb-4 bg-gray-50 rounded-md overflow-hidden flex items-center justify-center">
          {isFoto ? (
            <img 
              src={produto.imagem} 
              alt={produto.nome} 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-6xl">{produto.imagem}</span>
          )}
        </div>
        
        <h3 className="font-bold text-lg text-gray-800">{produto.nome}</h3>
        <p className="text-sm text-gray-500 mb-2">Produtor: {produto.produtor}</p>
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <span className="text-green-700 font-bold text-xl">
          R$ {produto.preco.toFixed(2).replace('.', ',')}
        </span>
        
        {/* BOTÃO NOVO: Adiciona ao carrinho em vez de abrir link */}
        <button 
          onClick={() => addToCart(produto)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm font-medium transition-colors flex items-center gap-2"
        >
          <span>+</span> Adicionar
        </button>
      </div>
    </div>
  );
}