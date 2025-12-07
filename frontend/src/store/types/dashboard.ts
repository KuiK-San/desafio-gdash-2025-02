
export interface WeatherCondition {
    main: string
    description: string
    icon: string
}

export interface Temperature {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
}

export interface Pressure {
    value: number
    sea_level: number
    ground_level: number
}

export interface Coordinates {
    lat: number
    lon: number
}

export interface Location {
    name: string
    country: string
    coordinates: Coordinates
    timezone: number
}

export interface CurrentWeather {
    weather: WeatherCondition
    temperature: Temperature
    humidity: number
    pressure: Pressure
    visibility: number
    clouds: number
}

export interface Astronomical {
    sunrise: number
    sunset: number
}

export interface CurrentTemperature {
    _id: string
    location: Location
    current: CurrentWeather
    astronomical: Astronomical
    createdAt: string
    updatedAt: string
    __v: number
}

export interface DailyTemperature {
    tempMin: number
    tempMax: number
    feelsLike: number
    weather: WeatherCondition
    humidity: number
    sunrise: number
    sunset: number
    date: string
}

export interface LocationHistory {
    _id: string
    count: number
    country: string
    lastUpdate: string
}

export interface TemperatureHistoryItem {
    _id: string
    location: Location
    current: CurrentWeather
    astronomical: Astronomical
    createdAt: string
    updatedAt: string
    __v: number
}