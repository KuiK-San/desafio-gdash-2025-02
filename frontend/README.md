# Frontend - React + Vite + Tailwind

Aplicação frontend desenvolvida com React, Vite, TypeScript, Tailwind CSS e componentes shadcn/ui. Interface moderna para visualização de dados meteorológicos, insights de IA e gerenciamento de usuários.

## 🚀 Tecnologias

- **React 19** - Biblioteca JavaScript para interfaces
- **Vite** - Build tool e dev server
- **TypeScript** - Linguagem de programação
- **Tailwind CSS** - Framework CSS utility-first
- **shadcn/ui** - Componentes UI acessíveis
- **Redux Toolkit** - Gerenciamento de estado
- **React Router** - Roteamento
- **Recharts** - Gráficos e visualizações

## 📋 Funcionalidades

- ✅ Dashboard de clima com dados em tempo real
- ✅ Visualização de insights de IA
- ✅ Gráficos de histórico de temperatura
- ✅ CRUD completo de usuários
- ✅ Autenticação e rotas protegidas
- ✅ Filtros por data
- ✅ Exportação de dados (CSV/XLSX)
- ✅ Interface responsiva e moderna

## 🔧 Requisitos

- **Docker** (versão 20.10 ou superior)
- **Docker Compose** (versão 2.0 ou superior)
- **Node.js 18+** (apenas para desenvolvimento local)

## 🐳 Como Rodar o Projeto Usando Docker Compose

### Opção 1: Docker Compose na Raiz do Projeto

O projeto possui um `docker-compose.yml` na raiz que orquestra todos os serviços. Para rodar o frontend:

```bash
# Na raiz do projeto
docker-compose up frontend -d
```

Isso irá subir automaticamente:
- Backend (dependência do frontend)
- Frontend (React + Vite)

### Opção 2: Build e Execução Manual

1. **Configurar Variáveis de Ambiente (opcional):**

   Se necessário, copie o arquivo `.env.example` para `.env`:

   ```bash
   cp .env.example .env
   ```

   Configure a URL da API:

   ```env
   VITE_API_URL=http://localhost:3000
   ```

2. **Construir a imagem Docker:**

   ```bash
   docker build -t gdash-frontend .
   ```

3. **Executar o container:**

   ```bash
   docker run -d -p 80:80 --name gdash-frontend gdash-frontend
   ```

## 🔗 URLs

Após iniciar o container, o frontend estará disponível em:

- **Frontend:** `http://localhost`
- **API Backend:** `http://localhost:3000` (deve estar rodando)

## 🛠️ Desenvolvimento Local (sem Docker)

Se preferir rodar localmente sem Docker:

1. **Instalar dependências:**

   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente (opcional):**

   ```bash
   cp .env.example .env
   # Edite o .env se necessário
   ```

3. **Rodar em modo desenvolvimento:**

   ```bash
   npm run dev
   ```

   O servidor de desenvolvimento estará disponível em `http://localhost:5173`

4. **Build para produção:**

   ```bash
   npm run build
   ```

   Os arquivos serão gerados na pasta `dist/`

5. **Preview da build de produção:**

   ```bash
   npm run preview
   ```

## 📝 Scripts Disponíveis

- `npm run dev` - Iniciar servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview da build de produção
- `npm run lint` - Executar linter

## 🏗️ Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/     # Componentes React
│   │   ├── auth/       # Componentes de autenticação
│   │   ├── dashboard/  # Componentes do dashboard
│   │   ├── users/      # Componentes de usuários
│   │   ├── layout/     # Componentes de layout
│   │   └── ui/         # Componentes shadcn/ui
│   ├── store/          # Redux store e slices
│   ├── types/          # Tipos TypeScript
│   ├── utils/          # Funções utilitárias
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Bibliotecas e configurações
│   └── main.tsx        # Arquivo principal
├── Dockerfile          # Dockerfile para produção
└── vite.config.ts      # Configuração do Vite
```

## 🎨 Componentes UI

O projeto utiliza componentes do [shadcn/ui](https://ui.shadcn.com/), incluindo:

- Button
- Card
- Dialog
- Input
- Label
- Separator
- Sheet
- Sidebar
- Skeleton
- Table
- Tooltip

## 🔐 Autenticação

O frontend implementa autenticação JWT:

1. Login através do componente `Login.tsx`
2. Tokens armazenados no Redux store
3. Rotas protegidas com `ProtectedRoute`
4. Requisições autenticadas via headers

## 📊 Dashboard

O dashboard exibe:

- Temperatura atual
- Histórico de temperatura (gráfico)
- Cards de insights
- Filtros por data
- Exportação de dados

## 📚 Documentação Adicional

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
