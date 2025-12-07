import type React from "react"

import { useDispatch, useSelector } from "react-redux"
import { setStartDate, setEndDate } from "@/store/filterSlice"
import type { RootState } from "@/store/store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, X } from "lucide-react"

export default function DateFilter() {
    const dispatch = useDispatch()
    const { startDate, endDate } = useSelector((state: RootState) => state.filters)

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setStartDate(e.target.value || null))
    }

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setEndDate(e.target.value || null))
    }

    const handleClearFilters = () => {
        dispatch(setStartDate(null))
        dispatch(setEndDate(null))
    }

    const hasActiveFilters = startDate || endDate

    return (
        <Card className="w-full border border-border shadow-sm bg-card">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-foreground">Filtros de Data</CardTitle>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="startDate" className="text-sm font-medium text-foreground flex items-center gap-2">
                            Data Inicial
                        </Label>
                        <Input
                            id="startDate"
                            type="date"
                            value={startDate || ""}
                            onChange={handleStartDateChange}
                            className="w-full px-3 py-2 bg-background border border-input rounded-md transition-all duration-200 focus:border-ring focus:ring-1 focus:ring-ring"
                        />
                        {startDate && (
                            <p className="text-xs text-muted-foreground">
                                Selecionado: {new Date(startDate).toLocaleDateString("pt-BR")}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="endDate" className="text-sm font-medium text-foreground flex items-center gap-2">
                            Data Final
                        </Label>
                        <Input
                            id="endDate"
                            type="date"
                            value={endDate || ""}
                            onChange={handleEndDateChange}
                            min={startDate || undefined}
                            className="w-full px-3 py-2 bg-background border border-input rounded-md transition-all duration-200 focus:border-ring focus:ring-1 focus:ring-ring"
                        />
                        {endDate && (
                            <p className="text-xs text-muted-foreground">
                                Selecionado: {new Date(endDate).toLocaleDateString("pt-BR")}
                            </p>
                        )}
                    </div>
                </div>

                {hasActiveFilters && (
                    <div className="pt-2 border-t border-border">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Filtros aplicados</span>
                            <Button onClick={handleClearFilters} variant="ghost" className="h-8 px-2 text-sm font-medium gap-1.5">
                                <X className="h-4 w-4" />
                                Limpar
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}