// src/paginas/PaginaProdutos.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import LayoutPrincipal from '../componentes/LayoutPrincipal';

export default function PaginaProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [filtros, setFiltros] = useState({ codigo: '', descricao: '', lote_op: '', data_producao: '' });
  const [drawerAberto, setDrawerAberto] = useState(false);
  const [produtoEdicao, setProdutoEdicao] = useState(null);
  const [confirmDialogAberto, setConfirmDialogAberto] = useState(false);
  const [idExcluir, setIdExcluir] = useState(null);

  const campos = [
    'id', 'codigo', 'descricao', 'modelo', 'ml', 'tipo', 'media_venda', 'pedido_total',
    'estoque_atual', 'capacidade_porta_pallet', 'estoque_real', 'nivel', 'duracao_atual',
    'apos_produzir', 'produzir', 'data_producao', 'ordem', 'linha', 'lote_op', 'status',
    'falta_para_o_minimo', 'qtd_em_litros', 'und_por_litros', 'saldo_apos_producao',
    'dias_apos_produzir', 'hold'
  ];

  useEffect(() => {
    setProdutos([
      {
        id: 1,
        codigo: '1001',
        descricao: 'Produto A',
        modelo: 'XPTO',
        ml: 500,
        tipo: 'Líquido',
        media_venda: 10,
        pedido_total: 20,
        estoque_atual: 5,
        capacidade_porta_pallet: 100,
        estoque_real: 25,
        nivel: 'Médio',
        duracao_atual: 3,
        apos_produzir: 8,
        produzir: 5,
        data_producao: '2025-07-01',
        ordem: 'ORD123',
        linha: 'Linha 1',
        lote_op: 'L123',
        status: 'Ativo',
        falta_para_o_minimo: 10,
        qtd_em_litros: 250,
        und_por_litros: 2,
        saldo_apos_producao: 30,
        dias_apos_produzir: 5,
        hold: false
      }
    ]);
  }, []);

  const abrirDrawer = (produto = null) => {
    setProdutoEdicao(produto);
    if (produto) {
      setForm(produto);
    } else {
      const novo = {};
      campos.forEach((campo) => (novo[campo] = ''));
      setForm(novo);
    }
    setDrawerAberto(true);
  };

  const [form, setForm] = useState({});

  const salvarProduto = () => {
    if (produtoEdicao) {
      setProdutos((prev) => prev.map((p) => (p.id === produtoEdicao.id ? form : p)));
    } else {
      setProdutos((prev) => [...prev, { ...form, id: Date.now() }]);
    }
    setDrawerAberto(false);
  };

  const abrirConfirmDialog = (id) => {
    setIdExcluir(id);
    setConfirmDialogAberto(true);
  };

  const cancelarExcluir = () => {
    setIdExcluir(null);
    setConfirmDialogAberto(false);
  };

  const confirmarExcluir = () => {
    setProdutos((prev) => prev.filter((p) => p.id !== idExcluir));
    setIdExcluir(null);
    setConfirmDialogAberto(false);
  };

  const produtosFiltrados = produtos.filter((p) => {
    return (
      p.codigo.toLowerCase().includes(filtros.codigo.toLowerCase()) &&
      p.descricao.toLowerCase().includes(filtros.descricao.toLowerCase()) &&
      p.lote_op.toLowerCase().includes(filtros.lote_op.toLowerCase()) &&
      p.data_producao.toLowerCase().includes(filtros.data_producao.toLowerCase())
    );
  });

  const formatarTitulo = (campo) => {
    const mapTitulos = {
      id: 'ID',
      codigo: 'CÓDIGO',
      descricao: 'DESCRIÇÃO',
      modelo: 'MODELO',
      ml: 'ML',
      tipo: 'TIPO',
      media_venda: 'MÉDIA VENDA',
      pedido_total: 'PEDIDO TOTAL',
      estoque_atual: 'ESTOQUE ATUAL',
      capacidade_porta_pallet: 'CAPACIDADE PORTA PALLET',
      estoque_real: 'ESTOQUE REAL',
      nivel: 'NÍVEL',
      duracao_atual: 'DURAÇÃO ATUAL',
      apos_produzir: 'APÓS PRODUZIR',
      produzir: 'PRODUZIR',
      data_producao: 'DATA PRODUÇÃO',
      ordem: 'OP',
      linha: 'LINHA',
      lote_op: 'LOTE OP',
      status: 'STATUS',
      falta_para_o_minimo: 'FALTA PARA MÍNIMO',
      qtd_em_litros: 'QTD EM LITROS',
      und_por_litros: 'UND POR LITROS',
      saldo_apos_producao: 'SALDO APÓS PRODUÇÃO',
      dias_apos_produzir: 'DIAS APÓS PRODUZIR',
      hold: 'HOLD',
    };
    return mapTitulos[campo] || campo.toUpperCase();
  };

  return (
    <LayoutPrincipal>
      <Box sx={{ mt: 6, p: 4, maxWidth: 1200, mx: 'auto', backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" gutterBottom color="primary" fontWeight="bold" textAlign="center">
          BANCO DE DADOS
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
          <TextField
            label="Filtro por Código"
            value={filtros.codigo}
            onChange={(e) => setFiltros({ ...filtros, codigo: e.target.value })}
            fullWidth
            size="small"
          />
          <TextField
            label="Filtro por Descrição"
            value={filtros.descricao}
            onChange={(e) => setFiltros({ ...filtros, descricao: e.target.value })}
            fullWidth
            size="small"
          />
          <TextField
            label="Filtro por OP"
            value={filtros.lote_op}
            onChange={(e) => setFiltros({ ...filtros, lote_op: e.target.value })}
            fullWidth
            size="small"
          />
          <TextField
            label="Filtro por Data Produção"
            value={filtros.data_producao}
            onChange={(e) => setFiltros({ ...filtros, data_producao: e.target.value })}
            fullWidth
            size="small"
          />
        </Stack>

        <Button variant="contained" color="primary" onClick={() => abrirDrawer()} sx={{ mb: 2 }}>
          ➕ Novo Produto
        </Button>

        <TableContainer component={Paper}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {campos.map((campo) => (
                  <TableCell
                    key={campo}
                    align="center"
                    sx={{
                      whiteSpace: 'nowrap',
                      minWidth: campo === 'data_producao' || campo === 'capacidade_porta_pallet' ? 120 : 80,
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                    }}
                  >
                    {formatarTitulo(campo)}
                  </TableCell>
                ))}
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                  AÇÕES
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {produtosFiltrados.map((p) => (
                <TableRow key={p.id} hover>
                  {campos.map((campo) => (
                    <TableCell
                      key={campo}
                      align={campo === 'descricao' ? 'left' : 'center'}
                      sx={{
                        fontSize: '0.85rem',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        maxWidth: campo === 'capacidade_porta_pallet' ? 120 : 100,
                      }}
                      title={String(p[campo])}
                    >
                      {String(p[campo])}
                    </TableCell>
                  ))}
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button size="small" variant="outlined" onClick={() => abrirDrawer(p)}>
                        Editar
                      </Button>
                      <Button size="small" color="error" variant="outlined" onClick={() => abrirConfirmDialog(p.id)}>
                        Excluir
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {produtosFiltrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={campos.length + 1} align="center">
                    Nenhum produto encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Drawer anchor="right" open={drawerAberto} onClose={() => setDrawerAberto(false)}>
          <Box sx={{ width: 400, p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {produtoEdicao ? 'Editar Produto' : 'Novo Produto'}
            </Typography>
            <Stack spacing={2}>
              {campos.map((campo) => (
                <TextField
                  key={campo}
                  label={formatarTitulo(campo)}
                  value={form[campo] || ''}
                  onChange={(e) => setForm({ ...form, [campo]: e.target.value })}
                  fullWidth
                  size="small"
                  InputProps={{
                    readOnly: campo === 'id',
                  }}
                />
              ))}
              <Button variant="contained" color="primary" onClick={salvarProduto}>
                Salvar
              </Button>
            </Stack>
          </Box>
        </Drawer>

        {/* Dialog de confirmação */}
        <Dialog open={confirmDialogAberto} onClose={cancelarExcluir}>
          <DialogTitle>Confirmação</DialogTitle>
          <DialogContent>Tem certeza que deseja excluir este produto?</DialogContent>
          <DialogActions>
            <Button onClick={cancelarExcluir}>Cancelar</Button>
            <Button color="error" onClick={confirmarExcluir}>
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LayoutPrincipal>
  );
}
