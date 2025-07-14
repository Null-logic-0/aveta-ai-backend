import { UserPlan } from '../../subscription/enums/userPlan.enum';
import { Role } from '../../auth/enums/role.enum';

export interface ActiveUserData {
  sub: number;
  email: string;

  role: Role;
  userPlan: UserPlan;
  tokenVersion: number;
  googleId?: string;
}
