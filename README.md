# 🚀 GDash – Manual de Execução

Este guia explica como rodar **todo o ecossistema da aplicação** utilizando Docker Compose.

Todo o ambiente pode ser iniciado com **um único comando**.

---

## 🎥 Video explicativo
 - [video no youtube](https://youtu.be/fM2yQH1hDQ4)

---

# 📦 1. Como rodar tudo via Docker Compose

Assumindo que seu repositório contém um `docker-compose.yml` configurado para:

* Backend
* Nginx
* Frontend
* Serviço Python
* Worker Go
* MongoDB
* RabbitMQ

Execute:

```bash
docker compose up -d --build
```

Isso irá:

* Fazer build das imagens
* Iniciar todos os containers
* Garantir dependências como MongoDB e RabbitMQ
* Expor todas as URLs automaticamente

Para acompanhar logs:

```bash
docker compose logs -f
```

Para derrubar tudo:

```bash
docker compose down
```

Para derrubar apena o etl:

```bash
docker compose down worker collector
```

---

# 🌐 4. URLs principais

Dependendo da configuração comum de portas, estas são as URLs padrão:

### 🔵 **Frontend**


```
http://localhost
```

### 🟣 **API Backend (NestJS)**

```
http://localhost/api
```


### 🔶 **RabbitMQ Dashboard**

```
http://localhost:15672
```

---

# 🔐 5. Usuário padrão (login inicial)

Ao rodar o backend pela primeira vez, ele cria um usuário administrador automaticamente.

Credenciais padrão:

```
Email: admin@example.com
Senha: gdash2025
```
