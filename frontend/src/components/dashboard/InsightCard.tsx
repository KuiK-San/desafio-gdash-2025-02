import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetInsightIAQuery } from "@/store/api";
import { Bot } from "lucide-react";

export default function InsightCard() {
    const { data: content, isLoading } = useGetInsightIAQuery();

    return (
        <Card className="flex flex-col gap-4 p-6 w-[30%]">
            <div className="flex items-center gap-2">
                {isLoading ? (
                    <>
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-6 w-6 rounded-full" />
                    </>
                ) : (
                    <>
                        <h1 className="text-xl font-semibold text-foreground">Insight de IA</h1>
                        <Bot />
                    </>
                )}
            </div>

            <div className="flex justify-center items-start">
                {isLoading ? (
                    <div className="flex flex-col gap-2 w-full">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-[90%]" />
                        <Skeleton className="h-4 w-[85%]" />
                        <Skeleton className="h-4 w-[70%]" />
                    </div>
                ) : (
                    <p className="leading-relaxed text-foreground text-justify">
                        {content}
                    </p>
                )}
            </div>
        </Card>
    );
}
