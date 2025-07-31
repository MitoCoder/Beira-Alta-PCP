// src/componentes/TabelaInventarioEdicao.js
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
  Button,
} from '@mui/material';

export default function TabelaInventarioEdicao({ inventario, onEditar, onSalvar }) {
  const calcularTotal = (item) => {
    const und = Number(item.und) || 0;
    const cx = Number(item.cx) || 0;
    const plt = Number(item.plt) || 0;
    const undPorCx = Number(item.unidadePorCaixa) || 0;
    const cxPorPlt = Number(item.caixasPorPallet) || 0;

    return und + (cx * undPorCx) + (plt * cxPorPlt * undPorCx);
  };

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <Table size="small" sx={{ minWidth: 1000 }}>
        <TableHead>
          <TableRow>
            <TableCell><strong>Código</strong></TableCell>
            <TableCell><strong>Descrição</strong></TableCell>
            <TableCell align="center">UND</TableCell>
            <TableCell align="center">CX</TableCell>
            <TableCell align="center">PLT</TableCell>
            <TableCell align="center">UND/CX</TableCell>
            <TableCell align="center">CX/PLT</TableCell>
            <TableCell align="center">TOTAL (UND)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inventario.map((item) => {
            const total = calcularTotal(item);

            return (
              <TableRow key={item.id}>
                <TableCell>{item.codigo}</TableCell>
                <TableCell>{item.descricao}</TableCell>

                {['und', 'cx', 'plt', 'unidadePorCaixa', 'caixasPorPallet'].map((campo) => (
                  <TableCell key={campo} align="center">
                    <TextField
                      size="small"
                      type="number"
                      value={item[campo]}
                      onChange={(e) =>
                        onEditar(item.id, campo, e.target.value.replace(/\D/g, ''))
                      }
                      inputProps={{ style: { fontSize: '0.75rem', textAlign: 'center' } }}
                      sx={{ width: 80 }}
                    />
                  </TableCell>
                ))}

                <TableCell align="center">
                  <Typography variant="body2" fontWeight="bold">
                    {total}
                  </Typography>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Box textAlign="right" mt={2}>
        <Button variant="contained" color="primary" onClick={onSalvar}>
          Salvar Inventário
        </Button>
      </Box>
    </Box>
  );
}
