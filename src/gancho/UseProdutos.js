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
        lote_op: 'L001',
        status: 'Pendente',
        faltaParaOMinimo: 50,
        qtdEmLitros: 250,
        undPorLitros: 2,
        saldoAposProducao: 140,
        diasAposProduzir: 4,
        hold: 'A',
        und: 10,
        cx: 5,
        plt: 2,
        unidadePorCaixa: 12,
        caixasPorPallet: 48,
        dataInventario: '',
        total_inventario: 0,
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
        lote_op: 'L002',
        status: 'Produzindo',
        faltaParaOMinimo: 25,
        qtdEmLitros: 400,
        undPorLitros: 4,
        saldoAposProducao: 130,
        diasAposProduzir: 5,
        hold: 'C',
        und: 20,
        cx: 3,
        plt: 1,
        unidadePorCaixa: 6,
        caixasPorPallet: 40,
        dataInventario: '',
        total_inventario: 0,
      },
    ];
    setProdutos(produtosMock);
  }, []);

  const produtosFiltrados = produtos.filter((produto) =>
    produto.codigo.toLowerCase().includes(filtro.toLowerCase()) ||
    produto.descricao.toLowerCase().includes(filtro.toLowerCase()) ||
    (produto.lote_op || '').toLowerCase().includes(filtro.toLowerCase())
  );

  const editarCampoInventario = (id, campo, valor) => {
    setProdutos((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, [campo]: valor }
          : item
      )
    );
  };

  const salvarInventario = () => {
    setProdutos((prev) => {
      const agora = new Date();
      const dataFormatada = agora.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      return prev.map((item) => {
        const und = Number(item.und) || 0;
        const cx = Number(item.cx) || 0;
        const plt = Number(item.plt) || 0;
        const undPorCx = Number(item.unidadePorCaixa) || 0;
        const cxPorPlt = Number(item.caixasPorPallet) || 0;

        const total = und + (cx * undPorCx) + (plt * cxPorPlt * undPorCx);

        return {
          ...item,
          total_inventario: total,
          dataInventario: dataFormatada,
        };
      });
    });
  };

  return {
    produtos: produtosFiltrados,
    setProdutos,
    filtro,
    setFiltro,
    editarCampoInventario,
    salvarInventario,
  };
}
