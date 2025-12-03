package models

type Item struct {
	Location struct {
		Name        string `json:"name"`
		Country     string `json:"country"`
		Coordinates struct {
			Lat float64 `json:"lat"`
			Lon float64 `json:"lon"`
		} `json:"coordinates"`
		Timezone int `json:"timezone"`
	} `json:"location"`

	Current struct {
		Weather struct {
			Main        string `json:"main"`
			Description string `json:"description"`
			Icon        string `json:"icon"`
		} `json:"weather"`
		Temperature struct {
			Temp      float64 `json:"temp"`
			FeelsLike float64 `json:"feels_like"`
			TempMin   float64 `json:"temp_min"`
			TempMax   float64 `json:"temp_max"`
		} `json:"temperature"`
		Humidity  int `json:"humidity"`
		Pressure  struct {
			Value      int `json:"value"`
			SeaLevel   int `json:"sea_level"`
			GroundLevel int `json:"ground_level"`
		} `json:"pressure"`
		Visibility int `json:"visibility"`
		Clouds     int `json:"clouds"`
	} `json:"current"`

	Astronomical struct {
		Sunrise int64 `json:"sunrise"`
		Sunset  int64 `json:"sunset"`
	} `json:"astronomical"`
}