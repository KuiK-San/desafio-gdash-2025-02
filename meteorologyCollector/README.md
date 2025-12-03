# Meteorology Collector

O Meteorology Collector é uma aplicação Python que coleta dados meteorológicos de uma API de clima (OpenWeatherMap) e os envia para uma fila de mensagens RabbitMQ. A aplicação executa periodicamente, coletando informações climáticas de uma localização especificada e publicando-as como mensagens JSON em uma fila RabbitMQ para processamento posterior por outros serviços.

O projeto é containerizado usando Docker e Docker Compose, facilitando o deploy e execução em qualquer ambiente. Inclui logging  e testes unitários para garantir confiabilidade e manutenibilidade.

## Requisitos

- **Docker** (versão 20.10 ou superior)
- **Docker Compose** (versão 2.0 ou superior)
- **Chave de API do OpenWeatherMap** (plano gratuito disponível em [openweathermap.org](https://openweathermap.org/api))

### Dependências Python

- `requests` - Requisições HTTP à API de clima
- `pika` - RabbitMQ
- `python-dotenv` - Carregar variáveis de ambiente
- `pytest` - Executar testes unitários

## Como Rodar os Testes Unitários

Para executar os testes unitários, você precisa ter Python 3.11+ instalado localmente e instalar as dependências: _recomendado utilizar um ambiente virtual (venv)_

```bash
# Instalar dependências
pip install -r requirements.txt

# Executar todos os testes
pytest

# Executar um arquivo de teste específico
pytest src/tests/test_collector.py
pytest src/tests/test_mensage_sender.py
```

## Como Rodar o Projeto Usando Docker Compose

### Pré-requisitos

1. **Obter uma Chave de API do OpenWeatherMap:**
   - Acesse [https://openweathermap.org/api](https://openweathermap.org/api)
   - Crie uma conta gratuita
   - Navegue até a seção de chaves de API no painel da sua conta
   - Copie sua chave de API (pode levar alguns minutos para ser ativada)

2. **Configurar Variáveis de Ambiente:**
   
   Crie um arquivo `.env` na raiz do projeto (opcional, você também pode passar as variáveis diretamente):

   ```env
   CLIMATE_API_KEY=sua_chave_api_openweathermap_aqui
   CLIMATE_API_URL=https://api.openweathermap.org/data/2.5/weather
   LAT=-25.4284
   LON=-49.2733
   RABBITMQ_USER=guest
   RABBITMQ_PASSWORD=guest
   RABBITMQ_QUEUE=climate-data
   ```

### Executando o Projeto

1. **Construir e iniciar os containers:**
   ```bash
   docker-compose up -d --build
   ```

2. **Visualizar logs:**
   ```bash
   # Todos os serviços
   docker-compose logs -f
   
   # Apenas o serviço collector
   docker-compose logs -f collector
   ```

3. **Parar os containers:**
   ```bash
   docker-compose down
   ```