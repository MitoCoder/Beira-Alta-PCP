// src/paginas/PaginaPedidos.js
import React, { useState, useRef } from 'react';
import LayoutPrincipal from '../componentes/LayoutPrincipal';
import {
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Stack,
} from '@mui/material';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// IMPORTAÇÃO DO HOOK
import useProdutos from '../gancho/UseProdutos';

export default function PaginaPedidos() {
  const { atualizarTotaisPedidos } = useProdutos();
  const [itens, setItens] = useState([]);
  const [pedidosSeparados, setPedidosSeparados] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [msgStatus, setMsgStatus] = useState('');
  const [btnColor, setBtnColor] = useState('primary');
  const [arquivosCarregados, setArquivosCarregados] = useState({ itens: false, pedidos: false });

  const tabelaRef = useRef();
  const areaImpressaoRef = useRef();

  const converterQuantidade = (str) => {
    if (!str) return 0;
    const limpo = str.replace(/\./g, '').replace(/,/g, '.');
    const num = parseFloat(limpo);
    return isNaN(num) ? 0 : num;
  };

  const processarCSV = (file, tipo) => {
    Papa.parse(file, {
      complete: (res) => {
        const dados = res.data;
        if (tipo === 'itens') {
          const dadosItens = dados
            .filter((linha, idx) => idx > 0 && linha.length > 10 && linha[0] && linha[4] && linha[10])
            .map((linha) => ({
              pedido: String(linha[0]).trim(),
              codigoProduto: String(linha[4]).trim(),
              descricaoProduto: String(linha[6]).trim(),
              quantidade: converterQuantidade(String(linha[10])),
            }));
          setItens(dadosItens);
          setArquivosCarregados((prev) => ({ ...prev, itens: true }));
          setMsgStatus('Arquivo itens.csv carregado com sucesso!');
          setBtnColor('success');
        }
        if (tipo === 'pedidos') {
          const codigosSeparados = dados
            .filter((linha, idx) => idx > 0 && linha[1] && linha[45])
            .map((linha) => String(linha[1]).trim())
            .filter((pedido) => !pedido.endsWith('/A'));
          setPedidosSeparados(codigosSeparados);
          setArquivosCarregados((prev) => ({ ...prev, pedidos: true }));
          setMsgStatus('Arquivo pedidos.csv carregado com sucesso!');
          setBtnColor('success');
        }
      },
      error: (err) => {
        setMsgStatus(`Erro ao ler o arquivo: ${err.message}`);
        setBtnColor('error');
      },
      skipEmptyLines: true,
    });
  };

  const processarResultado = () => {
    if (!arquivosCarregados.itens || !arquivosCarregados.pedidos) {
      setMsgStatus('Por favor, carregue ambos os arquivos antes de processar.');
      setBtnColor('warning');
      return;
    }

    const itensFiltrados = itens.filter(
      (item) => !pedidosSeparados.includes(item.pedido) && !item.pedido.endsWith('/A')
    );

    const agregados = {};
    itensFiltrados.forEach((item) => {
      const chave = `${item.codigoProduto}||${item.descricaoProduto}`;
      if (!agregados[chave]) agregados[chave] = 0;
      agregados[chave] += item.quantidade;
    });

    setResultado(agregados);
    setMsgStatus('Processamento concluído!');
    setBtnColor('success');
  };

  const enviarTotaisParaProdutos = () => {
    if (!resultado) {
      setMsgStatus('Você precisa processar os arquivos primeiro.');
      setBtnColor('warning');
      return;
    }

    const totaisPorCodigo = Object.entries(resultado).reduce((acc, [chave, quantidade]) => {
      const [codigo] = chave.split('||');
      acc[codigo] = Math.round(quantidade);
      return acc;
    }, {});

    atualizarTotaisPedidos(totaisPorCodigo);
    setMsgStatus('Totais enviados ao sistema com sucesso!');
    setBtnColor('success');
  };

  const imprimirTabela = () => {
    const printContent = areaImpressaoRef.current.innerHTML;
    const win = window.open('', '', 'width=900,height=650');
    win.document.write(`
      <html>
        <head>
          <title>Impressão</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              font-size: 12pt;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid black;
              padding: 6px 10px;
              text-align: left;
            }
            thead {
              background-color: #f0f0f0;
            }
          </style>
        </head>
        <body>
          <h2>Resumo de Produtos Pendentes</h2>
          ${printContent}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  const exportarExcel = () => {
    if (!resultado) {
      setMsgStatus('Não há dados para exportar. Processa os arquivos primeiro.');
      setBtnColor('warning');
      return;
    }

    const dadosParaExcel = Object.entries(resultado).map(([chave, quantidade]) => {
      const [codigo, descricao] = chave.split('||');
      return {
        'Código Produto': Number(codigo), // Convertendo para número
        'Descrição': descricao,
        'Quantidade Total': Math.round(quantidade), // Já é número
      };
    });

    const ws = XLSX.utils.json_to_sheet(dadosParaExcel);
    
    // Definindo os tipos de dados para cada coluna
    const range = XLSX.utils.decode_range(ws['!ref']);
    
    // Formatando cabeçalho
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const header = XLSX.utils.encode_col(C) + "1";
      if (!ws[header]) continue;
      ws[header].s = { // Estilo do cabeçalho
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4472C4" } }, // Azul escuro
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } }
        }
      };
    }

    // Formatando colunas numéricas
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      // Coluna A (Código Produto)
      const cellCodigo = XLSX.utils.encode_col(0) + (R + 1);
      if (ws[cellCodigo]) {
        ws[cellCodigo].t = 'n'; // Tipo numérico
        ws[cellCodigo].z = '0'; // Formato sem decimais
      }
      
      // Coluna C (Quantidade Total)
      const cellQuantidade = XLSX.utils.encode_col(2) + (R + 1);
      if (ws[cellQuantidade]) {
        ws[cellQuantidade].t = 'n'; // Tipo numérico
        ws[cellQuantidade].z = '#,##0'; // Formato com separador de milhares
      }
    }

    // Definindo largura das colunas
    ws['!cols'] = [
      { wch: 15 }, // Código Produto
      { wch: 50 }, // Descrição
      { wch: 20 }  // Quantidade Total
    ];

    // Adicionando tabela estruturada
    ws['!autofilter'] = { ref: XLSX.utils.encode_range(range) };
    
    // Criando a tabela formal do Excel
    const table = {
      name: 'TabelaResumo',
      displayName: 'ResumoProdutos',
      ref: XLSX.utils.encode_range(range),
      headerRowCount: 1,
      totalsRowCount: 0,
      columns: [
        { name: 'Código Produto' },
        { name: 'Descrição' },
        { name: 'Quantidade Total' }
      ]
    };

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Resumo Produtos');
    
    // Adicionando a tabela ao workbook
    if (!wb.Workbook) wb.Workbook = {};
    if (!wb.Workbook.Tables) wb.Workbook.Tables = [];
    wb.Workbook.Tables.push(table);

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'resumo_produtos.xlsx');
  };

  return (
    <LayoutPrincipal>
      <Box sx={{ mt: 6, p: 4, maxWidth: 1000, mx: 'auto', backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h3" align="center" fontWeight="bold" color="primary" gutterBottom>
          PEDIDOS - Unificador
        </Typography>

        <Typography variant="subtitle1" mb={2} textAlign="center">
          Importe os arquivos CSV de pedidos e itens para processar e visualizar as quantidades pendentes e salve.
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" mb={3}>
          <Button variant="contained" component="label" color={arquivosCarregados.itens ? 'success' : 'primary'}>
            Carregar itens.csv
            <input type="file" accept=".csv" hidden onChange={(e) => e.target.files.length && processarCSV(e.target.files[0], 'itens')} />
          </Button>
          <Button variant="contained" component="label" color={arquivosCarregados.pedidos ? 'success' : 'primary'}>
            Carregar pedidos.csv
            <input type="file" accept=".csv" hidden onChange={(e) => e.target.files.length && processarCSV(e.target.files[0], 'pedidos')} />
          </Button>
          <Button variant="outlined" onClick={processarResultado} disabled={!arquivosCarregados.itens || !arquivosCarregados.pedidos}>
            Processar e Agrupar
          </Button>
        </Stack>

        {msgStatus && <Alert severity={btnColor}>{msgStatus}</Alert>}

        {resultado && (
          <>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" my={2}>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" color="secondary" onClick={imprimirTabela}>
                  🖨️ Imprimir (A4)
                </Button>
                <Button variant="contained" color="success" onClick={exportarExcel}>
                  📥 Exportar Excel
                </Button>
              </Stack>

              <Button variant="contained" color="primary" onClick={enviarTotaisParaProdutos}>
                🚀 Enviar Totais para Produtos
              </Button>
            </Stack>

            <TableContainer component={Paper} sx={{ maxHeight: 440 }} ref={tabelaRef}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Código Produto</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Descrição</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Quantidade Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(resultado).map(([chave, quantidade]) => {
                    const [codigo, descricao] = chave.split('||');
                    return (
                      <TableRow key={chave} hover>
                        <TableCell>{codigo}</TableCell>
                        <TableCell>{descricao}</TableCell>
                        <TableCell align="right">{Math.round(quantidade).toLocaleString('pt-BR')}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <div style={{ display: 'none' }}>
              <div ref={areaImpressaoRef}>
                <table>
                  <thead>
                    <tr>
                      <th>Código Produto</th>
                      <th>Descrição</th>
                      <th>Quantidade Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(resultado).map(([chave, quantidade]) => {
                      const [codigo, descricao] = chave.split('||');
                      return (
                        <tr key={chave}>
                          <td>{codigo}</td>
                          <td>{descricao}</td>
                          <td>{Math.round(quantidade).toLocaleString('pt-BR')}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </Box>
    </LayoutPrincipal>
  );
}