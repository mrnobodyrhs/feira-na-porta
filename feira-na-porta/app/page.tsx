import { ProductCard } from "./components/ProductCard";
import { Header } from "./components/Header";
import { supabase } from "../lib/supabase"; // <--- Importamos o banco direto!

// Atenção: Removemos a função 'buscarProdutos' com fetch
// Agora fazemos a busca direto no componente

export default async function Home() {
  // Busca direta no banco (Sem URL, sem localhost, à prova de falhas)
  const { data: produtos, error } = await supabase
    .from('produtos')
    .select('*');

  if (error) {
    console.error("Erro ao carregar produtos:", error);
  }

  // Se der erro ou vier vazio, garante que seja um array para não quebrar a tela
  const listaProdutos = produtos || [];

  return (
    <main className="min-h-screen bg-gray-50">
      <Header /> 

      <section className="container mx-auto p-4 mt-4">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Produtos Fresquinhos</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listaProdutos.length === 0 && <p>Nenhum produto encontrado.</p>}

          {listaProdutos.map((item: any) => (
            <ProductCard key={item.id} produto={item} />
          ))}
        </div>
      </section>
    </main>
  );
}