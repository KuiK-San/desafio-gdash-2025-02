# Backend - API NestJS

API REST desenvolvida em NestJS que serve como núcleo do sistema GDASH. Responsável por gerenciar dados meteorológicos, usuários, autenticação e insights de IA.

## 🚀 Tecnologias

- **NestJS** - Framework Node.js para construção de APIs escaláveis
- **TypeScript** - Linguagem de programação
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **Passport** - Autenticação (JWT e Local Strategy)
- **JWT** - Tokens de autenticação
- **bcrypt** - Hash de senhas

## 📋 Funcionalidades

- ✅ CRUD completo de usuários
- ✅ Autenticação JWT
- ✅ Gerenciamento de dados meteorológicos
- ✅ Geração de insights com IA (Groq SDK)
- ✅ Exportação de dados em CSV/XLSX
- ✅ Dashboard com métricas climáticas
- ✅ Integração com fila RabbitMQ (via worker Go)

## 🔧 Requisitos

- **Docker** (versão 20.10 ou superior)
- **Docker Compose** (versão 2.0 ou superior)
- **Node.js 22+** (apenas para desenvolvimento local)

## 🐳 Como Rodar o Projeto Usando Docker Compose

### Opção 1: Docker Compose na Raiz do Projeto

O projeto possui um `docker-compose.yml` na raiz que orquestra todos os serviços. Para rodar apenas o backend junto com suas dependências:

```bash
# Na raiz do projeto
docker-compose up backend -d
```

Isso irá subir automaticamente:
- MongoDB (dependência do backend)
- Backend (API NestJS)

### Opção 2: Docker Compose Local do Backend

Para rodar apenas o backend com seu próprio docker-compose:

1. **Configurar Variáveis de Ambiente:**

   Copie o arquivo `.env.example` para `.env` e configure as variáveis:

   ```bash
   cp .env.example .env
   ```

   Edite o arquivo `.env` com suas configurações:

   ```env
   # MongoDB
   MONGO_HOST=mongo
   MONGO_PORT=27017
   MONGO_DATABASE=gdash
   MONGO_USER=admin
   MONGO_PASSWORD=senha_segura

   # Porta da API
   PORT=3000
   NODE_ENV=production
   
   # Api IA
   GROQ_API_KEY=

   # Url Frontend
   
   ```

2. **Construir e iniciar os containers:**

   ```bash
   docker-compose up -d --build
   ```

3. **Visualizar logs:**

   ```bash
   # Todos os serviços
   docker-compose logs -f
   
   # Apenas o backend
   docker-compose logs -f api
   ```

4. **Parar os containers:**

   ```bash
   docker-compose down
   ```

5. **Parar e remover volumes (limpar dados):**

   ```bash
   docker-compose down -v
   ```

## 🔗 URLs e Endpoints

Após iniciar os containers, a API estará disponível em:

- **API Base:** `http://localhost:3000`
- **Health Check:** `http://localhost:3000/health`
- **MongoDB:** `mongodb://localhost:27017`

### Endpoints Principais

- `POST /auth/login` - Autenticação de usuário
- `GET /users` - Listar usuários (requer autenticação)
- `POST /users` - Criar usuário
- `GET /dashboard` - Dados do dashboard (requer autenticação)
- `GET /insight` - Insights de IA (requer autenticação)
- `GET /items` - Listar itens meteorológicos (requer autenticação)

## 👤 Usuário Padrão

Ao iniciar a aplicação, um usuário padrão é criado automaticamente:

- **Email:** `admin@example.com`
- **Senha:** `gdash2025`
