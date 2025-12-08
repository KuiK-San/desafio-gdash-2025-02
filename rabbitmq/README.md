# RabbitMQ

Configuração e documentação do serviço RabbitMQ utilizado como message broker no projeto GDASH.

## 🚀 Sobre

O RabbitMQ é o message broker utilizado para:
- Receber dados meteorológicos do coletor Python
- Fila de processamento para o worker Go
- Comunicação assíncrona entre serviços

## 🔧 Requisitos

- **Docker** (versão 20.10 ou superior)
- **Docker Compose** (versão 2.0 ou superior)

## 🐳 Como Rodar o RabbitMQ Usando Docker Compose

### Opção 1: Docker Compose na Raiz do Projeto

O projeto possui um `docker-compose.yml` na raiz que orquestra todos os serviços. Para rodar apenas o RabbitMQ:

```bash
# Na raiz do projeto
docker-compose up rabbitmq -d
```

### Opção 2: Executar Container Manualmente

1. **Configurar Variáveis de Ambiente:**

   Copie o arquivo `.env.example` para `.env` e configure as variáveis:

   ```bash
   cp .env.example .env
   ```

   Edite o arquivo `.env`:

   ```env
   RABBITMQ_USER=guest
   RABBITMQ_PASSWORD=guest
   ```

2. **Executar o container:**

   ```bash
   docker run -d \
     --name gdash-rabbitmq \
     -p 5672:5672 \
     -p 15672:15672 \
     -e RABBITMQ_DEFAULT_USER=guest \
     -e RABBITMQ_DEFAULT_PASS=guest \
     -v rabbitmq_data:/var/lib/rabbitmq \
     rabbitmq:3-management-alpine
   ```

## 🔗 Acesso

Após iniciar o container, o RabbitMQ estará disponível em:

- **AMQP (Protocolo):** `amqp://guest:guest@localhost:5672`
- **Management UI:** `http://localhost:15672`
  - **Usuário:** `guest`
  - **Senha:** `guest`

### Para uso dentro da rede Docker

- **Host:** `rabbitmq` (nome do serviço)
- **Porta AMQP:** `5672`
- **Connection String:** `amqp://guest:guest@rabbitmq:5672`

## 📊 Management UI

A interface de gerenciamento do RabbitMQ está disponível em `http://localhost:15672` e permite:

- Visualizar filas e mensagens
- Monitorar conexões e canais
- Gerenciar usuários e permissões
- Ver estatísticas e métricas
- Testar exchanges e bindings

## 🔄 Filas Utilizadas

O projeto utiliza as seguintes filas:

- `weather_queue` ou `climate-data` - Fila principal para dados meteorológicos

## 💾 Persistência de Dados

Os dados são persistidos em um volume Docker chamado `rabbitmq_data`. Para remover os dados:

```bash
# Parar e remover container
docker-compose down

# Remover volume (apaga todas as filas e mensagens)
docker volume rm rabbitmq_data
```

## 🔐 Segurança

- **Autenticação:** Habilitada por padrão
- **Usuário padrão:** `guest` / `guest` (apenas para desenvolvimento)
- **Produção:** Configure usuários e senhas seguras

### Configurar Novo Usuário (via Management UI)

1. Acesse `http://localhost:15672`
2. Vá em **Admin** > **Users**
3. Clique em **Add User**
4. Configure username e password
5. Configure permissões (tags: `administrator`, `monitoring`, `policymaker`, `management`)

## 📝 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `RABBITMQ_USER` | Usuário do RabbitMQ | `guest` |
| `RABBITMQ_PASSWORD` | Senha do RabbitMQ | `guest` |

## 🔍 Health Check

O RabbitMQ possui health check configurado no docker-compose:

```yaml
healthcheck:
  test: ["CMD", "rabbitmq-diagnostics", "ping"]
  interval: 10s
  timeout: 5s
```

## 🏗️ Arquitetura

```
┌─────────────────┐
│  Python Collector│
│  (Producer)      │
└────────┬─────────┘
         │
         │ Publica mensagens
         ▼
┌─────────────────┐
│    RabbitMQ      │
│  (Message Broker)│
└────────┬─────────┘
         │
         │ Consome mensagens
         ▼
┌─────────────────┐
│  Go Worker       │
│  (Consumer)      │
└─────────────────┘
```

## 🐛 Troubleshooting

### Container não inicia

- Verifique se as portas 5672 e 15672 não estão em uso
- Confirme as variáveis de ambiente
- Verifique os logs: `docker-compose logs rabbitmq`

### Não consigo acessar a Management UI

- Verifique se o container está rodando: `docker ps`
- Confirme se a porta 15672 está mapeada
- Tente acessar via IP do container

### Mensagens não são processadas

- Verifique se a fila existe no RabbitMQ
- Confirme se o consumer está conectado
- Verifique os logs do worker Go

## 📚 Documentação Adicional

- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)
- [RabbitMQ Docker Hub](https://hub.docker.com/_/rabbitmq)
- [AMQP Protocol](https://www.rabbitmq.com/amqp-0-9-1-reference.html)
- [RabbitMQ Best Practices](https://www.rabbitmq.com/best-practices.html)
