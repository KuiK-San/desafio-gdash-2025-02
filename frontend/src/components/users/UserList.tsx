import { useState } from 'react'
import { useGetUsersQuery, useDeleteUserMutation } from '@/store/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { UserForm } from './UserForm'
import { Trash2, Edit, Plus } from 'lucide-react'

export function UserList() {
    const { data: users = [], isLoading, error } = useGetUsersQuery()
    const [deleteUser] = useDeleteUserMutation()
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<string | null>(null)

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja deletar este usuário?')) {
            try {
                await deleteUser(id).unwrap()
            } catch (err) {
                console.error('Erro ao deletar usuário:', err)
            }
        }
    }

    const handleEdit = (id: string) => {
        setEditingUser(id)
        setIsFormOpen(true)
    }

    const handleCreate = () => {
        setEditingUser(null)
        setIsFormOpen(true)
    }

    const handleFormClose = () => {
        setIsFormOpen(false)
        setEditingUser(null)
    }

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 px-4">
                <Card>
                    <CardContent className="py-8">
                        <div className="text-center">Carregando...</div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto py-8 px-4">
                <Card>
                    <CardContent className="py-8">
                        <div className="text-center text-destructive">
                            Erro ao carregar usuários
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Usuários</CardTitle>
                        <Button onClick={handleCreate}>
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Usuário
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Nome</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        Nenhum usuário encontrado
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell className="font-mono text-sm">
                                            {user._id}
                                        </TableCell>
                                        <TableCell>{user.name || '-'}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handleEdit(user._id)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => handleDelete(user._id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {isFormOpen && (
                <UserForm
                    userId={editingUser}
                    onClose={handleFormClose}
                />
            )}
        </div>
    )
}