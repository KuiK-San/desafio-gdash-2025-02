export default function formatDay(dateString: string) {
        const date = new Date(dateString)
        return date.toLocaleDateString("pt-BR", {
            weekday: "long",
        })
    }