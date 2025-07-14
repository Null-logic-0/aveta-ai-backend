import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ActiveUserData } from '../interface/active-user.interface';

export const GetActiveUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ActiveUserData => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as ActiveUserData;
  },
);
