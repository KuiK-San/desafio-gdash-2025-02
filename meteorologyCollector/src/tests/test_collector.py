import pytest
from unittest.mock import patch, MagicMock
from app.collector.main import ClimateClient

# -----------------------------
# Fixtures
# -----------------------------

@pytest.fixture
def env_mock(monkeypatch):
    monkeypatch.setenv("CLIMATE_API_KEY", "API_KEY.CLIMATE")
    monkeypatch.setenv("CLIMATE_API_URL", "https://climate-url.com")


@pytest.fixture
def mock_response():
    """Mock da resposta JSON da API."""
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "coord": {
            "lon": -49.27,
            "lat": -25.42
        },
        "weather": [
            {
                "id": 800,
                "main": "Clear",
                "description": "céu limpo",
                "icon": "01d"
            }
        ],
        "base": "stations",
        "main": {
            "temp": 23.43,
            "feels_like": 23.55,
            "temp_min": 22.13,
            "temp_max": 26.25,
            "pressure": 1014,
            "humidity": 66,
            "sea_level": 1014,
            "grnd_level": 908
        },
        "visibility": 10000,
        "wind": {
            "speed": 2.06,
            "deg": 0
        },
        "clouds": {
            "all": 0
        },
        "dt": 1764338326,
        "sys": {
            "type": 2,
            "id": 2073418,
            "country": "BR",
            "sunrise": 1764317907,
            "sunset": 1764366731
        },
        "timezone": -10800,
        "id": 3464975,
        "name": "Curitiba",
        "cod": 200
    }

    return mock_response


# -----------------------------
# Testes de inicialização
# -----------------------------

def test_init_loads_env(monkeypatch):
    monkeypatch.setenv("CLIMATE_API_KEY", "ABC")
    monkeypatch.setenv("CLIMATE_API_URL", "https://newapi-url.com")

    client = ClimateClient(lat=1, lon=2)

    assert client.api_key == "ABC"
    assert client.api_url == "https://newapi-url.com?lat=1&lon=2&appid=ABC&units=metric&lang=pt_br"


def test_init_without_env_api_key(monkeypatch):
    monkeypatch.delenv("CLIMATE_API_KEY", raising=False)
    monkeypatch.setenv("CLIMATE_API_URL", "https://climate-url.com")

    with pytest.raises(ValueError):
        ClimateClient(lat=1, lon=2)


def test_init_without_env_api_url(monkeypatch):
    monkeypatch.setenv("CLIMATE_API_KEY", "AAA")
    monkeypatch.delenv("CLIMATE_API_URL", raising=False)

    with pytest.raises(ValueError):
        ClimateClient(lat=1, lon=2)


# -----------------------------
# Testes do build URL
# -----------------------------

def test_build_url(env_mock):
    client = ClimateClient(lat=10, lon=20)
    url = client._build_url()

    assert "lat=10" in url
    assert "lon=20" in url
    assert "appid=API_KEY.CLIMATE" in url
    assert "units=metric" in url
    assert "lang=pt_br" in url


def test_build_url_another_unit(env_mock):
    client = ClimateClient(lat=10, lon=20, units="imperial")
    url = client._build_url()
    assert "units=imperial" in url


def test_build_url_unit_error(env_mock):
    with pytest.raises(ValueError):
        ClimateClient(lat=10, lon=20, units="errorUnit")


# -----------------------------
# Testes do JSON filtrado
# -----------------------------

@patch("app.collector.main.requests.get")
def test_get_filtered_structure(mock_get, mock_response, env_mock):
    mock_get.return_value = mock_response

    client = ClimateClient(lat=1, lon=2)
    data = client.getCurrentFiltred()

    assert isinstance(data, dict)
    assert set(data.keys()) == {"location", "current", "astronomical"}


@patch("app.collector.main.requests.get")
def test_get_filtered_location(mock_get, mock_response, env_mock):
    mock_get.return_value = mock_response

    client = ClimateClient(lat=1, lon=2)
    data = client.getCurrentFiltred()

    location = data["location"]

    assert location["name"] == "Curitiba"
    assert location["country"] == "BR"
    assert location["coordinates"]["lat"] == -25.42
    assert location["coordinates"]["lon"] == -49.27
    assert isinstance(location["timezone"], int)


@patch("app.collector.main.requests.get")
def test_get_filtered_current_weather(mock_get, mock_response, env_mock):
    mock_get.return_value = mock_response

    client = ClimateClient(lat=1, lon=2)
    data = client.getCurrentFiltred()

    current = data["current"]

    assert current["weather"]["main"] == "Clear"
    assert current["weather"]["description"] == "céu limpo"
    assert current["weather"]["icon"] == "01d"

    assert isinstance(current["temperature"]["temp"], float)
    assert isinstance(current["temperature"]["feels_like"], float)
    assert isinstance(current["temperature"]["temp_min"], float)
    assert isinstance(current["temperature"]["temp_max"], float)

    assert current["humidity"] == 66

    assert current["pressure"]["value"] == 1014
    assert current["pressure"]["sea_level"] == 1014
    assert current["pressure"]["ground_level"] == 908

    assert current["visibility"] == 10000
    assert current["clouds"] == 0


@patch("app.collector.main.requests.get")
def test_get_filtered_astronomical(mock_get, mock_response, env_mock):
    mock_get.return_value = mock_response

    client = ClimateClient(lat=1, lon=2)
    data = client.getCurrentFiltred()

    astro = data["astronomical"]

    assert astro["sunrise"] == 1764317907
    assert astro["sunset"] == 1764366731
    assert isinstance(astro["sunrise"], int)
    assert isinstance(astro["sunset"], int)


@patch("app.collector.main.requests.get")
def test_get_filtered_types(mock_get, mock_response, env_mock):
    mock_get.return_value = mock_response

    client = ClimateClient(lat=1, lon=2)
    data = client.getCurrentFiltred()

    assert isinstance(data["location"]["name"], str)
    assert isinstance(data["location"]["coordinates"]["lat"], float)

    assert isinstance(data["current"]["temperature"]["temp"], float)
    assert isinstance(data["current"]["humidity"], int)

    assert isinstance(data["astronomical"]["sunrise"], int)
    assert isinstance(data["astronomical"]["sunset"], int)
