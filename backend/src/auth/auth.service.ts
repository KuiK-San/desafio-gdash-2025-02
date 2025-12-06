import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return null;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = user.toObject ? user.toObject() : user;
        return userWithoutPassword;
    }

    async login(user: { _id: string; email: string; name?: string }, response: Response) {
        const payload = { sub: user._id, email: user.email, name: user.name };
        const token = this.jwtService.sign(payload);

        response.cookie('Authentication', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        return {
            access_token: token,
        };
    }
}

