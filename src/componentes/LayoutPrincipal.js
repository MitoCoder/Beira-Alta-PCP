// src/componentes/LayoutPrincipal.js
import React from 'react';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';

export default function LayoutPrincipal({ children }) {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            Sistema PCP
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ marginTop: 2 }}>
        {children}
      </Container>
    </>
  );
}
