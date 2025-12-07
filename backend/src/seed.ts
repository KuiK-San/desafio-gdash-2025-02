import { UsersService } from "./users/users.service";

export async function seedAdminUser(usersService: UsersService) {
    const exists = await usersService.findByEmail('admin@example.com');
    if (exists) return;

    await usersService.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'gdash2025',
    });

    return;
}
