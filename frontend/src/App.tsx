import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "./store/store"
import { Login } from "./components/auth/Login"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import { AuthenticatedLayout } from "./components/layout/AuthenticatedLayout"
import { UserList } from "./components/users/UserList"
import Dashboard from "./components/dashboard/Dashboard"


function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <AuthenticatedLayout>
                                    <Dashboard />
                                </AuthenticatedLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/users"
                        element={
                            <ProtectedRoute>
                                <AuthenticatedLayout>
                                    <UserList />
                                </AuthenticatedLayout>
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    )
}

export default App
