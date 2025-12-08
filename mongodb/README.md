# MongoDB

Configuração e documentação do serviço MongoDB utilizado no projeto GDASH.

## 🚀 Sobre

O MongoDB é o banco de dados NoSQL utilizado para armazenar:
- Dados meteorológicos coletados
- Informações de usuários
- Insights gerados
- Outros dados da aplicação

## 🔧 Requisitos

- **Docker** (versão 20.10 ou superior)
- **Docker Compose** (versão 2.0 ou superior)

## 🐳 Como Rodar o MongoDB Usando Docker Compose

### Opção 1: Docker Compose na Raiz do Projeto

O projeto possui um `docker-compose.yml` na raiz que orquestra todos os serviços. Para rodar apenas o MongoDB:

```bash
# Na raiz do projeto
docker-compose up mongo -d
```

### Opção 2: Executar Container Manualmente

1. **Configurar Variáveis de Ambiente:**

   Copie o arquivo `.env.example` para `.env` e configure as variáveis:

   ```bash
   cp .env.example .env
   ```

   Edite o arquivo `.env`:

   ```env
   MONGO_INITDB_ROOT_USERNAME=admin
   MONGO_INITDB_ROOT_PASSWORD=senha_segura
   MONGO_INITDB_DATABASE=gdash
   ```

2. **Executar o container:**

   ```bash
   docker run -d \
     --name gdash-mongodb \
     -p 27017:27017 \
     -e MONGO_INITDB_ROOT_USERNAME=admin \
     -e MONGO_INITDB_ROOT_PASSWORD=senha_segura \
     -e MONGO_INITDB_DATABASE=gdash \
     -v mongo_data:/data/db \
     mongo:latest
   ```

## 🔗 Conexão

Após iniciar o container, o MongoDB estará disponível em:

- **Host:** `localhost`
- **Porta:** `27017`
- **Connection String:** `mongodb://admin:senha_segura@localhost:27017/gdash?authSource=admin`

### Para uso dentro da rede Docker

- **Host:** `mongo` (nome do serviço)
- **Porta:** `27017`
- **Connection String:** `mongodb://admin:senha_segura@mongo:27017/gdash?authSource=admin`

## 📊 Acessar o MongoDB

### Via MongoDB Shell (mongosh)

```bash
# Conectar ao container
docker exec -it gdash-mongodb mongosh -u admin -p senha_segura --authenticationDatabase admin

# Ou usando a connection string
docker exec -it gdash-mongodb mongosh "mongodb://admin:senha_segura@localhost:27017/gdash?authSource=admin"
```

### Via MongoDB Compass (GUI)

1. Instale o [MongoDB Compass](https://www.mongodb.com/try/download/compass)
2. Conecte usando a connection string:
   ```
   mongodb://admin:senha_segura@localhost:27017/gdash?authSource=admin
   ```

## 💾 Persistência de Dados

Os dados são persistidos em um volume Docker chamado `mongo_data`. Para remover os dados:

```bash
# Parar e remover container
docker-compose down

# Remover volume (apaga todos os dados)
docker volume rm mongo_data
```

## 🔐 Segurança

- **Autenticação:** Habilitada por padrão
- **Usuário root:** Configurado via `MONGO_INITDB_ROOT_USERNAME` e `MONGO_INITDB_ROOT_PASSWORD`
- **Database inicial:** Configurado via `MONGO_INITDB_DATABASE`

## 📝 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|-------|
| `MONGO_INITDB_ROOT_USERNAME` | Usuário administrador | - |
| `MONGO_INITDB_ROOT_PASSWORD` | Senha do administrador | - |
| `MONGO_INITDB_DATABASE` | Database inicial | - |

## 🏗️ Estrutura de Dados

O MongoDB armazena as seguintes coleções:

- `users` - Usuários do sistema
- `items` - Dados meteorológicos coletados
- Outras coleções conforme necessário

## 🔍 Health Check

O MongoDB possui health check configurado no docker-compose:

```yaml
healthcheck:
  test: ["CMD", "mongosh", "--eval", "db.adminCommand({ ping: 1 })"]
  interval: 10s
  retries: 5
```

## 🐛 Troubleshooting

### Container não inicia

- Verifique se a porta 27017 não está em uso
- Confirme as variáveis de ambiente
- Verifique os logs: `docker-compose logs mongo`

### Erro de autenticação

- Verifique se as credenciais estão corretas
- Confirme o `authSource` na connection string
- Verifique se o usuário foi criado corretamente

## 📚 Documentação Adicional

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)
- [MongoDB Compass](https://www.mongodb.com/products/compass)
