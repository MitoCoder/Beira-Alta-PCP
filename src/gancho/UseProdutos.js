// src/gancho/useProdutos.js
import { useState, useEffect } from 'react';

export default function useProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const produtosMock = [
      {
        id: 1,
        codigo: 'A001',
        descricao: 'Produto A',
        mediaVenda: 150,
        capacidadePortaPallet: 200,
        estoqueReal: 100,
        nivel: 'Alto',
        duracaoAtual: '2 dias',
        aposProduzir: 120,
        produzir: 0,
        dataProducao: '',
        ordem: 1,
        linha: 'Linha 1',
        lote: 10,
        status: 'Pendente',
      },
      {
        id: 2,
        codigo: 'B002',
        descricao: 'Produto B',
        mediaVenda: 100,
        capacidadePortaPallet: 150,
        estoqueReal: 50,
        nivel: 'Médio',
        duracaoAtual: '3 dias',
        aposProduzir: 80,
        produzir: 0,
        dataProducao: '',
        ordem: 2,
        linha: 'Linha 2',
        lote: 20,
        status: 'Produzindo',
      },
    ];
    setProdutos(produtosMock);
  }, []);

  const produtosFiltrados = produtos.filter((produto) =>
    produto.codigo.toLowerCase().includes(filtro.toLowerCase()) ||
    produto.descricao.toLowerCase().includes(filtro.toLowerCase()) ||
    produto.lote.toString().includes(filtro)
  );

  return { produtos: produtosFiltrados, setProdutos, filtro, setFiltro };
}
