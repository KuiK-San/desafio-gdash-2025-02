import { useMemo } from "react"
import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetTemperatureHistoryQuery } from "@/store/api"
import type { RootState } from "@/store/store"
import { Thermometer } from "lucide-react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts"
import formatDate from "@/utils/formatDate"

interface ChartData {
    date: string
    dateLabel: string
    tempMin: number
    tempMax: number
    feelsLike: number
    tempAvg: number
}

interface TemperatureHistoryItem {
    date: string
    tempMin: number
    tempMax: number
    feelsLike: number
    humidity: number
    weather: {
        main: string
        description: string
        icon: string
    }
    sunrise: number
    sunset: number
}

function TemperatureHistorySkeleton() {
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
            <CardContent>
                <div className="h-80 bg-muted rounded-lg animate-pulse" />
            </CardContent>
        </Card>
    )
}

const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !Array.isArray(payload) || payload.length === 0) {
        return null
    }

    const data = payload[0]?.payload
    if (!data) return null

    return (
        <Card className="p-3 border border-border/50 shadow-lg bg-card/95 backdrop-blur-sm">
            <p className="text-xs font-semibold text-foreground mb-2">
                {formatDate(data.date)}
            </p>
            <div className="space-y-1">
                {payload.map((entry: any, index: number) => {
                    if (!entry || typeof entry.value !== 'number') return null
                    return (
                        <div key={`tooltip-${index}`} className="flex items-center gap-2">
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-xs text-muted-foreground">{entry.name}:</span>
                            <span className="text-xs font-semibold text-foreground">
                                {entry.value.toFixed(1)}°C
                            </span>
                        </div>
                    )
                })}
            </div>
        </Card>
    )
}

export default function TemperatureHistoryChart() {
    const { startDate, endDate } = useSelector((state: RootState) => state.filters)
    
    const { data, isLoading, error } = useGetTemperatureHistoryQuery(
        startDate || endDate
            ? {
                  startDate: startDate || undefined,
                  endDate: endDate || undefined,
              }
            : undefined
    )

    const chartData: ChartData[] = useMemo(() => {
        if (!data || !Array.isArray(data)) return []

        return data
            .map((item: TemperatureHistoryItem) => {
                try {
                    const dateStr = item.date
                    if (!dateStr) return null

                    const date = new Date(dateStr)
                    
                    // Validar se a data é válida
                    if (isNaN(date.getTime())) {
                        console.warn('Data inválida:', dateStr)
                        return null
                    }

                    const { tempMin, tempMax, feelsLike } = item

                    // Validar se os valores são números
                    if (
                        typeof tempMin !== 'number' ||
                        typeof tempMax !== 'number' ||
                        typeof feelsLike !== 'number'
                    ) {
                        console.warn('Valores de temperatura inválidos:', item)
                        return null
                    }

                    // Calcular temperatura média
                    const tempAvg = (tempMin + tempMax) / 2

                    return {
                        date: dateStr,
                        dateLabel: date.toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                        }),
                        tempMin,
                        tempMax,
                        feelsLike,
                        tempAvg,
                    }
                } catch (err) {
                    console.error('Erro ao processar item:', err, item)
                    return null
                }
            })
            .filter((item): item is ChartData => item !== null)
    }, [data])

    if (isLoading || !data) {
        return <TemperatureHistorySkeleton />
    }

    if (error) {
        return (
            <Card className="">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                        <Thermometer className="h-6 w-6 text-blue-500" />
                        Histórico de Temperatura
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-destructive">
                        <p>Erro ao carregar dados históricos</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (chartData.length === 0) {
        return (
            <Card className="">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <Thermometer className="h-6 w-6 text-blue-500" />
                                Histórico de Temperatura
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Gráfico de temperatura ao longo do tempo
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <p>Nenhum dado histórico disponível</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-2xl flex items-center">
                            <Thermometer className="h-6 w-6 text-blue-500" />
                            Histórico de Temperatura
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {chartData.length} {chartData.length === 1 ? 'registro' : 'registros'} de temperatura
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid 
                            strokeDasharray="3 3" 
                            stroke="hsl(var(--border))" 
                            opacity={0.3} 
                            vertical={false} 
                        />
                        <XAxis
                            dataKey="dateLabel"
                            stroke="hsl(var(--muted-foreground))"
                            style={{ fontSize: "12px" }}
                            axisLine={false}
                            tickLine={false}
                            angle={-45}
                            textAnchor="end"
                            height={70}
                        />
                        <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            style={{ fontSize: "12px" }}
                            axisLine={false}
                            tickLine={false}
                            label={{
                                value: "°C",
                                angle: -90,
                                position: "insideLeft",
                                offset: 10,
                            }}
                        />
                        <Tooltip 
                            content={<CustomTooltip />} 
                            cursor={{ stroke: "hsl(var(--muted))", strokeWidth: 1 }} 
                        />
                        <Legend 
                            wrapperStyle={{ paddingTop: "16px", fontSize: "12px" }} 
                        />
                        <Line
                            type="monotone"
                            dataKey="tempAvg"
                            stroke="#3b82f6"
                            name="Temperatura Média"
                            strokeWidth={2.5}
                            dot={{ fill: "#3b82f6", r: 3, strokeWidth: 0 }}
                            activeDot={{ r: 6, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                            isAnimationActive={true}
                        />
                        <Line   
                            type="monotone"
                            dataKey="tempMin"
                            stroke="#60a5fa"
                            name="Mínima"
                            strokeWidth={2}
                            dot={{ fill: "#60a5fa", r: 3, strokeWidth: 0 }}
                            activeDot={{ r: 6, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                            isAnimationActive={true}
                        />
                        <Line
                            type="monotone"
                            dataKey="tempMax"
                            stroke="#ef4444"
                            name="Máxima"
                            strokeWidth={2}
                            dot={{ fill: "#ef4444", r: 3, strokeWidth: 0 }}
                            activeDot={{ r: 6, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                            isAnimationActive={true}
                        />
                        <Line
                            type="monotone"
                            dataKey="feelsLike"
                            stroke="#f59e0b"
                            name="Sensação Térmica"
                            strokeWidth={2}
                            dot={{ fill: "#f59e0b", r: 3, strokeWidth: 0 }}
                            activeDot={{ r: 6, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                            isAnimationActive={true}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}