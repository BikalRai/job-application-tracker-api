import { AppBaseEntity } from 'src/common/database/base.entity';
import { Column } from 'typeorm';

export class User extends AppBaseEntity {
  @Column({ type: 'text', unique: true, nullable: false })
  email!: string;

  @Column({ name: 'password_hash', type: 'text', nullable: false })
  passwordHash!: string;

  @Column({ name: 'full_name', type: 'text', nullable: false })
  fullName!: string;
}
