"use client"; 
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; 
import { useRouter } from "next/navigation"; 

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [listaProdutos, setListaProdutos] = useState([]);
  
  // Estado para saber se estamos editando (guarda o ID do produto)
  const [idEmEdicao, setIdEmEdicao] = useState<number | null>(null);

  const [form, setForm] = useState({
    nome: "",
    preco: "",
    produtor: "",
    imagem: "" 
  });

  useEffect(() => {
    async function carregarDados() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      carregarProdutos();
      setLoading(false);
    }
    carregarDados();
  }, [router]);

  async function carregarProdutos() {
    const res = await fetch('/api/produtos');
    const dados = await res.json();
    setListaProdutos(dados);
  }

  async function handleImageUpload(e: any) {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('produtos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('produtos').getPublicUrl(filePath);
      setForm({ ...form, imagem: data.publicUrl });
      
    } catch (error: any) {
      alert('Erro no upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  }

  // ✏️ FUNÇÃO NOVA: Prepara o terreno para editar
  function prepararEdicao(produto: any) {
    setForm({
      nome: produto.nome,
      preco: produto.preco,
      produtor: produto.produtor,
      imagem: produto.imagem
    });
    setIdEmEdicao(produto.id); // Avisa o sistema que estamos editando esse ID
    
    // Leva a tela pra cima (pro formulário)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 🔄 FUNÇÃO NOVA: Cancela a edição e limpa tudo
  function cancelarEdicao() {
    setForm({ nome: "", preco: "", produtor: "", imagem: "" });
    setIdEmEdicao(null);
  }

  async function salvarProduto(e: any) {
    e.preventDefault(); 
    if (!form.imagem) {
      alert("Por favor, envie uma imagem!");
      return;
    }

    // DECISÃO: É Novo ou é Edição?
    if (idEmEdicao) {
      // --- MODO EDIÇÃO (PUT) ---
      await fetch('/api/produtos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, preco: parseFloat(form.preco), id: idEmEdicao })
      });
      alert("Produto atualizado com sucesso!");
    } else {
      // --- MODO CRIAÇÃO (POST) ---
      await fetch('/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, preco: parseFloat(form.preco) })
      });
      alert("Produto cadastrado!");
    }

    // Limpa a casa depois de salvar
    cancelarEdicao();
    carregarProdutos(); 
  }

  async function deletarProduto(id: number) {
    if (!confirm("Tem certeza?")) return;
    await fetch('/api/produtos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    carregarProdutos(); 
  }

  async function fazerLogout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  if (loading) return <p className="text-center mt-10">Carregando...</p>;

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Painel Admin 🔧</h1>
        <button onClick={fazerLogout} className="text-red-500 text-sm underline">Sair</button>
      </div>
      
      {/* Formulário Inteligente */}
      <div className={`p-4 rounded-lg mb-8 transition-colors ${idEmEdicao ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-100'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold">
            {idEmEdicao ? `✏️ Editando Produto #${idEmEdicao}` : '✨ Novo Produto'}
          </h2>
          {idEmEdicao && (
            <button onClick={cancelarEdicao} className="text-sm text-gray-500 underline">
              Cancelar Edição
            </button>
          )}
        </div>

        <form onSubmit={salvarProduto} className="flex flex-col gap-4">
          <input 
            placeholder="Nome" className="border p-2 rounded"
            value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})}
          />
          <div className="flex gap-4">
            <input 
              placeholder="Preço" type="number" className="border p-2 rounded w-1/2"
              value={form.preco} onChange={(e) => setForm({...form, preco: e.target.value})}
            />
            
            <div className="w-1/2">
              <label className="block text-sm text-gray-600 mb-1">
                {uploading ? 'Enviando...' : 'Foto do Produto'}
              </label>
              <input 
                type="file" accept="image/*"
                onChange={handleImageUpload} disabled={uploading}
                className="text-sm"
              />
            </div>
          </div>

          {form.imagem && (
            <div className="text-center">
              <img src={form.imagem} alt="Preview" className="h-24 object-contain mx-auto border bg-white rounded" />
              <p className="text-xs text-gray-400 mt-1">Imagem atual</p>
            </div>
          )}

          <input 
            placeholder="Produtor" className="border p-2 rounded"
            value={form.produtor} onChange={(e) => setForm({...form, produtor: e.target.value})}
          />
          
          <button 
            type="submit" disabled={uploading}
            className={`text-white p-3 rounded font-bold transition-colors disabled:bg-gray-400 ${idEmEdicao ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {uploading ? 'Aguarde...' : (idEmEdicao ? 'Salvar Alterações' : 'Cadastrar Produto')}
          </button>
        </form>
      </div>

      <h2 className="font-bold mb-4">Seus Produtos ({listaProdutos.length})</h2>
      <div className="space-y-2">
        {listaProdutos.map((prod: any) => (
          <div key={prod.id} className="flex justify-between items-center border p-3 rounded bg-white shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3">
              {prod.imagem.startsWith('http') ? (
                 <img src={prod.imagem} alt={prod.nome} className="w-12 h-12 object-cover rounded" />
              ) : (
                 <span className="text-2xl">{prod.imagem}</span>
              )}
              
              <div>
                <p className="font-bold">{prod.nome}</p>
                <p className="text-sm text-gray-500">R$ {prod.preco}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              {/* Botão EDITAR */}
              <button 
                onClick={() => prepararEdicao(prod)}
                className="bg-yellow-100 text-yellow-700 p-2 rounded hover:bg-yellow-200"
                title="Editar"
              >
                ✏️
              </button>

              {/* Botão EXCLUIR */}
              <button 
                onClick={() => deletarProduto(prod.id)}
                className="bg-red-50 text-red-600 p-2 rounded hover:bg-red-100"
                title="Excluir"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <br/>
      <a href="/" className="text-blue-500 underline text-center block">Voltar para a Loja</a>
    </main>
  );
}