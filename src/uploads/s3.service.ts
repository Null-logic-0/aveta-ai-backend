import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  constructor(private readonly configService: ConfigService) {}

  private createS3() {
    return new AWS.S3({
      region: this.configService.get('appConfig.awsRegion')!,
      accessKeyId: this.configService.get('appConfig.awsAccessId'),
      secretAccessKey: this.configService.get('appConfig.awsSecretKey'),
    });
  }

  private async UploadFileToS3(
    folder: string,
    file: Express.Multer.File,
    userId: number,
  ): Promise<string> {
    const s3 = this.createS3();
    const region = this.configService.get('appConfig.awsRegion')!;
    const bucket = this.configService.get('appConfig.awsBucketName')!;
    const fileExt = file.originalname.split('.').pop() || 'bin';
    const fileName = `${uuidv4()}.${fileExt}`;
    const key = `${folder}/user-${userId}/${fileName}`;

    await s3
      .putObject({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
      .promise();

    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
  }

  async deleteObject(key: string): Promise<void> {
    const s3 = this.createS3();
    const bucket = this.configService.get('appConfig.awsBucketName')!;

    await s3
      .deleteObject({
        Bucket: bucket,
        Key: key,
      })
      .promise();
  }

  async uploadSingleImage(
    folder: string,
    file: Express.Multer.File,
    userId: number,
  ): Promise<string> {
    return await this.UploadFileToS3(folder, file, userId);
  }
}
