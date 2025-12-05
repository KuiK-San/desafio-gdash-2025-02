import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {

    }

    async create(dto: { name: string; email: string; password: string }) {
        const exists = await this.userModel.findOne({ email: dto.email })
        if (exists) throw new ConflictException('email already registred')

        const user = this.userModel.create({
            ...dto
        })

        return user
    }

    async findByEmail(email: string) {
        return this.userModel.findOne({ email })
    }
    
    async validatePassword(raw: string, hashed: string) {
        return bcrypt.compare(raw, hashed);
    }
}
