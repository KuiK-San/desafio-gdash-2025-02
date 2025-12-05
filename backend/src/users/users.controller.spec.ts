import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersController', () => {
    let controller: UsersController;
    let service: UsersService;

    const mockUsersService = {
        create: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
        service = module.get<UsersService>(UsersService);

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('user password is hashed', async () => {
        const plainPassword = '123456';

        const dto = new CreateUserDto();
        dto.email = 'test@email.com';
        dto.name = 'Test User';
        dto.password = plainPassword;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(plainPassword, salt);
        dto.password = hashedPassword;

        const expectedUser = {
            _id: '123',
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
        };

        mockUsersService.create.mockResolvedValue(expectedUser);

        const result = await controller.create(dto);

        expect(service.create).toHaveBeenCalledWith({
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
        });

        expect(result).toEqual(expectedUser);
    });
});
