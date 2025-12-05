import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async create(dto: { name: string; email: string; password: string }) {
        const exists = await this.userModel.findOne({ email: dto.email });
        if (exists) throw new ConflictException('Email already registered');

        const user = await this.userModel.create({
            ...dto,
            password: dto.password,
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = user.toObject();
        return userWithoutPassword;
    }

    async findByEmail(email: string) {
        return this.userModel.findOne({ email });
    }

    validatePassword(raw: string, hashed: string) {
        return bcrypt.compare(raw, hashed);
    }
}
