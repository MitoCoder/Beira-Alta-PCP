// src/paginas/PaginaProdutos.js
import React, { useState } from 'react';
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
import useProdutos from '../gancho/UseProdutos';

export default function PaginaProdutos() {
  const { produtos, setProdutos } = useProdutos();
  const [filtros, setFiltros] = useState({ codigo: '', descricao: '', lote_op: '', data_producao: '' });
  const [drawerAberto, setDrawerAberto] = useState(false);
  const [produtoEdicao, setProdutoEdicao] = useState(null);
  const [confirmDialogAberto, setConfirmDialogAberto] = useState(false);
  const [idExcluir, setIdExcluir] = useState(null);

  const campos = [
    'id', 'codigo', 'descricao', 'modelo', 'ml', 'tipo', 'mediaVenda', 'pedidoTotal',
    'estoqueAtual', 'capacidadePortaPallet', 'estoqueReal', 'nivel', 'duracaoAtual',
    'aposProduzir', 'produzir', 'dataProducao', 'ordem', 'linha', 'lote', 'status',
    'faltaParaOMinimo', 'qtdEmLitros', 'undPorLitros', 'saldoAposProducao',
    'diasAposProduzir', 'hold'
  ];

  const camposNumericos = [
    'ml', 'mediaVenda', 'pedidoTotal', 'estoqueAtual', 'capacidadePortaPallet',
    'estoqueReal', 'aposProduzir', 'produzir', 'qtdEmLitros', 'undPorLitros',
    'saldoAposProducao', 'diasAposProduzir'
  ];

  const [form, setForm] = useState({});

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

  const salvarProduto = () => {
    const produtoSalvo = { ...form };
    camposNumericos.forEach((campo) => {
      if (produtoSalvo[campo] !== '') {
        const num = Number(produtoSalvo[campo]);
        produtoSalvo[campo] = isNaN(num) ? produtoSalvo[campo] : num;
      }
    });

    if (produtoEdicao) {
      setProdutos((prev) => prev.map((p) => (p.id === produtoEdicao.id ? produtoSalvo : p)));
    } else {
      setProdutos((prev) => [...prev, { ...produtoSalvo, id: Date.now() }]);
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

  const produtosFiltrados = produtos.filter((p) =>
    p.codigo.toLowerCase().includes(filtros.codigo.toLowerCase()) &&
    p.descricao.toLowerCase().includes(filtros.descricao.toLowerCase()) &&
    (p.lote || '').toString().toLowerCase().includes(filtros.lote_op.toLowerCase()) &&
    (p.dataProducao || '').toLowerCase().includes(filtros.data_producao.toLowerCase())
  );

  const formatarTitulo = (campo) => {
    const mapTitulos = {
      id: 'ID',
      codigo: 'CÓDIGO',
      descricao: 'DESCRIÇÃO',
      modelo: 'MODELO',
      ml: 'ML',
      tipo: 'TIPO',
      mediaVenda: 'MÉDIA VENDA',
      pedidoTotal: 'PEDIDO TOTAL',
      estoqueAtual: 'ESTOQUE ATUAL',
      capacidadePortaPallet: 'CAPACIDADE PORTA PALLET',
      estoqueReal: 'ESTOQUE REAL',
      nivel: 'NÍVEL',
      duracaoAtual: 'DURAÇÃO ATUAL',
      aposProduzir: 'APÓS PRODUZIR',
      produzir: 'PRODUZIR',
      dataProducao: 'DATA PRODUÇÃO',
      ordem: 'OP',
      linha: 'LINHA',
      lote: 'LOTE OP',
      status: 'STATUS',
      faltaParaOMinimo: 'FALTA PARA MÍNIMO',
      qtdEmLitros: 'QTD EM LITROS',
      undPorLitros: 'UND POR LITROS',
      saldoAposProducao: 'SALDO APÓS PRODUÇÃO',
      diasAposProduzir: 'DIAS APÓS PRODUZIR',
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
                    sx={{ whiteSpace: 'nowrap', minWidth: 80, fontWeight: 'bold', fontSize: '0.85rem' }}
                  >
                    {formatarTitulo(campo)}
                  </TableCell>
                ))}
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>
                  AÇÕES
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {produtosFiltrados.map((p) => (
                <TableRow key={p.id} hover>
                  {campos.map((campo) => (
                    <TableCell key={campo} align={campo === 'descricao' ? 'left' : 'center'}>
                      {String(p[campo] ?? '')}
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
                  InputProps={{ readOnly: campo === 'id' }}
                />
              ))}
              <Button variant="contained" color="primary" onClick={salvarProduto}>
                Salvar
              </Button>
            </Stack>
          </Box>
        </Drawer>

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
