import CurrentTemperature from "./CurrentTemperature";
import TemperatureHistoryChart from "./TemperatureHistoryChart";
import DateFilter from "./DateFilter";
import InsightCard from "./InsightCard";

export default function Dashboard() {

    return (
        <div className="container mx-auto space-y-6">
            <DateFilter />
            <div className="flex gap-2">
                <CurrentTemperature />
                <InsightCard
                    content="Teste"
                />
            </div>
            <TemperatureHistoryChart />
        </div>
    )
}