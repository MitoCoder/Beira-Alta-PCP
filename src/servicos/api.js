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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const payload = { action: 'update', id: produto.id };
    Object.keys(produto).forEach(key => {
      if (key !== 'id' && produto[key] !== undefined) {
        payload[key] = produto[key];
      }
    });

    const resposta = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const resultado = await resposta.json();
    if (resultado.result !== 'success') {
      console.warn('Falha ao atualizar produto:', resultado.message);
      throw new Error(resultado.message);
    }
    return resultado;
  } catch (erro) {
    console.error('Erro ao atualizar produto:', erro);
    throw erro;
  }
}