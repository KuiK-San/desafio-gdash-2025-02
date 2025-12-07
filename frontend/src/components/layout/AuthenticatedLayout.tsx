import type React from "react"
import { AppSidebar } from "./AppSidebar"
import { Header } from "./Header"
import { SidebarProvider } from "../ui/sidebar"

interface AuthenticatedLayoutProps {
    children: React.ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
    return (
        <div className="flex h-screen bg-background">
            <SidebarProvider defaultOpen={true}>
                
                <AppSidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-auto p-6">{children}</main>
                </div>
            </SidebarProvider>
        </div>
    )
}
