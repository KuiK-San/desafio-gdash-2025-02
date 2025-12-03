import json
import pytest
from unittest.mock import patch, MagicMock

from app.mensageSender.main import MensageSender


# -----------------------------
# Fixtures
# -----------------------------

@pytest.fixture
def rabbit_env(monkeypatch):
    monkeypatch.setenv("RABBITMQ_HOST", "rabbit.local")
    monkeypatch.setenv("RABBITMQ_PORT", "5672")
    monkeypatch.setenv("RABBITMQ_USER", "guest")
    monkeypatch.setenv("RABBITMQ_PASSWORD", "guest")
    monkeypatch.setenv("RABBITMQ_QUEUE", "climate-data")


# -----------------------------
# Testes de inicialização
# -----------------------------

def test_init_loads_env(rabbit_env):
    sender = MensageSender()

    assert sender.host == "rabbit.local"
    assert sender.port == 5672
    assert sender.user == "guest"
    assert sender.password == "guest"
    assert sender.queue == "climate-data"


@pytest.mark.parametrize("missing_var", [
    "RABBITMQ_HOST",
    "RABBITMQ_PORT",
    "RABBITMQ_USER",
    "RABBITMQ_PASSWORD",
    "RABBITMQ_QUEUE",
])
def test_init_missing_env_raises(monkeypatch, missing_var):
    env_vars = {
        "RABBITMQ_HOST": "rabbit.local",
        "RABBITMQ_PORT": "5672",
        "RABBITMQ_USER": "guest",
        "RABBITMQ_PASSWORD": "guest",
        "RABBITMQ_QUEUE": "climate-data",
    }

    for key, value in env_vars.items():
        if key == missing_var:
            monkeypatch.delenv(key, raising=False)
        else:
            monkeypatch.setenv(key, value)

    with pytest.raises(ValueError):
        MensageSender()


# -----------------------------
# Testes de envio de mensagem
# -----------------------------

@patch("app.mensageSender.main.pika.BlockingConnection")
def test_send_message_publishes_json(mock_connection, rabbit_env):
    mock_channel = MagicMock()

    instance = mock_connection.return_value
    instance.channel.return_value = mock_channel

    sender = MensageSender()

    payload = {
        "location": {"name": "Curitiba"},
        "current": {"temperature": {"temp": 25.0}},
    }

    sender.sendMensage(payload)

    mock_connection.assert_called_once()

    assert mock_channel.basic_publish.called

    args, kwargs = mock_channel.basic_publish.call_args

    body = kwargs.get("body") if "body" in kwargs else args[-1]

    assert isinstance(body, (bytes, str))

    if isinstance(body, bytes):
        body = body.decode("utf-8")

    sent_json = json.loads(body)
    assert sent_json == payload


