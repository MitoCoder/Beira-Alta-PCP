import React from 'react';
import { Button, Table } from 'antd';
import 'antd/dist/reset.css';

const dataSource = [
  {
    key: '1',
    id: '001',
    produto: 'Parafuso',
    quantidade: 100,
    data: '2025-07-25',
  },
  {
    key: '2',
    id: '002',
    produto: 'Prego',
    quantidade: 200,
    data: '2025-07-26',
  },
];

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Produto', dataIndex: 'produto', key: 'produto' },
  { title: 'Quantidade', dataIndex: 'quantidade', key: 'quantidade' },
  { title: 'Data', dataIndex: 'data', key: 'data' },
];

function App() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Controle de PCP</h1>
      <Button type="primary" style={{ marginBottom: 16 }}>
        Adicionar Produto
      </Button>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
}

export default App;
