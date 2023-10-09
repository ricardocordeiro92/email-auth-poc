import { Roles, UserTypes } from '../enums';

export interface ICreateUserDTO {
  name: string;
  email: string;
  type: UserTypes;
  role: Roles;
}
