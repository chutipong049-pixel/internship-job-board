"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateJobDto = void 0;
const class_validator_1 = require("class-validator");
class CreateJobDto {
}
exports.CreateJobDto = CreateJobDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Job title is required / ชื่อตำแหน่งงานห้ามว่าง' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJobDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Company is required / กรุณาเลือกบริษัท' }),
    (0, class_validator_1.IsInt)({ message: 'Company ID must be an integer' }),
    __metadata("design:type", Number)
], CreateJobDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Category is required / กรุณาเลือกสายงาน' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJobDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Job type is required / กรุณาเลือกประเภทงาน' }),
    (0, class_validator_1.IsIn)(['INTERNSHIP', 'FULL_TIME', 'PART_TIME'], {
        message: 'Job type must be INTERNSHIP, FULL_TIME, or PART_TIME',
    }),
    __metadata("design:type", String)
], CreateJobDto.prototype, "jobType", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Workplace type is required / รูปแบบการทำงานห้ามว่าง' }),
    (0, class_validator_1.IsIn)(['ON_SITE', 'HYBRID', 'REMOTE'], {
        message: 'Workplace type must be ON_SITE, HYBRID, or REMOTE',
    }),
    __metadata("design:type", String)
], CreateJobDto.prototype, "workplaceType", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Job description is required / รายละเอียดงานห้ามว่าง' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJobDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Requirements are required / คุณสมบัติผู้สมัครห้ามว่าง' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJobDto.prototype, "requirements", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJobDto.prototype, "benefits", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Stipend min is required / กรุณาระบุเบี้ยเลี้ยงขั้นต่ำ' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Stipend min must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Stipend min cannot be negative / เบี้ยเลี้ยงขั้นต่ำต้องไม่ติดลบ' }),
    __metadata("design:type", Number)
], CreateJobDto.prototype, "stipendMin", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Stipend max is required / กรุณาระบุเบี้ยเลี้ยงสูงสุด' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Stipend max must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Stipend max cannot be negative / เบี้ยเลี้ยงสูงสุดต้องไม่ติดลบ' }),
    __metadata("design:type", Number)
], CreateJobDto.prototype, "stipendMax", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Location is required / สถานที่ปฏิบัติงานห้ามว่าง' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJobDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Application deadline is required / กำหนดวันรับสมัครห้ามว่าง' }),
    (0, class_validator_1.IsDateString)({}, { message: 'Deadline must be a valid date string (YYYY-MM-DD)' }),
    __metadata("design:type", String)
], CreateJobDto.prototype, "applicationDeadline", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['OPEN', 'CLOSED'], { message: 'Status must be OPEN or CLOSED' }),
    __metadata("design:type", String)
], CreateJobDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Contact email is required / อีเมลติดต่อห้ามว่าง' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Contact email must be a valid email format / อีเมลต้องอยู่ในรูปแบบที่ถูกต้อง' }),
    __metadata("design:type", String)
], CreateJobDto.prototype, "contactEmail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({}, { message: 'Apply URL must be a valid URL / URL ต้องอยู่ในรูปแบบที่ถูกต้อง' }),
    __metadata("design:type", String)
], CreateJobDto.prototype, "applyUrl", void 0);
//# sourceMappingURL=create-job.dto.js.map