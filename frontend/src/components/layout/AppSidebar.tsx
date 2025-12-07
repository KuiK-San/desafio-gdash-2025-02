import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import { Users, LogOut, Home } from "lucide-react"
import { useLogoutMutation } from "@/store/api"
import { clearAuth } from '@/store/authSlice'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"

export function AppSidebar() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const pathAtual = location.pathname
    const [logout] = useLogoutMutation()

    const handleLogout = async () => {
        try {
            await logout().unwrap()
            dispatch(clearAuth())
            navigate('/login')
        } catch (err) {
            console.error('Erro ao fazer logout:', err)
            dispatch(clearAuth())
            navigate('/login')
        }
    }

    const menuItems = [
        {
            label: "Dashboard",
            icon: Home,
            path: "/dashboard",
        },
        {
            label: "Usuários",
            icon: Users,
            path: "/users",
        },
    ]

    return (
        <Sidebar>
            <SidebarHeader className="p-4 bg-primary text-white text-lg font-semibold flex flex-row items-center">
                <img src="https://gdash.io/wp-content/uploads/2025/02/logo.gdash_.white_.png" className="max-w-full h-auto max-h-10"/>
                <span>Dashboard</span>

            </SidebarHeader>
            <SidebarContent className="py-4">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton asChild>
                                        <Button
                                            key={item.path}
                                            variant="ghost"
                                            className={`w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground ${pathAtual == item.path && 'bg-accent'}`}
                                            onClick={() => navigate(item.path)}
                                        >
                                            <item.icon className="w-4 h-4 flex-shrink-0" />
                                            <span className="ml-3">{item.label}</span>
                                        </Button>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <Button
                    variant="outline"
                    className="w-full justify-start text-destructive bg-transparent"
                    onClick={handleLogout}
                >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                </Button>
            </SidebarFooter>
        </Sidebar>
    )
}
