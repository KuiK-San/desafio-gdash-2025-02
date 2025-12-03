package queue

import (
	"encoding/json"
	"fmt"
	"os"

	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/kuik-san/gdash/internal/models"
)

type Consumer struct {
	conn    *amqp.Connection
	channel *amqp.Channel
	queue   string
}

func NewConsumer() *Consumer {
	return &Consumer{}
}

func (c *Consumer) connect() error {
	host := os.Getenv("RABBITMQ_HOST")
	port := os.Getenv("RABBITMQ_PORT")
	user := os.Getenv("RABBITMQ_USER")
	password := os.Getenv("RABBITMQ_PASSWORD")
	queue := os.Getenv("RABBITMQ_QUEUE")

	if host == "" || port == "" || user == "" || password == "" || queue == "" {
		return fmt.Errorf("RabbitMQ environment variables not configured.")
	}

	c.queue = queue

	amqpURL := fmt.Sprintf("amqp://%s:%s@%s:%s/", user, password, host, port)

	var err error
	c.conn, err = amqp.Dial(amqpURL)
	if err != nil {
		return fmt.Errorf("Error connecting to RabbitMQ: %w", err)
	}

	c.channel, err = c.conn.Channel()
	if err != nil {
		c.conn.Close()
		return fmt.Errorf("Error opening channel: %w: %w", err)
	}

	_, err = c.channel.QueueDeclare(
		c.queue,
		true,   
		false,  
		false,  
		false,  
		nil,    
	)
	if err != nil {
		c.channel.Close()
		c.conn.Close()
		return fmt.Errorf("Error declaring queue %w", err)
	}

	return nil
}

func (c *Consumer) Consume() ([]models.Item, error) {
	if c.conn == nil || c.conn.IsClosed() {
		if err := c.connect(); err != nil {
			return nil, err
		}
	}

	var items []models.Item

	for {
		msg, ok, err := c.channel.Get(
			c.queue, 
			true,    
		)
		if err != nil {
			return nil, fmt.Errorf("error retrieving message: %w", err)
		}

		if !ok {
			break
		}

		var item models.Item
		if err := json.Unmarshal(msg.Body, &item); err != nil {
			continue
		}

		items = append(items, item)
	}

	return items, nil
}

func (c *Consumer) Close() error {
	if c.channel != nil {
		c.channel.Close()
	}
	if c.conn != nil {
		return c.conn.Close()
	}
	return nil
}

