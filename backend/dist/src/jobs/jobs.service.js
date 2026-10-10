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
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let JobsService = class JobsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filter) {
        const { search, category, jobType, workplaceType, status, companyId, region } = filter;
        const where = {};
        if (search && search.trim() !== '') {
            const keyword = search.trim();
            where.OR = [
                { title: { contains: keyword, mode: 'insensitive' } },
                { description: { contains: keyword, mode: 'insensitive' } },
                { location: { contains: keyword, mode: 'insensitive' } },
                { company: { name: { contains: keyword, mode: 'insensitive' } } },
            ];
        }
        if (category && category !== 'ALL') {
            where.category = category;
        }
        if (jobType && jobType !== 'ALL') {
            where.jobType = jobType;
        }
        if (workplaceType && workplaceType !== 'ALL') {
            where.workplaceType = workplaceType;
        }
        if (status && status !== 'ALL') {
            where.status = status;
        }
        if (companyId) {
            where.companyId = parseInt(companyId, 10);
        }
        if (region && region !== 'ALL') {
            where.region = region;
        }
        return this.prisma.job.findMany({
            where,
            include: {
                company: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findOne(id) {
        const job = await this.prisma.job.findUnique({
            where: { id },
            include: {
                company: true,
            },
        });
        if (!job) {
            throw new common_1.NotFoundException(`Job with ID ${id} not found / ไม่พบตำแหน่งงานที่ระบุ`);
        }
        return job;
    }
    async create(createJobDto) {
        const company = await this.prisma.company.findUnique({
            where: { id: createJobDto.companyId },
        });
        if (!company) {
            throw new common_1.BadRequestException(`Company with ID ${createJobDto.companyId} does not exist`);
        }
        if (createJobDto.stipendMax < createJobDto.stipendMin) {
            throw new common_1.BadRequestException('Business Rule Violation: เบี้ยเลี้ยงสูงสุด (stipendMax) ต้องมากกว่าหรือเท่ากับเบี้ยเลี้ยงขั้นต่ำ (stipendMin)');
        }
        const deadline = new Date(createJobDto.applicationDeadline);
        const now = new Date();
        let initialStatus = createJobDto.status || 'OPEN';
        if (deadline < now && initialStatus === 'OPEN') {
            throw new common_1.BadRequestException('Business Rule Violation: วันปิดรับสมัครงาน (Deadline) ต้องเป็นวันในอนาคตสำหรับงานที่เปิดรับ (OPEN)');
        }
        return this.prisma.job.create({
            data: {
                title: createJobDto.title,
                companyId: createJobDto.companyId,
                category: createJobDto.category,
                jobType: createJobDto.jobType,
                workplaceType: createJobDto.workplaceType,
                description: createJobDto.description,
                requirements: createJobDto.requirements,
                benefits: createJobDto.benefits || '',
                stipendMin: createJobDto.stipendMin,
                stipendMax: createJobDto.stipendMax,
                location: createJobDto.location,
                applicationDeadline: deadline,
                status: initialStatus,
                contactEmail: createJobDto.contactEmail,
                applyUrl: createJobDto.applyUrl || '',
            },
            include: {
                company: true,
            },
        });
    }
    async update(id, updateJobDto) {
        const existingJob = await this.findOne(id);
        const minStipend = updateJobDto.stipendMin !== undefined ? updateJobDto.stipendMin : existingJob.stipendMin;
        const maxStipend = updateJobDto.stipendMax !== undefined ? updateJobDto.stipendMax : existingJob.stipendMax;
        if (maxStipend < minStipend) {
            throw new common_1.BadRequestException('Business Rule Violation: เบี้ยเลี้ยงสูงสุด (stipendMax) ต้องมากกว่าหรือเท่ากับเบี้ยเลี้ยงขั้นต่ำ (stipendMin)');
        }
        const data = { ...updateJobDto };
        if (updateJobDto.applicationDeadline) {
            data.applicationDeadline = new Date(updateJobDto.applicationDeadline);
        }
        return this.prisma.job.update({
            where: { id },
            data,
            include: {
                company: true,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.job.delete({
            where: { id },
        });
    }
    async getStats() {
        const totalJobs = await this.prisma.job.count();
        const openJobs = await this.prisma.job.count({ where: { status: 'OPEN' } });
        const totalCompanies = await this.prisma.company.count();
        const internshipCount = await this.prisma.job.count({ where: { jobType: 'INTERNSHIP' } });
        return {
            totalJobs,
            openJobs,
            totalCompanies,
            internshipCount,
        };
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JobsService);
//# sourceMappingURL=jobs.service.js.map