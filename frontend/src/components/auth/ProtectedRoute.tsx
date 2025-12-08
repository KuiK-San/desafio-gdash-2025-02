import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import { useGetMeQuery } from '@/store/api'

interface ProtectedRouteProps {
    children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth)
    
    const { isLoading, isError } = useGetMeQuery(undefined, {
        skip: !!user && isAuthenticated,
    })

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Carregando...</div>
            </div>
        )
    }

    if (isError || !isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}
