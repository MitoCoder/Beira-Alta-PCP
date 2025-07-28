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

  const handleDelete = async (id) => {
    if (!id) {
      message.error('ID inválido');
      return;
    }

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
      render: (_, record) => (
        <>
          <Button onClick={() => handleEdit(record)} type="link">
            Editar
          </Button>
          <Popconfirm
            title="Deseja excluir este registro?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button danger type="link">
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
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ color: '#fff', fontSize: 20 }}>Controle de Produção</Header>
        <Content style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
          <Form layout="vertical" form={form} onFinish={handleSubmit}>
            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="produto"
                  label="Produto"
                  rules={[{ required: true, message: 'Informe o produto' }]}
                >
                  <Select placeholder="Selecione um produto">
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
                  <Input type="number" min={1} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="data"
                  label="Data"
                  rules={[{ required: true, message: 'Informe a data' }]}
                >
                  <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={saving}>
                {editingRecord ? 'Atualizar' : 'Incluir'}
              </Button>
              {editingRecord && (
                <Button
                  onClick={() => {
                    setEditingRecord(null);
                    form.resetFields();
                  }}
                  style={{ marginLeft: 8 }}
                >
                  Cancelar
                </Button>
              )}
            </Form.Item>
          </Form>

          <Input.Search
            placeholder="Buscar por produto..."
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: 16, maxWidth: 300 }}
            allowClear
          />

          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            rowKey="id"
            style={{ marginTop: 16 }}
            scroll={{ x: true }}
          />
        </Content>
        <Footer style={{ textAlign: 'center' }}>© {new Date().getFullYear()} Controle PCP</Footer>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
