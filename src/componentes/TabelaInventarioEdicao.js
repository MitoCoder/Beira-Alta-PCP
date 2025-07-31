// src/componentes/TabelaInventarioEdicao.js
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';

export default function TabelaInventarioEdicao({ inventario, onEditar }) {
  return (
    <Table size="small" stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell sx={{ width: 100 }}>Código</TableCell>
          <TableCell sx={{ width: '40%' }}>Descrição</TableCell>
          <TableCell sx={{ width: 100 }}>UND</TableCell>
          <TableCell sx={{ width: 100 }}>CX</TableCell>
          <TableCell sx={{ width: 100 }}>PLT</TableCell>
          <TableCell sx={{ width: 110 }}>UND/CX</TableCell>
          <TableCell sx={{ width: 110 }}>CX/PLT</TableCell>
          <TableCell sx={{ width: 100 }}>TOTAL (UND)</TableCell>
          <TableCell sx={{ width: 130, textAlign: 'center' }}>
            DATA INVENTÁRIO
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {inventario.map((item) => {
          const und = Number(item.und) || 0;
          const cx = Number(item.cx) || 0;
          const plt = Number(item.plt) || 0;
          const undPorCx = Number(item.unidadePorCaixa) || 0;
          const cxPorPlt = Number(item.caixasPorPallet) || 0;

          const totalUnd = und + cx * undPorCx + plt * cxPorPlt * undPorCx;

          return (
            <TableRow key={item.id}>
              <TableCell>{item.codigo}</TableCell>
              <TableCell>{item.descricao}</TableCell>
              <TableCell>
                <TextField
                  size="small"
                  type="number"
                  value={item.und ?? ''}
                  onChange={(e) => onEditar(item.id, 'und', e.target.value)}
                  inputProps={{ min: 0, maxLength: 8 }}
                  sx={{ minWidth: 100 }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  type="number"
                  value={item.cx ?? ''}
                  onChange={(e) => onEditar(item.id, 'cx', e.target.value)}
                  inputProps={{ min: 0, maxLength: 8 }}
                  sx={{ minWidth: 100 }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  type="number"
                  value={item.plt ?? ''}
                  onChange={(e) => onEditar(item.id, 'plt', e.target.value)}
                  inputProps={{ min: 0, maxLength: 8 }}
                  sx={{ minWidth: 100 }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  type="number"
                  value={item.unidadePorCaixa ?? ''}
                  onChange={(e) => onEditar(item.id, 'unidadePorCaixa', e.target.value)}
                  inputProps={{ min: 0, maxLength: 8 }}
                  sx={{ minWidth: 110 }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  type="number"
                  value={item.caixasPorPallet ?? ''}
                  onChange={(e) => onEditar(item.id, 'caixasPorPallet', e.target.value)}
                  inputProps={{ min: 0, maxLength: 8 }}
                  sx={{ minWidth: 110 }}
                />
              </TableCell>
              <TableCell>{totalUnd}</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                {item.dataInventario ?? '-'}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
