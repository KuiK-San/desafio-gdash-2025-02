import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import {
    useGetUserByIdQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
} from '@/store/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'

interface UserFormProps {
    userId: string | null
    onClose: () => void
}

export function UserForm({ userId, onClose }: UserFormProps) {
    const isEditing = userId !== null

    const { data: selectedUser, isLoading: isLoadingUser } = useGetUserByIdQuery(
        userId!,
        { skip: !userId }
    )

    const [createUser, { isLoading: isCreating, error: createError }] =
        useCreateUserMutation()
    const [updateUser, { isLoading: isUpdating, error: updateError }] =
        useUpdateUserMutation()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    useEffect(() => {
        if (selectedUser && isEditing) {
            setEmail(selectedUser.email)
            setName(selectedUser.name || '')
            setPassword('')
        } else {
            setEmail('')
            setPassword('')
            setName('')
        }
    }, [selectedUser, isEditing])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        try {
            if (isEditing && userId) {
                const updateData: { email: string; password?: string; name?: string } = {
                    email,
                    name: name || undefined,
                }
                if (password) {
                    updateData.password = password
                }
                await updateUser({ id: userId, data: updateData }).unwrap()
            } else {
                const createData = {
                    email,
                    password,
                    name: name || undefined,
                }
                await createUser(createData).unwrap()
            }
            onClose()
        } catch (err) {
            console.error('Erro ao salvar usuário:', err)
        }
    }

    const isLoading = isLoadingUser || isCreating || isUpdating
    const error = createError || updateError

    const errorMessage = error && typeof error === 'object' && 'data' in error
        ? String((error.data as { message?: string })?.message || 'Erro ao salvar usuário')
        : null

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Altere as informações do usuário abaixo.'
                            : 'Preencha os dados para criar um novo usuário.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Nome completo"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">
                            {isEditing
                                ? 'Nova Senha (deixe em branco para manter)'
                                : 'Senha *'}
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required={!isEditing}
                        />
                    </div>
                    {errorMessage && (
                        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                            {errorMessage}
                        </div>
                    )}
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading
                                ? 'Salvando...'
                                : isEditing
                                    ? 'Atualizar'
                                    : 'Criar'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
