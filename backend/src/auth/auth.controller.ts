import { Controller, Post, Get, UseGuards, Request, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req, @Res() res: Response) {
        const result = await this.authService.login(req.user, res);
        return res.status(201).json({ user: req.user });
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async getProfile(@Request() req) {
        return { user: req.user };
    }

    @Post('logout')
    async logout(@Res() res: Response) {
        res.cookie('Authentication', '', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 0,
        });
        return res.status(200).json({ message: 'Logged out' });
    }
}
