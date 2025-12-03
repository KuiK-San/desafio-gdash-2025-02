import logging
import os
import json
from app.collector.main import ClimateClient
from app.mensageSender.main import MensageSender
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

if __name__ == "__main__": 
    currentLocation: dict = {
        'lat': os.getenv("LAT"),
        'lon': os.getenv("LON")
    } 
    
    logger.info(f"Starting meteorological data collection for location: lat={currentLocation['lat']}, lon={currentLocation['lon']}")
    
    climate = ClimateClient(lat=currentLocation['lat'], lon=currentLocation['lon'])
    filtredClimate = climate.getCurrentFiltred()
    
    logger.info("Meteorological data collected successfully")
    logger.info(f"Filtered data: {json.dumps(filtredClimate, indent=2, ensure_ascii=False)}")

    logger.info("Sending data to RabbitMQ...")
    mensager = MensageSender()
    mensager.sendMensage(filtredClimate)
    logger.info("Data sent successfully to RabbitMQ")