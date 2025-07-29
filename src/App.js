import React, { useEffect, useState } from 'react';
import {
  Layout,
  Form,
  Input,
  DatePicker,
  Button,
  Select,
  Table,
  message,
  ConfigProvider,
  Popconfirm,
  Row,
  Col,
} from 'antd';
import ptBR from 'antd/locale/pt_BR';
import 'antd/dist/reset.css';
import './App.css';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

dayjs.locale('pt-br');

const { Header, Content, Footer } = Layout;
const { Option } = Select;

const API_URL = 'https://api-controle-ecru.vercel.app/api/proxy';

function App() {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      if (json.result === 'success') {
        setData(json.data || []);
      } else {
        message.error(json.message || 'Erro ao buscar dados');
      }
    } catch (err) {
      message.error('Erro ao buscar dados: ' + err.message);
    }
    setLoading(false);
  };

  const handleSubmit = async (values) => {
    if (values.quantidade <= 0) {
      message.error('Quantidade deve ser maior que zero');
      return;
    }

    const payload = {
      action: editingRecord ? 'update' : 'create',
      id: editingRecord?.id,
      produto: values.produto,
      quantidade: values.quantidade,
      data: dayjs(values.data).format('YYYY-MM-DD'),
    };

    setSaving(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.result === 'success') {
        message.success(editingRecord ? 'Registro atualizado!' : 'Registro criado!');
        form.resetFields();
        setEditingRecord(null);
        fetchData();
      } else {
        message.error(json.message || 'Erro ao salvar');
      }
    } catch (err) {
      message.error('Erro de conexão: ' + err.message);
    }
    setSaving(false);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      produto: record.produto,
      quantidade: record.quantidade,
      data: dayjs(record.data),
    });
  };

  const confirmDelete = async (id) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          id: String(id),
        }),
      });

      const json = await res.json();
      if (json.result === 'success') {
        message.success('Registro excluído com sucesso');
        fetchData();
      } else {
        message.error(json.message || 'Erro ao excluir');
      }
    } catch (err) {
      message.error('Erro de conexão: ' + err.message);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Produto', dataIndex: 'produto', key: 'produto' },
    { title: 'Quantidade', dataIndex: 'quantidade', key: 'quantidade' },
    {
      title: 'Data',
      dataIndex: 'data',
      key: 'data',
      render: (text) => dayjs(text).format('DD-MM-YYYY'),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button onClick={() => handleEdit(record)} type="link">
            Editar
          </Button>

          <Popconfirm
            title="Deseja excluir este registro?"
            okText="Sim"
            cancelText="Cancelar"
            onConfirm={() => confirmDelete(record.id)}
            okButtonProps={{
              style: {
                background: 'linear-gradient(135deg, #005ba1, #0074d9)',
                borderRadius: '12px',
                color: 'white',
                border: 'none',
                boxShadow: '0 8px 20px rgba(0, 123, 255, 0.3)',
                fontWeight: '700',
                padding: '6px 20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              },
              onMouseEnter: (e) =>
                (e.target.style.boxShadow = '0 12px 28px rgba(0, 123, 255, 0.45)'),
              onMouseLeave: (e) =>
                (e.target.style.boxShadow = '0 8px 20px rgba(0, 123, 255, 0.3)'),
            }}
            cancelButtonProps={{
              style: {
                backgroundColor: 'white',
                borderRadius: '12px',
                color: '#005ba1',
                border: '2px solid #005ba1',
                fontWeight: '600',
                padding: '6px 20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              },
              onMouseEnter: (e) => {
                e.target.style.backgroundColor = '#005ba1';
                e.target.style.color = 'white';
                e.target.style.boxShadow = '0 4px 12px rgba(0,91,161,0.3)';
              },
              onMouseLeave: (e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = '#005ba1';
                e.target.style.boxShadow = 'none';
              },
            }}
          >
            <Button
              danger
              type="link"
              style={{ color: 'red', fontWeight: '600', marginLeft: 8 }}
            >
              Excluir
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const filteredData = data.filter((item) =>
    item.produto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ConfigProvider locale={ptBR}>
      <Layout style={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
        <Header
          style={{
            color: '#fff',
            fontSize: 24,
            fontWeight: 'bold',
            backgroundColor: '#003366',
            paddingLeft: 32,
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          }}
        >
          Controle de Produção
        </Header>
        <Content
          style={{
            padding: 24,
            maxWidth: 1100,
            margin: '24px auto',
            backgroundColor: 'white',
            borderRadius: 16,
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
            minHeight: '70vh',
          }}
        >
          <Form layout="vertical" form={form} onFinish={handleSubmit}>
            <Row gutter={24} justify="space-between" align="middle">
              <Col xs={24} sm={8}>
                <Form.Item
                  name="produto"
                  label="Produto"
                  rules={[{ required: true, message: 'Informe o produto' }]}
                >
                  <Select
                    placeholder="Selecione um produto"
                    size="large"
                    popupClassName="custom-select-popup"
                    bordered={false}
                    style={{
                      borderRadius: 12,
                      backgroundColor: '#f0f2f5',
                      paddingLeft: 12,
                    }}
                  >
                    <Option value="Produto A">Produto A</Option>
                    <Option value="Produto B">Produto B</Option>
                    <Option value="Produto C">Produto C</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="quantidade"
                  label="Quantidade"
                  rules={[
                    { required: true, message: 'Informe a quantidade' },
                    {
                      validator: (_, value) =>
                        value > 0
                          ? Promise.resolve()
                          : Promise.reject(new Error('Quantidade deve ser maior que zero')),
                    },
                  ]}
                >
                  <Input
                    type="number"
                    min={1}
                    size="large"
                    style={{
                      borderRadius: 12,
                      backgroundColor: '#f0f2f5',
                      paddingLeft: 12,
                      height: 44,
                    }}
                    bordered={false}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="data"
                  label="Data"
                  rules={[{ required: true, message: 'Informe a data' }]}
                >
                  <DatePicker
                    format="DD/MM/YYYY"
                    style={{
                      width: '100%',
                      borderRadius: 12,
                      backgroundColor: '#f0f2f5',
                      height: 44,
                    }}
                    size="large"
                    bordered={false}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item style={{ textAlign: 'right' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={saving}
                style={{
                  borderRadius: 20,
                  padding: '10px 32px',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #005ba1, #0074d9)',
                  boxShadow: '0 8px 20px rgba(0, 123, 255, 0.3)',
                  border: 'none',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 123, 255, 0.45)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 123, 255, 0.3)')
                }
              >
                {editingRecord ? 'Atualizar' : 'Incluir'}
              </Button>
            </Form.Item>
          </Form>

          <Input.Search
            placeholder="Buscar produto"
            allowClear
            size="large"
            style={{
              marginBottom: 20,
              borderRadius: 12,
              backgroundColor: '#f0f2f5',
              border: 'none',
              boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.1)',
              height: 44,
            }}
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />

          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            rowKey="id"
            pagination={{ pageSize: 7 }}
            bordered={false}
            style={{ borderRadius: 16, overflow: 'hidden' }}
            scroll={{ x: 700 }}
          />
        </Content>
        <Footer
          style={{
            textAlign: 'center',
            backgroundColor: '#003366',
            color: '#fff',
            fontWeight: '600',
            boxShadow: '0 -2px 6px rgba(0,0,0,0.15)',
          }}
        >
          Controle de Produção ©2025
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
