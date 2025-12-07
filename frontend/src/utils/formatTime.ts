export default function formatTime(timestamp: number) {
    return new Date(timestamp * 1000).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    })
}