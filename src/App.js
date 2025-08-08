import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PaginaPlanejamento from './paginas/PaginaPlanejamento';
import PaginaConfiguracoes from './paginas/PaginaConfiguracoes';
import PaginaDashboard from './paginas/PaginaDashboard';
import PaginaProdutos from './paginas/PaginaProdutos';
import PaginasRelatorios from './paginas/PaginasRelatorios';
import PaginaPedidos from './paginas/PaginaPedidos';
import PaginaEstoque from './paginas/PaginaEstoque';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PaginaPlanejamento />} />
        <Route path="/produtos" element={<PaginaProdutos />} />
        <Route path="/pedidos" element={<PaginaPedidos />} />
        <Route path="/dashboard" element={<PaginaDashboard />} />
        <Route path="/inventario" element={<PaginaEstoque />} />
        <Route path="/relatorios" element={<PaginasRelatorios />} />
        <Route path="/configuracoes" element={<PaginaConfiguracoes />} />
      </Routes>
    </BrowserRouter>
  );
}