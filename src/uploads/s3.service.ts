import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('appConfig.awsRegion')!,
      credentials: {
        accessKeyId: this.configService.get('appConfig.awsAccessId')!,
        secretAccessKey: this.configService.get('appConfig.awsSecretKey')!,
      },
    });
  }

  private async uploadFileToS3(
    folder: string,
    file: Express.Multer.File,
    userId: number,
  ): Promise<string> {
    const bucket = this.configService.get('appConfig.awsBucketName')!;
    const fileExt = file.originalname.split('.').pop() || 'bin';
    const fileName = `${uuidv4()}.${fileExt}`;
    const key = `${folder}/user-${userId}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);

    return `https://${bucket}.s3.${this.configService.get('appConfig.awsRegion')}.amazonaws.com/${key}`;
  }

  async deleteObject(key: string): Promise<void> {
    const bucket = this.configService.get('appConfig.awsBucketName')!;

    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    await this.s3Client.send(command);
  }

  async uploadSingleImage(
    folder: string,
    file: Express.Multer.File,
    userId: number,
  ): Promise<string> {
    return this.uploadFileToS3(folder, file, userId);
  }
}
