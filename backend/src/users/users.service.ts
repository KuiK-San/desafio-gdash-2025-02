import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async create(dto: { name: string; email: string; password: string }) {
        const exists = await this.userModel.findOne({ email: dto.email });
        if (exists) throw new ConflictException('Email already registered');

        const user = await this.userModel.create({
            ...dto,
            password: dto.password,
        });

        const { password: _, ...userWithoutPassword } = user.toObject();
        return userWithoutPassword;
    }

    async findAll() {
        const users = await this.userModel.find().select('-password').exec();
        return users;
    }

    async findById(id: string) {
        const user = await this.userModel.findById(id).select('-password').exec();
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async findByEmail(email: string) {
        return this.userModel.findOne({ email });
    }

    async update(id: string, dto: { name?: string; email?: string; password?: string }) {
        const user = await this.userModel.findById(id);
        if (!user) throw new NotFoundException('User not found');

        if (dto.email && dto.email !== user.email) {
            const emailExists = await this.userModel.findOne({ email: dto.email });
            if (emailExists) throw new ConflictException('Email already registered');
        }

        if (dto.name) user.name = dto.name;
        if (dto.email) user.email = dto.email;
        if (dto.password) user.password = dto.password;

        await user.save();

        const { password: _, ...userWithoutPassword } = user.toObject();
        return userWithoutPassword;
    }

    async delete(id: string) {
        const result = await this.userModel.findByIdAndDelete(id);
        if (!result) throw new NotFoundException('User not found');
        return { deleted: true };
    }

    validatePassword(raw: string, hashed: string) {
        return bcrypt.compare(raw, hashed);
    }
}
