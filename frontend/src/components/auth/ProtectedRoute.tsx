import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useGetMeQuery } from '@/store/api'
import { setUser } from '@/store/authSlice'

interface ProtectedRouteProps {
    children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const dispatch = useAppDispatch()
    const { isAuthenticated, user } = useAppSelector((state) => state.auth)
    const { data, isLoading, isError } = useGetMeQuery(undefined, {
        skip: !!user,
    })

    useEffect(() => {
        if (data) {
            dispatch(setUser(data))
        }
    }, [data, dispatch])

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
