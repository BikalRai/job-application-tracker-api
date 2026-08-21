import { User } from '../entities/user.entity';

export class UserResponseDto {
  id!: string;
  email!: string;
  fullName!: string;
  createdAt!: Date;
  updatedAt!: Date;

  static toDto(user: User): UserResponseDto {
    const dto = new UserResponseDto();

    dto.id = user.id;
    dto.email = user.email;
    dto.fullName = user.fullName;
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;

    return dto;
  }
}
