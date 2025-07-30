// src/componentes/TabelaProdutos.js
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

export default function TabelaProdutos({ produtos }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nome do Produto</TableCell>
            <TableCell>Quantidade</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {produtos.map((produto) => (
            <TableRow key={produto.id}>
              <TableCell>{produto.id}</TableCell>
              <TableCell>{produto.nome}</TableCell>
              <TableCell>{produto.quantidade}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
