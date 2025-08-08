import { useState, useEffect } from 'react';
import { buscarProdutosDaAPI, atualizarProdutoNaAPI } from '../servicos/api';

export default function useProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [alteracoesLocais, setAlteracoesLocais] = useState({});

  async function carregarProdutos() {
    setCarregando(true);
    try {
      const produtosDaAPI = await buscarProdutosDaAPI();

      const produtosMapeados = produtosDaAPI.map((item) => ({
        id: item.id,
        codigo: String(item.codigo),
        descricao: item.descricao || '',
        modelo: item.modelo || '',
        ml: Number(item.ml) || 0,
        tipo: item.tipo || '',
        mediaVenda: Number(item.media_venda) || 0,
        pedidoTotal: Number(item.pedido_total) || 0,
        estoqueAtual: Number(item.estoque_atual) || 0,
        capacidadePortaPallet: Number(item.capacidade_porta_pallet) || 0,
        estoqueReal: Number(item.estoque_real) || 0,
        nivel: item.nivel || '',
        duracaoAtual: item.duracao_atual || '',
        aposProduzir: Number(item.apos_produzir) || 0,
        produzir: Number(item.produzir) || 0,
        dataProducao: item.data_producao || '',
        ordem: item.ordem || '',
        linha: item.linha || '',
        lote_op: item.lote_op || '',
        status: item.status || '',
        faltaParaOMinimo: Number(item.falta_para_o_minimo) || 0,
        qtdEmLitros: Number(item.qtd_em_litros) || 0,
        undPorLitros: Number(item.und_por_litros) || 0,
        saldoAposProducao: Number(item.saldo_apos_producao) || 0,
        diasAposProduzir: Number(item.dias_apos_produzir) || 0,
        hold: item.hold || '',
        und: Number(item.und) || 0,
        cx: Number(item.cx) || 0,
        plt: Number(item.plt) || 0,
        unidadePorCaixa: Number(item.unidadePorCaixa) || 0,
        caixasPorPallet: Number(item.caixasPorPallet) || 0,
        dataInventario: item.dataInventario || '',
        total_Inventario: Number(item.total_Inventario) || 0,
      }));

      setProdutos(produtosMapeados);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  const produtosFiltrados = produtos.filter((produto) =>
    produto.codigo.toLowerCase().includes(filtro.toLowerCase()) ||
    produto.descricao.toLowerCase().includes(filtro.toLowerCase()) ||
    (produto.lote_op || '').toLowerCase().includes(filtro.toLowerCase())
  );

  const editarCampo = (id, campo, valor) => {
    setProdutos((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [campo]: valor } : item
      )
    );

    setAlteracoesLocais(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [campo]: valor,
        id: id
      }
    }));
  };

  const salvarAlteracoes = async () => {
    if (Object.keys(alteracoesLocais).length === 0) {
      return { success: false, message: 'Nenhuma alteração para salvar' };
    }

    try {
      await Promise.all(
        Object.values(alteracoesLocais).map(produto =>
          atualizarProdutoNaAPI(produto)
        )
      );

      setAlteracoesLocais({});
      await carregarProdutos();

      return { success: true, message: 'Alterações salvas com sucesso!' };
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      return { success: false, message: 'Erro ao salvar alterações' };
    }
  };

  const salvarInventario = async () => {
    const agora = new Date();
    const dataFormatada = agora.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    try {
      const atualizados = await Promise.all(
        produtos.map(async (item) => {
          const und = Number(item.und) || 0;
          const cx = Number(item.cx) || 0;
          const plt = Number(item.plt) || 0;
          const undPorCx = Number(item.unidadePorCaixa) || 0;
          const cxPorPlt = Number(item.caixasPorPallet) || 0;

          const total = und + cx * undPorCx + plt * cxPorPlt * undPorCx;

          const itemAtualizado = {
            ...item,
            total_Inventario: total,
            dataInventario: dataFormatada,
          };

          await atualizarProdutoNaAPI(itemAtualizado);
          return itemAtualizado;
        })
      );

      setProdutos(atualizados);
      return { success: true, message: 'Inventário salvo com sucesso!' };
    } catch (error) {
      console.error('Erro ao salvar inventário:', error);
      return { success: false, message: 'Erro ao salvar inventário' };
    }
  };

  const atualizarTotaisPedidos = (totaisPorCodigo) => {
    setProdutos((prevProdutos) =>
      prevProdutos.map((produto) => {
        const totalAtualizado = totaisPorCodigo[produto.codigo] ?? produto.pedidoTotal;
        return {
          ...produto,
          pedidoTotal: totalAtualizado,
        };
      })
    );
  };

  return {
    produtos: produtosFiltrados,
    setProdutos,
    filtro,
    setFiltro,
    editarCampo,
    salvarAlteracoes,
    salvarInventario,
    atualizarTotaisPedidos,
    carregando,
    alteracoesLocais
  };
}