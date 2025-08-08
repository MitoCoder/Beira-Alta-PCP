import React, { useState, useMemo, useCallback } from 'react';
import LayoutPrincipal from '../componentes/LayoutPrincipal';
import useProdutos from '../gancho/UseProdutos';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Modal,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

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

const localePTBR = {
  noRowsLabel: 'Nenhum registro para mostrar',
  footerRowSelected: (count) =>
    count !== 1 ? `${count.toLocaleString()} linhas selecionadas` : '1 linha selecionada',
  toolbarColumns: 'Colunas',
  toolbarFilters: 'Filtros',
  columnMenuSortAsc: 'Ordenar Crescente',
  columnMenuSortDesc: 'Ordenar Decrescente',
};

// Funções auxiliares para manipulação de datas
const formatarDataInput = (value) => {
  if (value === null || value === undefined || value === '') return '';
  
  // Se já estiver no formato DD/MM/AAAA, mantém
  if (typeof value === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) return value;
  
  // Converte de Date ou ISO string para DD/MM/AAAA
  if (value instanceof Date || (typeof value === 'string' && value.includes('-'))) {
    try {
      const date = value instanceof Date ? value : new Date(value);
      return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    } catch {
      return '';
    }
  }
  
  // Remove tudo que não é dígito
  const apenasDigitos = String(value).replace(/\D/g, '');
  
  // Aplica máscara durante a digitação
  if (apenasDigitos.length <= 2) return apenasDigitos;
  if (apenasDigitos.length <= 4) return `${apenasDigitos.slice(0, 2)}/${apenasDigitos.slice(2)}`;
  return `${apenasDigitos.slice(0, 2)}/${apenasDigitos.slice(2, 4)}/${apenasDigitos.slice(4, 8)}`;
};

const validarData = (value) => {
  if (!value) return true;
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  return regex.test(value);
};

export default function PaginaPlanejamento() {
  const { 
    produtos, 
    setProdutos, 
    editarCampo, 
    salvarAlteracoes,
    alteracoesLocais,
    carregando 
  } = useProdutos();
  const { enqueueSnackbar } = useSnackbar();

  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
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
  });

  const produtosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();
    if (!termo) return produtos;
    return produtos.filter((p) => {
      const descricao = (p.descricao || '').toLowerCase();
      const codigo = (p.codigo || '').toLowerCase();
      const lote_op = (p.lote_op || '').toLowerCase();
      return descricao.includes(termo) || codigo.includes(termo) || lote_op.includes(termo);
    });
  }, [busca, produtos]);

  const totalQuantidade = produtos.reduce(
    (acc, cur) => acc + Number(cur.estoqueReal || 0),
    0
  );

  const handleCellEditStop = useCallback(
    (params, event) => {
      const { id, field } = params;
      let value = event?.target?.value ?? event;
      
      if (field === 'dataProducao') {
        value = formatarDataInput(value);
        if (value && !validarData(value)) {
          enqueueSnackbar('Formato de data inválido. Use DD/MM/AAAA', { variant: 'warning' });
          return;
        }
      }
      
      editarCampo(id, field, value);
    },
    [editarCampo, enqueueSnackbar]
  );

  const salvarAlteracoesNaPagina = async () => {
    setSalvando(true);
    try {
      const resultado = await salvarAlteracoes();
      if (resultado.success) {
        enqueueSnackbar(resultado.message, { variant: 'success' });
      } else {
        enqueueSnackbar(resultado.message || 'Nenhuma alteração para salvar', { variant: 'info' });
      }
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      enqueueSnackbar('Erro ao salvar alterações', { variant: 'error' });
    } finally {
      setSalvando(false);
    }
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
    });
  };

  const alterarNovoProduto = (campo, valor) => {
    if (campo === 'dataProducao') {
      valor = formatarDataInput(valor);
    }
    setNovoProduto((old) => ({ ...old, [campo]: valor }));
  };

  const adicionarProduto = () => {
    if (!novoProduto.codigo.trim() || !novoProduto.descricao.trim()) {
      enqueueSnackbar('Código e Descrição são obrigatórios.', { variant: 'warning' });
      return;
    }
    
    if (novoProduto.dataProducao && !validarData(novoProduto.dataProducao)) {
      enqueueSnackbar('Formato de data inválido. Use DD/MM/AAAA', { variant: 'warning' });
      return;
    }
    
    const novo = {
      ...novoProduto,
      id: produtos.length > 0 ? Math.max(...produtos.map((p) => p.id)) + 1 : 1,
    };
    setProdutos([...produtos, novo]);
    enqueueSnackbar('Produto adicionado com sucesso!', { variant: 'success' });
    fecharModal();
  };

  const columns = [
    {
      field: 'codigo',
      headerName: 'Código',
      flex: 0.7,
      editable: true,
      headerClassName: 'headerStyle',
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'descricao',
      headerName: 'Descrição',
      flex: 1.5,
      editable: true,
      headerClassName: 'headerStyle',
    },
    {
      field: 'mediaVenda',
      headerName: 'Média\nVenda',
      flex: 0.8,
      editable: true,
      headerClassName: 'headerStyle',
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => (
        <Typography sx={{ whiteSpace: 'pre-line', fontSize: '0.8rem', fontWeight: 'bold' }}>
          Média{"\n"}Venda
        </Typography>
      ),
    },
    {
      field: 'capacidadePortaPallet',
      headerName: 'Cap.\nPallet',
      flex: 0.8,
      editable: true,
      headerClassName: 'headerStyle',
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => (
        <Typography sx={{ whiteSpace: 'pre-line', fontSize: '0.8rem', fontWeight: 'bold' }}>
          Cap.{"\n"}Pallet
        </Typography>
      ),
    },
    {
      field: 'estoqueReal',
      headerName: 'Estoque',
      flex: 0.7,
      editable: true,
      headerClassName: 'headerStyle',
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'nivel',
      headerName: 'Nível',
      flex: 0.6,
      editable: true,
      headerClassName: 'headerStyle',
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'duracaoAtual',
      headerName: 'Duração',
      flex: 0.8,
      editable: true,
      headerClassName: 'headerStyle',
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'aposProduzir',
      headerName: 'Após\nProduzir',
      flex: 0.9,
      editable: true,
      headerClassName: 'headerStyle',
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => (
        <Typography sx={{ whiteSpace: 'pre-line', fontSize: '0.8rem', fontWeight: 'bold' }}>
          Após{"\n"}Produzir
        </Typography>
      ),
    },
    {
      field: 'produzir',
      headerName: 'Produzir',
      flex: 0.8,
      editable: true,
      headerClassName: 'headerStyle',
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'dataProducao',
      headerName: 'Data\nProdução',
      flex: 1,
      editable: true,
      headerClassName: 'headerStyle',
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => (
        <Typography sx={{ whiteSpace: 'pre-line', fontSize: '0.8rem', fontWeight: 'bold' }}>
          Data{"\n"}Produção
        </Typography>
      ),
      valueFormatter: (params) => formatarDataInput(params.value),
      renderEditCell: (params) => (
        <TextField
          value={formatarDataInput(params.value)}
          onChange={(e) => {
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value: e.target.value,
            });
          }}
          fullWidth
          inputProps={{
            maxLength: 10,
          }}
        />
      ),
    },
    {
      field: 'ordem',
      headerName: 'Ordem',
      flex: 0.7,
      editable: true,
      headerClassName: 'headerStyle',
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'linha',
      headerName: 'Linha',
      flex: 1.3,
      editable: true,
      headerClassName: 'headerStyle',
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'lote_op',
      headerName: 'Lote/OP',
      flex: 1,
      editable: true,
      headerClassName: 'headerStyle',
      headerAlign: 'center',
      align: 'center'
    },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems="center"
          >
            <TextField
              label="Buscar Código ou Descrição"
              variant="outlined"
              size="medium"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              sx={{ flexGrow: 1, minWidth: 280 }}
            />
            <Button 
              variant="contained" 
              color="success" 
              size="medium" 
              onClick={salvarAlteracoesNaPagina}
              disabled={Object.keys(alteracoesLocais).length === 0 || salvando || carregando}
              sx={{ whiteSpace: 'nowrap' }}
            >
              {salvando ? 'Salvando...' : 'Salvar Planejamento'}
            </Button>
            <Button 
              variant="contained" 
              size="medium" 
              onClick={abrirModal}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Adicionar Produto
            </Button>
          </Stack>

          <Typography variant="subtitle1">
            Total de produtos: {produtos.length} | Estoque total: {totalQuantidade}
            {Object.keys(alteracoesLocais).length > 0 && (
              <span style={{ color: 'red', marginLeft: '10px' }}>
                {Object.keys(alteracoesLocais).length} alteração(ões) não salvas
              </span>
            )}
          </Typography>

          <Box sx={{ width: '100%', height: 600, position: 'relative' }}>
            {carregando && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  zIndex: 1,
                }}
              >
                <CircularProgress />
              </Box>
            )}
            <DataGrid
              rows={produtosFiltrados}
              columns={columns}
              disableColumnFilter
              disableDensitySelector
              disableColumnSelector
              hideFooterPagination
              hideFooter
              onCellEditStop={handleCellEditStop}
              localeText={localePTBR}
              getRowId={(row) => row.id}
              sx={{
                '& .headerStyle': {
                  fontSize: '0.8rem',
                  whiteSpace: 'normal',
                  lineHeight: 1.2,
                  fontWeight: 'bold',
                },
                fontSize: '0.9rem',
              }}
              editMode="cell"
            />
          </Box>

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
                    value={novoProduto.codigo}
                    onChange={(e) => alterarNovoProduto('codigo', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Descrição"
                    fullWidth
                    value={novoProduto.descricao}
                    onChange={(e) => alterarNovoProduto('descricao', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Média Venda"
                    fullWidth
                    value={novoProduto.mediaVenda}
                    onChange={(e) => alterarNovoProduto('mediaVenda', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Cap. Pallet"
                    fullWidth
                    value={novoProduto.capacidadePortaPallet}
                    onChange={(e) =>
                      alterarNovoProduto('capacidadePortaPallet', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Estoque"
                    fullWidth
                    value={novoProduto.estoqueReal}
                    onChange={(e) => alterarNovoProduto('estoqueReal', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nível"
                    fullWidth
                    value={novoProduto.nivel}
                    onChange={(e) => alterarNovoProduto('nivel', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Duração Atual"
                    fullWidth
                    value={novoProduto.duracaoAtual}
                    onChange={(e) => alterarNovoProduto('duracaoAtual', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Após Produzir"
                    fullWidth
                    value={novoProduto.aposProduzir}
                    onChange={(e) => alterarNovoProduto('aposProduzir', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Produzir"
                    fullWidth
                    value={novoProduto.produzir}
                    onChange={(e) => alterarNovoProduto('produzir', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Data Produção (DD/MM/AAAA)"
                    fullWidth
                    value={formatarDataInput(novoProduto.dataProducao)}
                    onChange={(e) => alterarNovoProduto('dataProducao', e.target.value)}
                    placeholder="DD/MM/AAAA"
                    inputProps={{
                      maxLength: 10,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Ordem"
                    fullWidth
                    value={novoProduto.ordem}
                    onChange={(e) => alterarNovoProduto('ordem', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Linha"
                    fullWidth
                    value={novoProduto.linha}
                    onChange={(e) => alterarNovoProduto('linha', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Lote/OP"
                    fullWidth
                    value={novoProduto.lote_op}
                    onChange={(e) => alterarNovoProduto('lote_op', e.target.value)}
                  />
                </Grid>
              </Grid>

              <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
                <Button onClick={fecharModal} variant="outlined">
                  Cancelar
                </Button>
                <Button onClick={adicionarProduto} variant="contained">
                  Adicionar
                </Button>
              </Stack>
            </Box>
          </Modal>
        </Box>
      </LayoutPrincipal>
    </LocalizationProvider>
  );
}