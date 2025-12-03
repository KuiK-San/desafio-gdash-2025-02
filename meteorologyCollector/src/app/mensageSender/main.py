import os
import logging
from dotenv import load_dotenv
import pika
import json

load_dotenv()

logger = logging.getLogger(__name__)

class MensageSender:
    def __init__(self):
        self.host = os.getenv("RABBITMQ_HOST")
        self.port = os.getenv("RABBITMQ_PORT")
        self.user = os.getenv("RABBITMQ_USER")
        self.password = os.getenv("RABBITMQ_PASSWORD")
        self.queue = os.getenv("RABBITMQ_QUEUE")
        
        if not self.host:
            raise ValueError("RABBITMQ_HOST is not defined")
        
        if not self.port:
            raise ValueError("RABBITMQ_PORT is not defined")
        
        if not self.user:
            raise ValueError("RABBITMQ_USER is not defined")
        
        if not self.password:
            raise ValueError("RABBITMQ_PASSWORD is not defined")
        
        if not self.queue:
            raise ValueError("RABBITMQ_QUEUE is not defined")
        
        self.port = int(self.port)
    
    def sendMensage(self, data: dict):
        logger.info(f"Connecting to RabbitMQ: host={self.host}, port={self.port}, queue={self.queue}")
        
        credentials = pika.PlainCredentials(self.user, self.password)
        parameters = pika.ConnectionParameters(
            host=self.host,
            port=self.port,
            credentials=credentials
        )
        
        connection = pika.BlockingConnection(parameters)
        channel = connection.channel()
        
        logger.info(f"Declaring queue '{self.queue}'...")
        channel.queue_declare(queue=self.queue, durable=True)
        logger.info(f"Queue '{self.queue}' declared successfully")
        
        json_message = json.dumps(data, ensure_ascii=False)
        
        logger.info(f"Message to be sent (JSON): {json_message}")
        logger.info(f"Message size: {len(json_message)} bytes")
        
        channel.basic_publish(
            exchange='',
            routing_key=self.queue,
            body=json_message,
            properties=pika.BasicProperties(
                delivery_mode=2,  # Makes the message durable
            )
        )
        
        logger.info(f"Message published successfully to queue '{self.queue}'")
        
        connection.close()
        logger.info("RabbitMQ connection closed")
