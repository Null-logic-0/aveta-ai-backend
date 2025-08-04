import { UserPlan } from '../enums/userPlan.enum';

export const MESSAGE_LIMITS: Record<UserPlan, number> = {
  [UserPlan.Free]: 30,
  [UserPlan.BASIC]: 100,
  [UserPlan.PREMIUM]: 200,
};
