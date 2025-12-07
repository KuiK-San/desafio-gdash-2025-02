import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Gauge, Snowflake, Sunset, Sunrise } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetCurrentTemperatureQuery } from "@/store/api"
import formatTime from "@/utils/formatTime";
import formatDate from "@/utils/formatDate";

function CurrentTemperatureSkeleton() {
    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="w-full">
                        <div className="h-8 bg-muted rounded-md w-1/3 animate-pulse" />
                        <div className="h-4 bg-muted rounded-md w-1/4 mt-2 animate-pulse" />
                    </div>
                    <div className="h-12 w-12 bg-muted rounded-full animate-pulse flex-shrink-0" />
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="h-4 bg-muted rounded-md w-1/4 animate-pulse" />
                    <div className="h-12 bg-muted rounded-md w-1/3 animate-pulse" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-muted p-3 animate-pulse h-16" />
                    <div className="rounded-lg bg-muted p-3 animate-pulse h-16" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-12 bg-muted rounded-md animate-pulse" />
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div className="h-8 bg-muted rounded-md animate-pulse" />
                    <div className="h-8 bg-muted rounded-md animate-pulse" />
                </div>
            </CardContent>
        </Card>
    )
}

export default function CurrentTemperature() {

    const { data, isLoading } = useGetCurrentTemperatureQuery(undefined, {
        pollingInterval: 5000
    });

    if (isLoading || !data) {
        return <CurrentTemperatureSkeleton />;
    }

    const { location, current, astronomical, createdAt } = data;

    const getWeatherIcon = (main: string) => {
        switch (main.toLowerCase()) {
            case "clouds":
                return <Cloud className="h-12 w-12 text-blue-400" />
            case "rain":
                return <CloudRain className="h-12 w-12 text-blue-600" />
            case "clear":
                return <Sun className="h-12 w-12 text-yellow-400" />
            default:
                return <Cloud className="h-12 w-12 text-gray-400" />
        }
    }



    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-2xl">
                            {location.name}, {location.country}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Lat: {location.coordinates.lat.toFixed(4)}, Lon: {location.coordinates.lon.toFixed(4)}
                        </p>
                        {createdAt && (
                            <p className="text-xs text-muted-foreground mt-1">Atualizado: {formatDate(createdAt)}</p>
                        )}
                    </div>
                    {getWeatherIcon(current.weather.main)}
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                        {current.weather.main} - {current.weather.description}
                    </h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold">{current.temperature.temp.toFixed(1)}°C</span>
                        <span className="text-lg text-muted-foreground">
                            Sensação: {current.temperature.feels_like.toFixed(1)}°C
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-muted p-3 flex items-center gap-3">
                        <Snowflake className="text-blue-500"/>
                        <div className="">
                            <p className="text-xs text-muted-foreground mb-1">Mínima</p>
                            <p className="text-xl font-semibold">{current.temperature.temp_min.toFixed(1)}°C</p>
                        </div>
                    </div>
                    <div className="rounded-lg bg-muted p-3 flex items-center gap-3">
                        <Sun className="text-orange-500"/>
                        <div className="">
                            <p className="text-xs text-muted-foreground mb-1">Máxima</p>
                            <p className="text-xl font-semibold">{current.temperature.temp_max.toFixed(1)}°C</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                        <Droplets className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs text-muted-foreground">Umidade</p>
                            <p className="text-lg font-semibold">{current.humidity}%</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Wind className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs text-muted-foreground">Nuvens</p>
                            <p className="text-lg font-semibold">{current.clouds}%</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Eye className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs text-muted-foreground">Visibilidade</p>
                            <p className="text-lg font-semibold">{(current.visibility / 1000).toFixed(1)} km</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Gauge className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs text-muted-foreground">Pressão</p>
                            <p className="text-lg font-semibold">{current.pressure.value} hPa</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div className="text-center flex items-center justify-center gap-2">
                        <Sunrise />
                        <div className="">
                            <p className="text-xs text-muted-foreground mb-1">Nascer do Sol</p>
                            <p className="text-sm font-medium">{formatTime(astronomical.sunrise)}</p>
                        </div>
                    </div>
                    <div className="text-center flex items-center justify-center gap-2">
                        <Sunset />
                        <div className="">
                            <p className="text-xs text-muted-foreground mb-1">Pôr do Sol</p>
                            <p className="text-sm font-medium">{formatTime(astronomical.sunset)}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
