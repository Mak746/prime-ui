import { applyDecorators, BadRequestException, UseInterceptors } from '@nestjs/common';
import { LocalFilesInterceptor } from '../interceptors';

export const UploadDocumentFile = (
  documentType: string,
  fieldName = 'file',
  required = false,
  format: 'pdf' = 'pdf',
): MethodDecorator & ClassDecorator => {
  return applyDecorators(
    UseInterceptors(
      LocalFilesInterceptor({
        fieldName,
        path: `/uploaded-files/${documentType}`,
        fileFilter: (request, file, callback) => {
          if (required && !file) {
            return callback(new BadRequestException('Valid file is required'), false);
          }
          if (!file.mimetype.includes(format)) {
            return callback(new BadRequestException(`Provide a valid ${format} document`), false);
          }
          callback(null, true);
        },
        limits: {
          fileSize: Math.pow(10240, 2), // 10MB
        },
      }),
    ),
  );
};
