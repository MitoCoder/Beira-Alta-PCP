import React, { useRef } from 'react';
import LayoutPrincipal from '../componentes/LayoutPrincipal';
import { Box, Typography, Paper, Stack, Button } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import UseProdutos from '../gancho/UseProdutos';

const coresColunas = {
  fila: '#e3f2fd',
  andamento: '#fff3e0',
  finalizadas: '#e8f5e9',
};

const nomesColunas = {
  fila: 'Fila de Produção',
  andamento: 'Em Andamento',
  finalizadas: 'Finalizadas',
};

const statusPorColuna = {
  fila: 'Pendente',
  andamento: 'Produzindo',
  finalizadas: 'Finalizado',
};

export default function PaginaDashboard() {
  const { produtos, setProdutos } = UseProdutos();
  const quadroRef = useRef(null);

  const aoArrastar = (resultado) => {
    const { source, destination } = resultado;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const produtoMovidoId = Number(
      produtos
        .filter((p) => p.status === statusPorColuna[source.droppableId])
        [source.index]?.id
    );

    if (!produtoMovidoId) return;

    setProdutos((produtosAtuais) =>
      produtosAtuais.map((p) =>
        p.id === produtoMovidoId
          ? { ...p, status: statusPorColuna[destination.droppableId] }
          : p
      )
    );
  };

  const colunas = {
    fila: produtos
      .filter((p) => p.status === 'Pendente')
      .map((p) => ({ id: String(p.id), titulo: `${p.codigo} - ${p.descricao}` })),
    andamento: produtos
      .filter((p) => p.status === 'Produzindo')
      .map((p) => ({ id: String(p.id), titulo: `${p.codigo} - ${p.descricao}` })),
    finalizadas: produtos
      .filter((p) => p.status === 'Finalizado')
      .map((p) => ({ id: String(p.id), titulo: `${p.codigo} - ${p.descricao}` })),
  };

  const imprimirQuadro = () => {
    const conteudo = quadroRef.current.innerHTML;
    const minhaJanela = window.open('', '', 'width=1200,height=800');
    minhaJanela.document.write(`
      <html>
        <head>
          <title>Impressão do Quadro de Produção</title>
          <style>
            @media print {
              @page { size: landscape; margin: 20mm; }
              body {
                font-family: "Roboto", Arial, sans-serif;
                margin: 0;
                padding: 10px 20px;
                color: #222;
              }
              h2 {
                text-align: center;
                margin-bottom: 24px;
                font-weight: 700;
                font-size: 24px;
              }
              .container {
                display: flex;
                gap: 24px;
                justify-content: flex-start;
                overflow: visible !important;
                page-break-inside: avoid;
              }
              .coluna {
                min-width: 320px;
                max-width: 320px;
                background-color: #f9f9f9;
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 16px;
                box-sizing: border-box;
                flex-shrink: 0;
                box-shadow: none !important;
              }
              .coluna h6 {
                font-weight: 700;
                font-size: 18px;
                color: #333;
                margin-bottom: 16px;
                border-bottom: 2px solid #1976d2;
                padding-bottom: 6px;
              }
              .card {
                background: #fff;
                border: 1px solid #ccc;
                border-radius: 6px;
                padding: 12px 14px;
                margin-bottom: 12px;
                font-weight: 500;
                font-size: 14px;
                box-shadow: 0 0 5px rgba(0,0,0,0.05);
                word-break: break-word;
                page-break-inside: avoid;
              }
              ::-webkit-scrollbar {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <h2>Quadro de Produção</h2>
          <div class="container">
            ${conteudo}
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              }
            };
          </script>
        </body>
      </html>
    `);
    minhaJanela.document.close();
  };

  return (
    <LayoutPrincipal>
      <Box
        sx={{
          mt: 6,
          p: 4,
          maxWidth: 1400,
          mx: 'auto',
          backgroundColor: '#f9f9f9',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold" align="center" color="primary">
          Quadro de Produção
        </Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 3 }}
          onClick={imprimirQuadro}
        >
          🖨️ Imprimir Quadro (Paisagem)
        </Button>

        <DragDropContext onDragEnd={aoArrastar}>
          <Box
            ref={quadroRef}
            className="container"
            sx={{
              display: 'flex',
              gap: 2,
              overflowX: 'auto',
              pb: 4,
            }}
          >
            {Object.entries(colunas).map(([colunaId, itens]) => (
              <Droppable droppableId={colunaId} key={colunaId}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="coluna"
                    sx={{
                      minWidth: 300,
                      maxWidth: 320,
                      backgroundColor: coresColunas[colunaId],
                      borderRadius: 2,
                      p: 2,
                      flexShrink: 0,
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                      {nomesColunas[colunaId]}
                    </Typography>
                    <Stack spacing={2}>
                      {itens.map((item, index) => (
                        <Draggable draggableId={item.id} index={index} key={item.id}>
                          {(prov) => (
                            <Paper
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              className="card"
                              elevation={2}
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                backgroundColor: 'white',
                                typography: 'body2',
                                fontWeight: 'medium',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                                cursor: 'grab',
                              }}
                            >
                              {item.titulo}
                            </Paper>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Stack>
                  </Box>
                )}
              </Droppable>
            ))}
          </Box>
        </DragDropContext>
      </Box>
    </LayoutPrincipal>
  );
}
