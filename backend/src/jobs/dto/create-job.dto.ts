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

export class CreateJobDto {
  @IsNotEmpty({ message: 'Job title is required / ชื่อตำแหน่งงานห้ามว่าง' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'Company is required / กรุณาเลือกบริษัท' })
  @IsInt({ message: 'Company ID must be an integer' })
  companyId: number;

  @IsNotEmpty({ message: 'Category is required / กรุณาเลือกสายงาน' })
  @IsString()
  category: string;

  @IsNotEmpty({ message: 'Job type is required / กรุณาเลือกประเภทงาน' })
  @IsIn(['INTERNSHIP', 'FULL_TIME', 'PART_TIME'], {
    message: 'Job type must be INTERNSHIP, FULL_TIME, or PART_TIME',
  })
  jobType: string;

  @IsNotEmpty({ message: 'Workplace type is required / รูปแบบการทำงานห้ามว่าง' })
  @IsIn(['ON_SITE', 'HYBRID', 'REMOTE'], {
    message: 'Workplace type must be ON_SITE, HYBRID, or REMOTE',
  })
  workplaceType: string;

  @IsNotEmpty({ message: 'Job description is required / รายละเอียดงานห้ามว่าง' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'Requirements are required / คุณสมบัติผู้สมัครห้ามว่าง' })
  @IsString()
  requirements: string;

  @IsOptional()
  @IsString()
  benefits?: string;

  @IsNotEmpty({ message: 'Stipend min is required / กรุณาระบุเบี้ยเลี้ยงขั้นต่ำ' })
  @IsNumber({}, { message: 'Stipend min must be a number' })
  @Min(0, { message: 'Stipend min cannot be negative / เบี้ยเลี้ยงขั้นต่ำต้องไม่ติดลบ' })
  stipendMin: number;

  @IsNotEmpty({ message: 'Stipend max is required / กรุณาระบุเบี้ยเลี้ยงสูงสุด' })
  @IsNumber({}, { message: 'Stipend max must be a number' })
  @Min(0, { message: 'Stipend max cannot be negative / เบี้ยเลี้ยงสูงสุดต้องไม่ติดลบ' })
  stipendMax: number;

  @IsNotEmpty({ message: 'Location is required / สถานที่ปฏิบัติงานห้ามว่าง' })
  @IsString()
  location: string;

  @IsNotEmpty({ message: 'Application deadline is required / กำหนดวันรับสมัครห้ามว่าง' })
  @IsDateString({}, { message: 'Deadline must be a valid date string (YYYY-MM-DD)' })
  applicationDeadline: string;

  @IsOptional()
  @IsIn(['OPEN', 'CLOSED'], { message: 'Status must be OPEN or CLOSED' })
  status?: string;

  @IsNotEmpty({ message: 'Contact email is required / อีเมลติดต่อห้ามว่าง' })
  @IsEmail({}, { message: 'Contact email must be a valid email format / อีเมลต้องอยู่ในรูปแบบที่ถูกต้อง' })
  contactEmail: string;

  @IsOptional()
  @IsUrl({}, { message: 'Apply URL must be a valid URL / URL ต้องอยู่ในรูปแบบที่ถูกต้อง' })
  applyUrl?: string;
}
