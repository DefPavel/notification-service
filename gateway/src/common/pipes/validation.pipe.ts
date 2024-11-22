import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  ValidationPipe as BaseValidationPipe,
  ValidationError,
} from '@nestjs/common';

@Injectable()
export class CustomValidationPipe extends BaseValidationPipe implements PipeTransform {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const validationErrors = errors.map((error) => ({
          property: error.property,
          errors: Object.values(error.constraints || {}),
        }));

        return new BadRequestException({
          statusCode: 400,
          message: 'Validation failed',
          validationErrors,
        });
      },
    });
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    return super.transform(value, metadata);
  }
}
