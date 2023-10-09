import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Roles, UserTypes } from './enums';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: UserTypes.USER })
  type: UserTypes;

  @Column({ default: Roles.MANAGER })
  role: Roles;
}
