import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
    imports: [
        MulterModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                storage: diskStorage({
                    destination:
                        configService.getOrThrow<string>('UPLOAD_PATH'),
                    filename: (req, file, callback) => {
                        const randomName = randomUUID();
                        const extension = extname(file.originalname);
                        callback(null, `${randomName}${extension}`);
                    },
                }),
            }),
            inject: [ConfigService],
        }),
    ],
    exports: [MulterModule],
})
export class FileUploadModule {}
