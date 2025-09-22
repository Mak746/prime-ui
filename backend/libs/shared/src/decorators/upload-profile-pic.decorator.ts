import { applyDecorators, BadRequestException, UseInterceptors } from '@nestjs/common';
import { LocalFilesInterceptor } from '../interceptors';

export const UploadProfilePic = (
  role: string,
  fieldName = 'file',
  required = false,
): MethodDecorator & ClassDecorator => {
  return applyDecorators(
    UseInterceptors(
      LocalFilesInterceptor({
        fieldName,
        path: `/profile-pictures/${role}`,
        fileFilter: (request, file, callback) => {
          if (required && !file) {
            return callback(new BadRequestException('Valid profile picture is required'), false);
          }
          if (!file.mimetype.includes('image')) {
            return callback(new BadRequestException('Provide a valid image'), false);
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
