// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ControleProducao from './paginas/ControleProducao';
import PaginaConfiguracoes from './paginas/PaginaConfiguracoes';
import PaginaDashboard from './paginas/PaginaDashboard';
import PaginaProdutos from './paginas/PaginaProdutos';
import PaginasRelatorios from './paginas/PaginasRelatorios';
import PaginaPedidos from './paginas/PaginaPedidos';

import { AppBar, Toolbar, Button } from '@mui/material';

function Menu() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          Produção
        </Button>
        <Button color="inherit" component={Link} to="/pedidos">
          Pedidos
        </Button>


        <Button color="inherit" component={Link} to="/produtos">
          Produtos
        </Button>





        
        <Button color="inherit" component={Link} to="/dashboard">
          Dashboard
        </Button>
        <Button color="inherit" component={Link} to="/relatorios">
          Relatórios
        </Button>
        <Button color="inherit" component={Link} to="/configuracoes">
          Configurações
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Menu />
      <Routes>
        <Route path="/" element={<ControleProducao />} />
        <Route path="/produtos" element={<PaginaProdutos />} />
        <Route path="/pedidos" element={<PaginaPedidos />} />
        <Route path="/dashboard" element={<PaginaDashboard />} />
        <Route path="/relatorios" element={<PaginasRelatorios />} />
        <Route path="/configuracoes" element={<PaginaConfiguracoes />} />
      </Routes>
    </BrowserRouter>
  );
}
