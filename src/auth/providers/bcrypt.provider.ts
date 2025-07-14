import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider implements HashingProvider {
  public async hashPassword(data: string | Buffer): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hash = (await bcrypt.hash(data, salt)) as string;
    return hash;
  }
  async comparePassword(
    data: string | Buffer,
    encrypted: string,
  ): Promise<boolean> {
    const compare: boolean = await bcrypt.compare(data, encrypted);
    return compare;
  }
}
