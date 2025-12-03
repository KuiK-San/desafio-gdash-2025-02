import os
import logging
from urllib.parse import urlencode
from dotenv import load_dotenv
import requests

load_dotenv()

logger = logging.getLogger(__name__)

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
        
        self.api_url = self._build_url()
        
    def _build_url(self):
        params = {
            'lat': self.lat,
            'lon': self.lon,
            'appid': self.api_key,
            'units': self.units,
            'lang': self.lang
        }
        
        return f"{self.api_url}?{urlencode(params)}"
    
    def _fetch(self):
        logger.info(f"Making request to API: {self.api_url.split('?')[0]}...")
        response = requests.get(self.api_url)
        
        logger.info(f"API response: status_code={response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            logger.info("API data obtained successfully")
            return data
        
        logger.error(f"Failed to fetch API data: status_code={response.status_code}, response={response.text}")
        raise RuntimeError("Failed to fetch climate data")
        
    def getCurrentFiltred(self):
        logger.info("Processing API data and filtering relevant information...")
        data = self._fetch()

        location = {
            "name": data.get("name"),
            "country": data.get("sys", {}).get("country"),
            "coordinates": {
                "lat": data.get("coord", {}).get("lat"),
                "lon": data.get("coord", {}).get("lon"),
            },
            "timezone": data.get("timezone"),
        }

        weather = data.get("weather", [{}])[0]

        current = {
            "weather": {
                "main": weather.get("main"),
                "description": weather.get("description"),
                "icon": weather.get("icon"),
            },
            "temperature": {
                "temp": data.get("main", {}).get("temp"),
                "feels_like": data.get("main", {}).get("feels_like"),
                "temp_min": data.get("main", {}).get("temp_min"),
                "temp_max": data.get("main", {}).get("temp_max"),
            },
            "humidity": data.get("main", {}).get("humidity"),
            "pressure": {
                "value": data.get("main", {}).get("pressure"),
                "sea_level": data.get("main", {}).get("sea_level"),
                "ground_level": data.get("main", {}).get("grnd_level"),
            },
            "visibility": data.get("visibility"),
            "clouds": data.get("clouds", {}).get("all"),
        }

        astronomical = {
            "sunrise": data.get("sys", {}).get("sunrise"),
            "sunset": data.get("sys", {}).get("sunset"),
        }

        filtered_data = {
            "location": location,
            "current": current,
            "astronomical": astronomical
        }
        
        logger.info(f"Filtered data prepared: location={location.get('name')}, temperature={current.get('temperature', {}).get('temp')}°C")
        
        return filtered_data