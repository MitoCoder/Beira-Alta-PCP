// src/paginas/PaginaEstoque.js
import React, { useRef, useState, useMemo } from 'react';
import LayoutPrincipal from '../componentes/LayoutPrincipal';
import useProdutos from '../gancho/UseProdutos';
import TabelaInventarioEdicao from '../componentes/TabelaInventarioEdicao';
import {
  Typography,
  Paper,
  Stack,
  Button,
  Box,
  TextField,
} from '@mui/material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function PaginaEstoque() {
  const { produtos, setProdutos } = useProdutos();

  const [filtroCodigo, setFiltroCodigo] = useState('');
  const [filtroDescricao, setFiltroDescricao] = useState('');
  const [dataHoraSalvamento, setDataHoraSalvamento] = useState(null);

  const areaImpressaoRef = useRef();

  // Filtra localmente sem mexer no useProdutos
  const produtosFiltrados = useMemo(() => {
    return produtos.filter((item) => {
      const codigoMatch = item.codigo.toLowerCase().includes(filtroCodigo.toLowerCase());
      const descricaoMatch = item.descricao.toLowerCase().includes(filtroDescricao.toLowerCase());
      return codigoMatch && descricaoMatch;
    });
  }, [produtos, filtroCodigo, filtroDescricao]);

  const onEditar = (id, campo, valor) => {
    setProdutos((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [campo]: valor } : item
      )
    );
  };

  const onSalvarInventario = () => {
    const agora = new Date();
    const dataFormatada = agora.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // Atualiza produtos com total_inventario e dataInventario
    setProdutos((prev) =>
      prev.map((item) => {
        const und = Number(item.und) || 0;
        const cx = Number(item.cx) || 0;
        const plt = Number(item.plt) || 0;
        const undPorCx = Number(item.unidadePorCaixa) || 0;
        const cxPorPlt = Number(item.caixasPorPallet) || 0;

        const total = und + cx * undPorCx + plt * cxPorPlt * undPorCx;

        return {
          ...item,
          total_inventario: total,
          dataInventario: dataFormatada,
        };
      })
    );

    setDataHoraSalvamento(dataFormatada);
    alert('Inventário salvo com sucesso!');
  };

  const exportarExcel = () => {
    if (produtosFiltrados.length === 0) return;

    const dadosParaExcel = produtosFiltrados.map((item) => {
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
        'DATA INVENTÁRIO': item.dataInventario ?? '',
      };
    });

    const ws = XLSX.utils.json_to_sheet(dadosParaExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventario');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'inventario_estoque.xlsx');
  };

  const imprimirTabela = () => {
    if (produtosFiltrados.length === 0) {
      alert('Não há dados para imprimir.');
      return;
    }

    const tabelaHtml = `
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th style="width: 40%;">Descrição</th>
            <th>UND</th>
            <th>CX</th>
            <th>PLT</th>
            <th>UND/CX</th>
            <th>CX/PLT</th>
            <th>TOTAL (UND)</th>
            <th>DATA INVENTÁRIO</th>
          </tr>
        </thead>
        <tbody>
          ${produtosFiltrados
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
                  <td style="width: 40%;">${item.descricao ?? ''}</td>
                  <td>${und}</td>
                  <td>${cx}</td>
                  <td>${plt}</td>
                  <td>${undPorCx}</td>
                  <td>${cxPorPlt}</td>
                  <td>${totalUnd}</td>
                  <td>${item.dataInventario ?? '-'}</td>
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

      {/* Filtros locais */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems="center"
        my={2}
      >
        <TextField
          label="Filtrar por Código"
          variant="outlined"
          size="small"
          value={filtroCodigo}
          onChange={(e) => setFiltroCodigo(e.target.value)}
          sx={{ width: { xs: '100%', sm: '200px' } }}
        />
        <TextField
          label="Filtrar por Descrição"
          variant="outlined"
          size="small"
          value={filtroDescricao}
          onChange={(e) => setFiltroDescricao(e.target.value)}
          sx={{ width: { xs: '100%', sm: '300px' } }}
        />
      </Stack>

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
          <Button variant="contained" color="primary" onClick={onSalvarInventario}>
            💾 Salvar Inventário
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
            inventario={produtosFiltrados}
            onEditar={onEditar}
          />
        </div>
      </Paper>
    </LayoutPrincipal>
  );
}
