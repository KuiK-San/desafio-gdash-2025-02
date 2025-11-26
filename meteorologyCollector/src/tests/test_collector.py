import pytest
import os
from unittest.mock import patch
from app.collector.main import ClimateClient

@pytest.fixture
def env_mock(monkeypatch):
    monkeypatch.setenv("CLIMATE_API_KEY", "API_KEY.CLIMATE")
    monkeypatch.setenv("CLIMATE_API_URL", "https://climate-url.com")
    
def test_init_loads_env(monkeypatch):
    monkeypatch.setenv("CLIMATE_API_KEY", "ABC")
    monkeypatch.setenv("CLIMATE_API_URL", "https://newapi-url.com")
    
    client = ClimateClient(lat=1, lon=2)
    
    assert client.api_key == "ABC"
    assert client.api_url == "https://newapi-url.com"   
    
def test_init_without_env_api_key(monkeypatch):
    monkeypatch.delenv("CLIMATE_API_KEY", raising=False)
    monkeypatch.delenv("CLIMATE_API_URL", raising=False)
    
    with pytest.raises(ValueError): ClimateClient(lat=1, lon=2)