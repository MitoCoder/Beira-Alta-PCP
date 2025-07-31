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
        modelo: 'XPTO',
        ml: 500,
        tipo: 'Líquido',
        mediaVenda: 150,
        pedidoTotal: 320,
        estoqueAtual: 100,
        capacidadePortaPallet: 200,
        estoqueReal: 100,
        nivel: 'Alto',
        duracaoAtual: '2 dias',
        aposProduzir: 120,
        produzir: 20,
        dataProducao: '2025-07-28',
        ordem: 'ORD-015',
        linha: 'Linha 1',
        lote: 10,
        lote_op: 'L001',
        status: 'Pendente',
        faltaParaOMinimo: 50,
        qtdEmLitros: 250,
        undPorLitros: 2,
        saldoAposProducao: 140,
        diasAposProduzir: 4,
        hold: false,

        // Campos do inventário:
        und: 10,
        cx: 5,
        plt: 2,
        unidadePorCaixa: 12,
        caixasPorPallet: 48,
      },
      {
        id: 2,
        codigo: 'B002',
        descricao: 'Produto B',
        modelo: 'ZETA',
        ml: 1000,
        tipo: 'Sólido',
        mediaVenda: 100,
        pedidoTotal: 210,
        estoqueAtual: 50,
        capacidadePortaPallet: 150,
        estoqueReal: 50,
        nivel: 'Médio',
        duracaoAtual: '3 dias',
        aposProduzir: 80,
        produzir: 30,
        dataProducao: '2025-07-30',
        ordem: 'ORD-002',
        linha: 'Linha 2',
        lote: 20,
        lote_op: 'L002',
        status: 'Produzindo',
        faltaParaOMinimo: 25,
        qtdEmLitros: 400,
        undPorLitros: 4,
        saldoAposProducao: 130,
        diasAposProduzir: 5,
        hold: true,

        // Campos do inventário:
        und: 20,
        cx: 3,
        plt: 1,
        unidadePorCaixa: 6,
        caixasPorPallet: 40,
      },
    ];

    setProdutos(produtosMock);
  }, []);

  const produtosFiltrados = produtos.filter((produto) =>
    produto.codigo.toLowerCase().includes(filtro.toLowerCase()) ||
    produto.descricao.toLowerCase().includes(filtro.toLowerCase()) ||
    produto.lote.toString().includes(filtro) ||
    (produto.lote_op || '').toLowerCase().includes(filtro)
  );

  return { produtos: produtosFiltrados, setProdutos, filtro, setFiltro };
}
