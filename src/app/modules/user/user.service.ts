import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async createUser(createUserDto: CreateUserDto, isAdminRequest: boolean = false) {
    const { email, password, role } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Only allow "admin" role assignment if the request is from an existing admin
    const finalRole = isAdminRequest && role === 'admin' ? 'admin' : 'user';

    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: finalRole,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}