import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Para LEITURA (já existia)
export async function GET() {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .order('id', { ascending: true }); // Ordenei por ID para ficar bonitinho

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST: Para GRAVAÇÃO (Novo!)
export async function POST(request: Request) {
  // 1. Ler o JSON que o front-end mandou
  const body = await request.json();

  // 2. Mandar pro Supabase
  const { data, error } = await supabase
    .from('produtos')
    .insert([
      { 
        nome: body.nome, 
        preco: body.preco, 
        produtor: body.produtor, 
        imagem: body.imagem 
      }
    ])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE: Para apagar um produto
export async function DELETE(request: Request) {
  // Ler qual ID deve ser apagado
  const { id } = await request.json();

  const { error } = await supabase
    .from('produtos')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Apagado com sucesso" });
}

// PUT: Para ATUALIZAR um produto existente
export async function PUT(request: Request) {
  const body = await request.json();

  // A gente precisa do ID pra saber QUEM atualizar
  const { id, ...dadosParaAtualizar } = body;

  if (!id) {
    return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('produtos')
    .update(dadosParaAtualizar) // Atualiza só o que mudou
    .eq('id', id) // Onde o ID for igual ao enviado
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}