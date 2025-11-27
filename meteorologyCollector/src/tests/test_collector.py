import pytest
import os
from unittest.mock import patch, MagicMock
from app.collector.main import ClimateClient

@pytest.fixture
def env_mock(monkeypatch):
    monkeypatch.setenv("CLIMATE_API_KEY", "API_KEY.CLIMATE")
    monkeypatch.setenv("CLIMATE_API_URL", "https://climate-url.com")
    
@pytest.fixture
def sample_api_response():
    return 

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

    with pytest.raises(ValueError): ClimateClient(lat=10, lon=20, units="errorUnit")

@patch("app.collector.main.requests.get")
def test_fetch_success(mock_get, env_mock):
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = { "temp": 25 }
    
    mock_get.return_value = mock_response
    
    client = ClimateClient(lat=1, lon=2)
    data = client._fetch()
    
    assert data == { "temp": 25 }
    
@patch("app.collector.main.requests.get")
def test_fetch_error_status(mock_get, env_mock):
    mock_response = MagicMock()
    mock_response.status_code = 502
    mock_response.text = "Internal Server Error"
    
    mock_get.return_value = mock_response
    
    client = ClimateClient(lat=1, lon=2)
    
    with pytest.raises(RuntimeError) as err:
        client._fetch()
        
    assert "Failed to fetch climate data" in str(err.value)

