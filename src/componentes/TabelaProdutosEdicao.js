// src/componentes/TabelaProdutosEdicao.js
import React from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Typography,
  Box,
} from '@mui/material';

export default function TabelaProdutosEdicao({ produtos, onEditar }) {
  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <Table
        size="small"
        sx={{
          tableLayout: 'fixed',
          minWidth: 1200,
          fontSize: '0.75rem',
        }}
      >
        <TableHead>
          <TableRow>
            {[
              { title: 'Código', minW: 70, maxW: 90, align: 'center' },
              { title: 'Descrição', minW: 300, maxW: 500, align: 'left' },
              { title: 'Média de Venda', minW: 90, maxW: 110, align: 'center' },
              { title: 'Pedido Total', minW: 90, maxW: 110, align: 'center' },
              { title: 'Capacidade Porta Pallet', minW: 90, maxW: 110, align: 'center' },
              { title: 'Estoque Real', minW: 90, maxW: 110, align: 'center' },
              { title: 'Duração Atual', minW: 90, maxW: 110, align: 'center' },
              { title: 'Após Produzir', minW: 90, maxW: 110, align: 'center' },
              { title: 'Produzir', minW: 90, maxW: 110, align: 'center' },
              { title: 'Data de Produção', minW: 100, maxW: 120, align: 'center' },
              { title: 'Ordem', minW: 30, maxW: 40, align: 'center' },
              { title: 'Lote', minW: 60, maxW: 80, align: 'center' },
              { title: 'Linha', minW: 70, maxW: 90, align: 'center' },
            ].map(({ title, minW, maxW, align }) => (
              <TableCell
                key={title}
                sx={{
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                  fontSize: '0.65rem',
                  lineHeight: 1.1,
                  px: 0.5,
                  py: 0.5,
                  minWidth: minW,
                  maxWidth: maxW,
                  textAlign: align,
                  fontWeight: 'bold',
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                  {title}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {produtos.map((produto) => (
            <TableRow key={produto.id} hover>
              <TableCell sx={{ fontSize: '0.7rem', px: 0.5, py: 0.5, textAlign: 'center' }}>
                {produto.codigo}
              </TableCell>

              <TableCell
                sx={{
                  fontSize: '0.7rem',
                  px: 0.5,
                  py: 0.5,
                  textAlign: 'left',
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                  maxWidth: 500,
                  overflowWrap: 'break-word',
                }}
                title={produto.descricao}
              >
                {produto.descricao}
              </TableCell>

              <TableCell sx={{ fontSize: '0.7rem', px: 0.5, py: 0.5, textAlign: 'center' }}>
                {produto.mediaVenda}
              </TableCell>

              <TableCell sx={{ fontSize: '0.7rem', px: 0.5, py: 0.5, textAlign: 'center' }}>
                {produto.pedidoTotal ?? '-'}
              </TableCell>

              <TableCell sx={{ fontSize: '0.7rem', px: 0.5, py: 0.5, textAlign: 'center' }}>
                {produto.capacidadePortaPallet}
              </TableCell>

              <TableCell sx={{ fontSize: '0.7rem', px: 0.5, py: 0.5, textAlign: 'center' }}>
                {produto.estoqueReal}
              </TableCell>

              <TableCell sx={{ fontSize: '0.7rem', px: 0.5, py: 0.5, textAlign: 'center' }}>
                {produto.duracaoAtual}
              </TableCell>

              <TableCell sx={{ fontSize: '0.7rem', px: 0.5, py: 0.5, textAlign: 'center' }}>
                {produto.aposProduzir}
              </TableCell>

              <TableCell sx={{ px: 0.5, py: 0.25, textAlign: 'center', minWidth: 90, maxWidth: 110 }}>
                <TextField
                  size="small"
                  type="text"
                  variant="outlined"
                  value={produto.produzir || ''}
                  onChange={(e) =>
                    onEditar(
                      produto.id,
                      'produzir',
                      e.target.value.slice(0, 7)
                    )
                  }
                  inputProps={{
                    maxLength: 7,
                    style: {
                      fontSize: '0.7rem',
                      padding: '5px 8px',
                      height: 24,
                      textAlign: 'center',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    },
                  }}
                  sx={{ width: '100%' }}
                />
              </TableCell>

              <TableCell sx={{ px: 0.5, py: 0.25, textAlign: 'center', minWidth: 100, maxWidth: 120 }}>
                <TextField
                  size="small"
                  type="date"
                  variant="outlined"
                  value={produto.dataProducao || ''}
                  onChange={(e) => onEditar(produto.id, 'dataProducao', e.target.value)}
                  inputProps={{
                    style: {
                      fontSize: '0.7rem',
                      padding: '5px 8px',
                      height: 24,
                      textAlign: 'center',
                    },
                  }}
                  sx={{ width: '100%' }}
                />
              </TableCell>

              <TableCell sx={{ px: 0.5, py: 0.25, textAlign: 'center', minWidth: 30, maxWidth: 40 }}>
                <TextField
                  size="small"
                  type="text"
                  variant="outlined"
                  value={produto.ordem || ''}
                  onChange={(e) => onEditar(produto.id, 'ordem', e.target.value.slice(0, 10))}
                  inputProps={{
                    maxLength: 10,
                    style: {
                      fontSize: '0.7rem',
                      padding: '5px 6px',
                      height: 24,
                      textAlign: 'center',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    },
                  }}
                  sx={{ width: '100%' }}
                />
              </TableCell>

              <TableCell sx={{ px: 0.5, py: 0.25, textAlign: 'center', minWidth: 60, maxWidth: 80 }}>
                <TextField
                  size="small"
                  type="text"
                  variant="outlined"
                  value={produto.lote_op || ''}
                  onChange={(e) =>
                    onEditar(produto.id, 'lote_op', e.target.value.slice(0, 6))
                  }
                  inputProps={{
                    maxLength: 6,
                    style: {
                      fontSize: '0.7rem',
                      padding: '5px 8px',
                      height: 24,
                      textAlign: 'center',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    },
                  }}
                  sx={{ width: '100%' }}
                />
              </TableCell>

              <TableCell sx={{ fontSize: '0.7rem', px: 0.5, py: 0.5, textAlign: 'center' }}>
                {produto.linha}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
