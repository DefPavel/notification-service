import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class NotificationDto {
  @IsEmail()
  @IsNotEmpty()
  @MinLength(3)
  email: string;

  @IsNotEmpty()
  @MinLength(3)
  message: string;
}
