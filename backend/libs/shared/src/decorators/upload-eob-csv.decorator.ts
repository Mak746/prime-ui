import { applyDecorators, BadRequestException, UseInterceptors } from '@nestjs/common';
import { LocalFilesInterceptor } from '../interceptors';

export const UploadEoBCSV = (fieldName = 'file', required = false): MethodDecorator & ClassDecorator => {
  return applyDecorators(
    UseInterceptors(
      LocalFilesInterceptor({
        fieldName,
        path: `/eob-upload-csv`,
        fileFilter: (request, file, callback) => {
          if (required && !file) {
            return callback(new BadRequestException('Valid transaction csv file is required'), false);
          }
          if (!file.mimetype.includes('csv')) {
            return callback(new BadRequestException('Provide a valid csv file'), false);
          }
          callback(null, true);
        },
        limits: {
          fileSize: Math.pow(1024, 2), // 1MB
        },
      }),
    ),
  );
};
