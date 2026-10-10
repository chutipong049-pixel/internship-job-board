import {
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class UpdateJobDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Job title cannot be empty' })
  @IsString()
  title?: string;

  @IsOptional()
  @IsInt({ message: 'Company ID must be an integer' })
  companyId?: number;

  @IsOptional()
  @IsNotEmpty({ message: 'Category cannot be empty' })
  @IsString()
  category?: string;

  @IsOptional()
  @IsIn(['INTERNSHIP', 'FULL_TIME', 'PART_TIME'])
  jobType?: string;

  @IsOptional()
  @IsIn(['ON_SITE', 'HYBRID', 'REMOTE'])
  workplaceType?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  @IsString()
  benefits?: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Stipend min cannot be negative' })
  stipendMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Stipend max cannot be negative' })
  stipendMax?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsDateString()
  applicationDeadline?: string;

  @IsOptional()
  @IsIn(['OPEN', 'CLOSED'])
  status?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Contact email must be valid' })
  contactEmail?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Apply URL must be valid' })
  applyUrl?: string;
}
