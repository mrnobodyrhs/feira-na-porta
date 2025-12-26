"use client";
import { Header } from "../components/Header";
import { useCart } from "../providers/CartContext";
import Link from "next/link";

export default function CarrinhoPage() {
  const { cart, removeFromCart, total } = useCart();

  // Gera a mensagem para o WhatsApp
  const gerarLinkZap = () => {
    const numero = "5511911761996"; // SEU NÚMERO AQUI
    
    let mensagem = "*Olá! Gostaria de fazer um pedido:*\n\n";
    cart.forEach(item => {
      mensagem += `- ${item.quantidade}x ${item.nome} (R$ ${(item.preco * item.quantidade).toFixed(2)})\n`;
    });
    mensagem += `\n*Total: R$ ${total.toFixed(2)}*`;

    return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto p-4 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Seu Carrinho 🛒</h1>

        {cart.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">Seu carrinho está vazio.</p>
            <Link href="/" className="bg-green-600 text-white px-6 py-2 rounded font-bold">
              Voltar as Compras
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-4 border-b last:border-0">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800">{item.nome}</span>
                    <span className="text-sm text-gray-500">
                      {item.quantidade}x R$ {item.preco.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-800">
                      R$ {(item.preco * item.quantidade).toFixed(2)}
                    </span>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-full text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="p-4 bg-gray-100 flex justify-between items-center">
                <span className="text-gray-600 font-medium">Total do Pedido:</span>
                <span className="text-2xl font-bold text-green-700">
                  R$ {total.toFixed(2)}
                </span>
              </div>
            </div>

            <a 
              href={gerarLinkZap()}
              target="_blank"
              className="block w-full bg-green-600 text-white text-center py-4 rounded-lg font-bold text-xl hover:bg-green-700 shadow-lg transition transform hover:scale-[1.02]"
            >
              Finalizar Pedido no WhatsApp 📲
            </a>
            
            <Link href="/" className="block text-center mt-4 text-gray-500 text-sm hover:underline">
              Continuar comprando
            </Link>
          </>
        )}
      </div>
    </main>
  );
}