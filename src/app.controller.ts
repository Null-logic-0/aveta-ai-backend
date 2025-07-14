import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';
import { Auth } from './auth/decorators/auth.decorator';
import { AuthType } from './auth/enums/auth-type.enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Auth(AuthType.None)
  @ApiOperation({
    summary: 'Test route - fetches "hello world!"',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
