# 📦 Sistema PCP - Planejamento e Controle da Produção

Este projeto é um sistema web desenvolvido em **React** para atender as rotinas de um analista de PCP (Planejamento e Controle da Produção). O foco principal está na organização do fluxo produtivo, controle de produtos, geração de relatórios e ajustes de configuração.

---

## 🚀 Funcionalidades

- 📊 **Dashboard** com indicadores de produção.
- 🛠️ **Controle de Produção** com dados em tempo real.
- 📦 **Gerenciamento de Produtos** com listagem e organização.
- 📁 **Relatórios e Análises** de performance e produção.
- ⚙️ **Configurações do Sistema** ajustáveis por perfil.

---

## 🗂️ Estrutura do Projeto

```
src/
│
├── componentes/
│   ├── CardProduto.js             # Designer de fundo em formato de card caracteristico do sistema.
│   ├── LayoutPrincipal.js         # Componente de layout principal (barra superior, container).
│   ├── TabelaInventarioEdicao.js  # Componente de tabela onde pode editar.
│   ├── TabelaProdutos.js          # Componente de tabela para exibir produtos.
│   └── TabelaProdutosEdicao.js    # Componente de tabela onde pode editar.
│
├── gancho/
│   └── UseProdutos.js             # Hook customizado para gerenciar dados de produtos de todas as paginas do sistema.
│
├── paginas/
│   ├── ControleProducao.js        # Página principal para controle da produção
│   ├── PaginaConfiguracoes.js     # Página para configurações do sistema
│   ├── PaginaDashboard.js         # Página do dashboard com indicadores
│   ├── PaginaEstoque.js           # Pagina do estoque.
│   ├── PaginaPedidos.js           # Página de pedidos com conversão csv - deve enviar os 2 csv pra poder resolver
│   ├── PaginaProdutos.js          # Página para gerenciamento de produtos
│   └── PaginasRelatorios.js       # Página para relatórios e análises
│
├── servicos/
│   └── api.js                     # Arquivo para futuras integrações com backend (API)
│
├── packege.json                
├── index.js 
├── index.css
├── App.css
└── App.js                         # Arquivo principal que configura as rotas

```

---

## 🛠️ Tecnologias Utilizadas

- [React.js](https://reactjs.org/)
- [React Router](https://reactrouter.com/) – para controle de rotas
- [JavaScript (ES6+)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- [Vercel](https://vercel.com/) – para deploy do sistema

---

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/sistema-pcp.git
cd sistema-pcp

# Instale as dependências
npm install

# Inicie o projeto em modo de desenvolvimento
npm start
```

A aplicação estará disponível em `http://localhost:3000`.

---

## 📤 Deploy

Este projeto está hospedado via [Vercel](https://vercel.com), com build automático a cada push na branch principal.

🔗 [Acessar sistema](https://controle-pcp-seven.vercel.app)

---

## 📌 Próximos Passos

- Integração com backend (ex: Node.js + Express ou Firebase)
- Controle de login e autenticação por perfil
- Exportação de relatórios em PDF/Excel
- Responsividade completa para dispositivos móveis

---

## 🙋‍♂️ Contribuição

Pull requests são bem-vindos! Para grandes mudanças, por favor abra uma issue primeiro para discutir o que você gostaria de modificar.

---

## 🧾 Licença

Este projeto está sob licença MIT.
