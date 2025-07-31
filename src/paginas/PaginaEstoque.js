// src/paginas/PaginaEstoque.js
import React, { useRef, useState } from 'react';
import LayoutPrincipal from '../componentes/LayoutPrincipal';
import useProdutos from '../gancho/UseProdutos';
import TabelaInventarioEdicao from '../componentes/TabelaInventarioEdicao';
import {
  Typography,
  Paper,
  Stack,
  Button,
  Box,
} from '@mui/material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function PaginaEstoque() {
  const { produtos, setProdutos } = useProdutos();
  const areaImpressaoRef = useRef();
  const [dataHoraSalvamento, setDataHoraSalvamento] = useState(null);

  const onEditar = (id, campo, valor) => {
    setProdutos((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [campo]: valor } : item))
    );
  };

  const onSalvarInventario = () => {
    console.log('Inventário salvo:', produtos);
    const agora = new Date();
    const formatado = agora.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setDataHoraSalvamento(formatado);
    alert('Inventário salvo com sucesso!');
  };

  const exportarExcel = () => {
    if (produtos.length === 0) return;

    // Monta os dados somente com os campos desejados e o cálculo do total
    const dadosParaExcel = produtos.map((item) => {
      const und = Number(item.und ?? 0);
      const cx = Number(item.cx ?? 0);
      const plt = Number(item.plt ?? 0);
      const undPorCx = Number(item.unidadePorCaixa ?? 0);
      const cxPorPlt = Number(item.caixasPorPallet ?? 0);
      const totalUnd = und + cx * undPorCx + plt * cxPorPlt * undPorCx;

      return {
        Código: item.codigo ?? '',
        Descrição: item.descricao ?? '',
        UND: und,
        CX: cx,
        PLT: plt,
        'UND/CX': undPorCx,
        'CX/PLT': cxPorPlt,
        'TOTAL (UND)': totalUnd,
      };
    });

    const ws = XLSX.utils.json_to_sheet(dadosParaExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventario');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'inventario_estoque.xlsx');
  };

  const imprimirTabela = () => {
    if (produtos.length === 0) {
      alert('Não há dados para imprimir.');
      return;
    }

    // Monta a tabela HTML apenas com as colunas que você pediu
    const tabelaHtml = `
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Descrição</th>
            <th>UND</th>
            <th>CX</th>
            <th>PLT</th>
            <th>UND/CX</th>
            <th>CX/PLT</th>
            <th>TOTAL (UND)</th>
          </tr>
        </thead>
        <tbody>
          ${produtos
            .map((item) => {
              const und = Number(item.und ?? 0);
              const cx = Number(item.cx ?? 0);
              const plt = Number(item.plt ?? 0);
              const undPorCx = Number(item.unidadePorCaixa ?? 0);
              const cxPorPlt = Number(item.caixasPorPallet ?? 0);
              const totalUnd = und + cx * undPorCx + plt * cxPorPlt * undPorCx;

              return `
                <tr>
                  <td>${item.codigo ?? ''}</td>
                  <td>${item.descricao ?? ''}</td>
                  <td>${und}</td>
                  <td>${cx}</td>
                  <td>${plt}</td>
                  <td>${undPorCx}</td>
                  <td>${cxPorPlt}</td>
                  <td>${totalUnd}</td>
                </tr>
              `;
            })
            .join('')}
        </tbody>
      </table>
    `;

    const win = window.open('', '', 'width=1000,height=700');
    win.document.write(`
      <html>
        <head>
          <title>Impressão Inventário</title>
          <style>
            @page { size: landscape; }
            body { font-family: Arial, sans-serif; padding: 20px; font-size: 12pt; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid black; padding: 6px 8px; text-align: left; }
            thead { background-color: #f0f0f0; }
          </style>
        </head>
        <body>
          <h2>Inventário de Estoque</h2>
          ${tabelaHtml}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  return (
    <LayoutPrincipal>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Inventário de Estoque
      </Typography>
      <Typography variant="body1" gutterBottom>
        Faça o lançamento dos produtos contando por unidade, caixa e pallet.
      </Typography>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        my={2}
      >
        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="secondary" onClick={imprimirTabela}>
            🖨️ Imprimir
          </Button>
          <Button variant="contained" color="success" onClick={exportarExcel}>
            📥 Exportar Excel
          </Button>
        </Stack>

        {dataHoraSalvamento && (
          <Box sx={{ fontSize: '0.875rem', color: 'gray' }}>
            Último salvamento: <strong>{dataHoraSalvamento}</strong>
          </Box>
        )}
      </Stack>

      <Paper sx={{ p: 2 }} elevation={2}>
        <div ref={areaImpressaoRef}>
          <TabelaInventarioEdicao
            inventario={produtos}
            onEditar={onEditar}
            onSalvar={onSalvarInventario}
          />
        </div>
      </Paper>
    </LayoutPrincipal>
  );
}
