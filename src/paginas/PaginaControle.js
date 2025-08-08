// src/paginas/ControleProducao.js
import React, { useState, useMemo } from 'react';
import LayoutPrincipal from '../componentes/LayoutPrincipal';
import useProdutos from '../gancho/UseProdutos';
import {
  Box,
  Button,
  Grid,
  Modal,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import TabelaProdutosEdicao from '../componentes/TabelaProdutosEdicao';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 480,
  maxWidth: '90vw',
  bgcolor: 'background.paper',
  p: 4,
  borderRadius: 2,
  boxShadow: 24,
};

export default function ControleProducao() {
  const { produtos, setProdutos } = useProdutos();

  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [novoProduto, setNovoProduto] = useState({
    codigo: '',
    descricao: '',
    mediaVenda: '',
    capacidadePortaPallet: '',
    estoqueReal: '',
    nivel: '',
    duracaoAtual: '',
    aposProduzir: '',
    produzir: '',
    dataProducao: '',
    ordem: '',
    linha: '',
    lote_op: '',
    status: 'Pendente',
  });

  const produtosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();
    if (!termo) return produtos;

    return produtos.filter((p) => {
      const descricao = (p.descricao || '').toString().toLowerCase();
      const codigo = (p.codigo || '').toString().toLowerCase();
      const lote_op = (p.lote_op || '').toString().toLowerCase();
      return descricao.includes(termo) || codigo.includes(termo) || lote_op.includes(termo);
    });
  }, [busca, produtos]);

  const totalQuantidade = produtos.reduce(
    (acc, cur) => acc + Number(cur.estoqueReal || 0),
    0
  );

  // Função para editar qualquer campo do produto (aceita letras e números)
  const editarCampo = (id, campo, valor) => {
    const novaLista = produtos.map((p) =>
      p.id === id ? { ...p, [campo]: valor } : p
    );
    setProdutos(novaLista);
  };

  const abrirModal = () => setModalAberto(true);
  const fecharModal = () => {
    setModalAberto(false);
    setNovoProduto({
      codigo: '',
      descricao: '',
      mediaVenda: '',
      capacidadePortaPallet: '',
      estoqueReal: '',
      nivel: '',
      duracaoAtual: '',
      aposProduzir: '',
      produzir: '',
      dataProducao: '',
      ordem: '',
      linha: '',
      lote_op: '',
      status: 'Pendente',
    });
  };

  const alterarNovoProduto = (campo, valor) => {
    setNovoProduto((old) => ({ ...old, [campo]: valor }));
  };

  const adicionarProduto = () => {
    if (!novoProduto.codigo.trim() || !novoProduto.descricao.trim()) return;

    const novo = {
      ...novoProduto,
      id: produtos.length > 0 ? Math.max(...produtos.map((p) => p.id)) + 1 : 1,
      // não converto para número para permitir valores livres (strings)
      // Se quiser converter para números em algum lugar, faça depois da edição
      mediaVenda: novoProduto.mediaVenda,
      capacidadePortaPallet: novoProduto.capacidadePortaPallet,
      estoqueReal: novoProduto.estoqueReal,
      aposProduzir: novoProduto.aposProduzir,
      produzir: novoProduto.produzir,
      ordem: novoProduto.ordem,
      lote_op: novoProduto.lote_op,
    };

    setProdutos([...produtos, novo]);
    fecharModal();
  };

  return (
    <LayoutPrincipal>
      <Box
        sx={{
          maxWidth: 1440,
          mx: 'auto',
          px: 2,
          pt: 3,
          pb: 6,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Controle de Produção
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField
            label="Buscar Código ou Descrição"
            variant="outlined"
            size="medium"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 280 }}
          />
          <Button variant="contained" size="medium" onClick={abrirModal}>
            Adicionar Produto
          </Button>
        </Stack>

        <Typography variant="subtitle1">
          Total de produtos: {produtos.length} | Estoque total: {totalQuantidade}
        </Typography>

        <Box
          sx={{
            width: '100%',
            overflowX: 'auto',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          {/* Passa os produtos filtrados e o callback para editar */}
          <TabelaProdutosEdicao produtos={produtosFiltrados} onEditar={editarCampo} />
        </Box>

        {/* Modal para adicionar produto */}
        <Modal open={modalAberto} onClose={fecharModal}>
          <Box sx={modalStyle}>
            <Typography variant="h6" mb={2}>
              Novo Produto
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Código"
                  fullWidth
                  size="medium"
                  variant="outlined"
                  value={novoProduto.codigo}
                  onChange={(e) => alterarNovoProduto('codigo', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Descrição"
                  fullWidth
                  size="medium"
                  variant="outlined"
                  value={novoProduto.descricao}
                  onChange={(e) => alterarNovoProduto('descricao', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Média de Venda"
                  fullWidth
                  size="medium"
                  variant="outlined"
                  // MUDANÇA AQUI: removi type="number" para permitir letras
                  value={novoProduto.mediaVenda}
                  onChange={(e) => alterarNovoProduto('mediaVenda', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Capacidade Porta Pallet"
                  fullWidth
                  size="medium"
                  variant="outlined"
                  // removido type="number"
                  value={novoProduto.capacidadePortaPallet}
                  onChange={(e) => alterarNovoProduto('capacidadePortaPallet', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Estoque Real"
                  fullWidth
                  size="medium"
                  variant="outlined"
                  // removido type="number"
                  value={novoProduto.estoqueReal}
                  onChange={(e) => alterarNovoProduto('estoqueReal', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nível"
                  fullWidth
                  size="medium"
                  variant="outlined"
                  value={novoProduto.nivel}
                  onChange={(e) => alterarNovoProduto('nivel', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Duração Atual"
                  fullWidth
                  size="medium"
                  variant="outlined"
                  value={novoProduto.duracaoAtual}
                  onChange={(e) => alterarNovoProduto('duracaoAtual', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Após Produzir"
                  fullWidth
                  size="medium"
                  variant="outlined"
                  // removido type="number"
                  value={novoProduto.aposProduzir}
                  onChange={(e) => alterarNovoProduto('aposProduzir', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Produzir"
                  fullWidth
                  size="medium"
                  variant="outlined"
                  // removido type="number"
                  value={novoProduto.produzir}
                  onChange={(e) => alterarNovoProduto('produzir', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Data de Produção"
                  fullWidth
                  size="medium"
                  variant="outlined"
                  type="date"
                  value={novoProduto.dataProducao}
                  onChange={(e) => alterarNovoProduto('dataProducao', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Ordem"
                  fullWidth
                  size="medium"
                  variant="outlined"
                  // removido type="number"
                  value={novoProduto.ordem}
                  onChange={(e) => alterarNovoProduto('ordem', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Linha"
                  fullWidth
                  size="medium"
                  variant="outlined"
                  value={novoProduto.linha}
                  onChange={(e) => alterarNovoProduto('linha', e.target.value)}
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Lote_op"
                  fullWidth
                  size="medium"
                  variant="outlined"
                  // removido type="number"
                  value={novoProduto.lote_op}
                  onChange={(e) => alterarNovoProduto('lote_op', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Status"
                  fullWidth
                  size="medium"
                  variant="outlined"
                  value={novoProduto.status}
                  onChange={(e) => alterarNovoProduto('status', e.target.value)}
                />
              </Grid>
            </Grid>

            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" onClick={fecharModal}>
                Cancelar
              </Button>
              <Button variant="contained" onClick={adicionarProduto}>
                Adicionar
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </LayoutPrincipal>
  );
}
