import os
from urllib.parse import urlencode
from dotenv import load_dotenv

load_dotenv()

class ClimateClient:
    def __init__(self, lat: float, lon: float, units: str = "metric", lang: str = "pt_br"):
        self.lat = lat
        self.lon = lon
        self.lang = lang
        self.units = units
        
        self.api_key = os.getenv("CLIMATE_API_KEY")
        self.api_url = os.getenv("CLIMATE_API_URL")
        
        if not self.api_key: 
            raise ValueError("CLIMATE_API_KEY is not defined")
        
        if not self.api_url: 
            raise ValueError("CLIMATE_API_URL is not defined")
        
        if self.units not in ["standard", "metric", "imperial"]:
            raise ValueError("Unit must be metric, imperial or standard")
        
    def _build_url(self):
        params = {
            'lat': self.lat,
            'lon': self.lon,
            'appid': self.api_key,
            'units': self.units,
            'lang': self.lang
        }
        
        return f"{self.api_url}?{urlencode(params)}"