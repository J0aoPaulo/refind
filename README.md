# ReFind - Sistema de Itens Perdidos e Encontrados

## Visão Geral

ReFind é uma aplicação web desenvolvida para gerenciar itens perdidos e encontrados. O sistema permite que usuários registrem itens que perderam ou encontraram, facilitando o processo de devolução ao proprietário original.

## Tecnologias Utilizadas

- **Backend**: Node.js com Express
- **Banco de Dados**: PostgreSQL
- **ORM**: Prisma
- **Autenticação**: JWT (JSON Web Tokens)
- **Containerização**: Docker e Docker Compose
- **Segurança**: Bcrypt para hash de senhas

## Arquitetura do Sistema

O sistema segue uma arquitetura MVC (Model-View-Controller) para organização do código:

- **Models**: Implementados através do Prisma Schema
- **Controllers**: Responsáveis pela lógica de negócio
- **Routes**: Gerenciam as rotas da API

## Estrutura de Pastas

~~~~
refind/
├── docker-compose.yml
├── Dockerfile
├── prisma/
│   ├── migrations/
│   └── schema.prisma
└── src/
    ├── controllers/
    │   ├── authController.js
    │   ├── categoryController.js
    │   ├── itemsController.js
    │   └── userController.js
    ├── middlewares/
    │   └── authMiddleware.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── categoryRoutes.js
    │   ├── itemsRoutes.js
    │   └── userRoutes.js
    └── utils/
        └── codeGenerator.js
~~~~
## Estrutura do Banco de Dados

### Tabelas Principais:

1. **Item**:
   - Armazena informações sobre itens perdidos ou encontrados
   - Campos incluem: nome, data, localização, contato, status, etc.
   - Cada item possui um código único gerado automaticamente

2. **Category**:
   - Categorias para classificação dos itens
   - Relacionamento 1:N com Item

3. **User**:
   - Informações dos usuários do sistema
   - Suporte a diferentes níveis de acesso (USER, ADMIN, OWNER)

## Funcionalidades Principais

### Gerenciamento de Itens
- Cadastro de itens perdidos ou encontrados
- Busca de itens por categoria, localização, status e nome
- Atualização de informações de itens
- Remoção de itens

### Gerenciamento de Categorias
- Criação, listagem, atualização e remoção de categorias

### Autenticação e Autorização
- Registro de usuários
- Login com geração de token JWT
- Controle de acesso baseado em papéis (ROLE)
- Proteção de rotas sensíveis

### Gerenciamento de Usuários
- Criação de administradores (apenas por usuários OWNER)
- Listagem, atualização e remoção de usuários

## Configuração do Ambiente

### Pré-requisitos
- Docker e Docker Compose
- Node.js (para desenvolvimento local, opcional)

### Variáveis de Ambiente

O sistema requer as seguintes variáveis de ambiente:

```
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
POSTGRES_USER=seu_usuario
POSTGRES_PASSWORD=sua_senha
POSTGRES_DB=refind_db
JWT_SECRET=seu_jwt_secret
```

### Execução com Docker

1. Clone o repositório
2. Configure o arquivo `.env` com as variáveis acima
3. Execute os containers:

```bash
docker-compose up -d --build
```

## Endpoints da API

### Autenticação
- `POST /auth/register` - Registro de usuários
- `POST /auth/login` - Login e geração de token

### Itens
- `GET /items` - Listar todos os itens (com filtros opcionais)
- `POST /items` - Criar um novo item (requer autenticação ADMIN/OWNER)
- `PUT /items/:code` - Atualizar um item pelo código (requer autenticação ADMIN/OWNER)
- `DELETE /items/:code` - Remover um item pelo código (requer autenticação ADMIN/OWNER)

### Categorias
- `GET /categories` - Listar todas as categorias
- `GET /categories/:id` - Buscar categoria pelo ID
- `POST /categories` - Criar uma nova categoria (requer autenticação ADMIN/OWNER)
- `PUT /categories/:id` - Atualizar uma categoria (requer autenticação ADMIN/OWNER)
- `DELETE /categories/:id` - Remover uma categoria (requer autenticação ADMIN/OWNER)

### Usuários
- `GET /users` - Listar todos os usuários (requer autenticação ADMIN/OWNER)
- `POST /users/admin` - Criar um administrador (requer autenticação OWNER)
- `GET /users/:id` - Buscar usuário pelo ID
- `PUT /users/:id` - Atualizar um usuário
- `DELETE /users/:id` - Remover um usuário (requer autenticação ADMIN/OWNER)

## Níveis de Acesso

O sistema implementa três níveis de acesso:

1. **USER**: Usuário comum, acesso limitado
2. **ADMIN**: Administrador, acesso a funções de gerenciamento
3. **OWNER**: Proprietário do sistema, acesso total incluindo criação de administradores

## Licença

Este projeto está licenciado sob a [GNU License](LICENSE.md).