import { IsEmail, IsNotEmpty } from 'class-validator';

export class NotificationDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  message: string;
}
