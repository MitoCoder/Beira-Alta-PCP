// src/componentes/CardProduto.js
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export default function CardProduto({ produto }) {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {produto.descricao}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="body2">Lote: {produto.lote}</Typography>
          <Typography variant="body2">Data: {produto.dataProducao || '-'}</Typography>
          <Typography variant="body2">Ordem: {produto.ordem}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
