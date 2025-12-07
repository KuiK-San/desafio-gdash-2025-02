package main

import (
	"log"
	"time"

	"github.com/joho/godotenv"
	"github.com/kuik-san/gdash/internal/api"
	"github.com/kuik-san/gdash/internal/queue"
)

func main() {

	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: Error loading .env file: %v", err)
	}

	queueConsumer := queue.NewConsumer()
	apiClient := api.NewClient()

	if err := run(queueConsumer, apiClient); err != nil {
		log.Fatal(err)
	}
}

func run(queueConsumer *queue.Consumer, apiClient *api.Client) error {
	for {
		items, err := queueConsumer.Consume()
		if err != nil {
			log.Printf("Error consuming queue: %v", err)
			time.Sleep(1 * time.Second)
			continue
		}

		if len(items) == 0 {
			time.Sleep(1 * time.Second)
			continue
		}

		for _, item := range items {

			if err := apiClient.Send(item); err != nil {
				log.Printf("Error sending item to API: %v", err)
				continue
			}
		}

		time.Sleep(10 * time.Second)
	}
}
