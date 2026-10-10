import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty({ message: 'Company name is required' })
  @IsString()
  name: string;

  @IsOptional()
  @IsUrl({}, { message: 'Logo must be a valid URL' })
  logo?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Website must be a valid URL' })
  website?: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Must be a valid email format' })
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNotEmpty({ message: 'Location is required' })
  @IsString()
  location: string;

  @IsNotEmpty({ message: 'Industry is required' })
  @IsString()
  industry: string;

  @IsOptional()
  @IsString()
  description?: string;
}
