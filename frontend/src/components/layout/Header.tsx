import { SidebarTrigger } from "../ui/sidebar";

export function Header() {

    return (
        <header className="border-b bg-white">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <SidebarTrigger />
                    <h1 className="text-xl font-bold">Teste GDASH</h1>
                </div>
            </div>
        </header>
    )
}