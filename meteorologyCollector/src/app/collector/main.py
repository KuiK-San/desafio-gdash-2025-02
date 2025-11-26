import os
from dotenv import load_dotenv

load_dotenv()

class ClimateClient:
    def __init__(self, lat: float, lon: float):
        self.lat = lat
        self.lon = lon
        
        self.api_key = os.getenv("CLIMATE_API_KEY")
        self.api_url = os.getenv("CLIMATE_API_URL")
        
        if not self.api_key: 
            raise ValueError("CLIMATE_API_KEY is not defined")
        
        if not self.api_url: 
            raise ValueError("CLIMATE_API_URL is not defined")