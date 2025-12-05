import { IsEmail, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import * as bcrypt from 'bcrypt';

export class CreateUserDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(4)
    @Transform(async ({ value }) => {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(value, salt);
    })
    password: string;
}
