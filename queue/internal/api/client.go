package api

import (
	"log"
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/kuik-san/gdash/internal/models"
)

type Client struct {
	apiURL    string
	httpClient *http.Client
}

func NewClient() *Client {
	apiURL := os.Getenv("API_URL")
	if apiURL == "" {
		apiURL = "http://localhost:3000"
	}

	return &Client{
		apiURL: apiURL,
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

func (c *Client) Send(item models.Item) error {
	jsonData, err := json.Marshal(item)

	if err != nil {
		return fmt.Errorf("error marshaling item to JSON: %w", err)
	}

	log.Printf("Send item to API: \n$s", string(jsonData))

	req, err := http.NewRequest("POST", c.apiURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("error creating request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Source", "go-worker")	

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("error sending request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("API returned status code: %d", resp.StatusCode)
	}

	return nil
}
