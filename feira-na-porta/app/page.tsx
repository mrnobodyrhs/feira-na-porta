import { ProductCard } from "./components/ProductCard";
import { Header } from "./components/Header"; // <--- 1. Importamos o cabeçalho inteligente aqui

// Função que vai lá no seu Back-end buscar os dados
async function buscarProdutos() {
  const resposta = await fetch('http://localhost:3000/api/produtos', { 
    cache: 'no-store' 
  });
  
  if (!resposta.ok) {
    throw new Error('Falha ao carregar os produtos');
  }

  return resposta.json();
}

export default async function Home() {
  const produtos = await buscarProdutos();

  return (
    <main className="min-h-screen bg-gray-50">
      
      {/* 2. Aqui a gente deletou o <header> antigo e colocou o novo */}
      <Header /> 

      <section className="container mx-auto p-4 mt-4">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Produtos Fresquinhos (Vindo da API)</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {produtos.length === 0 && <p>Nenhum produto encontrado.</p>}

          {produtos.map((item: any) => (
            <ProductCard key={item.id} produto={item} />
          ))}
        </div>
      </section>
    </main>
  );
}