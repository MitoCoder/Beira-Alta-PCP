// src/servicos/api.js

const BASE_URL = 'https://api-controle-ecru.vercel.app';

export async function buscarProdutosDaAPI() {
  try {
    const resposta = await fetch(`${BASE_URL}/?action=read`);
    const json = await resposta.json();
    return json.result === 'success' ? json.data : [];
  } catch (erro) {
    console.error('Erro ao buscar produtos:', erro);
    return [];
  }
}

export async function atualizarProdutoNaAPI(produto) {
  try {
    const resposta = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'update',
        ...produto,
      }),
    });

    const resultado = await resposta.json();
    if (resultado.result !== 'success') {
      console.warn('Falha ao atualizar produto:', resultado.message);
    }
  } catch (erro) {
    console.error('Erro ao atualizar produto:', erro);
  }
}
