import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { FilterJobDto } from './dto/filter-job.dto';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Search & Filter Jobs
   * Requirements:
   * - Search by keyword (title, description, or company name)
   * - Filter by category, jobType, workplaceType, and status
   */
  async findAll(filter: FilterJobDto) {
    const { search, category, jobType, workplaceType, status, companyId, region } = filter;

    const where: any = {};

    // 1. Search Query
    if (search && search.trim() !== '') {
      const keyword = search.trim();
      where.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } },
        { location: { contains: keyword, mode: 'insensitive' } },
        { company: { name: { contains: keyword, mode: 'insensitive' } } },
      ];
    }

    // 2. Filters
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

  /**
   * Find single job by ID
   */
  async findOne(id: number) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found / ไม่พบตำแหน่งงานที่ระบุ`);
    }

    return job;
  }

  /**
   * Create new Job
   * Business Rule 1: stipendMax must be >= stipendMin
   * Business Rule 2: Application deadline must be in the future for OPEN jobs
   */
  async create(createJobDto: CreateJobDto) {
    // Check if Company exists
    const company = await this.prisma.company.findUnique({
      where: { id: createJobDto.companyId },
    });

    if (!company) {
      throw new BadRequestException(`Company with ID ${createJobDto.companyId} does not exist`);
    }

    // Business Rule 1: Stipend validation
    if (createJobDto.stipendMax < createJobDto.stipendMin) {
      throw new BadRequestException(
        'Business Rule Violation: เบี้ยเลี้ยงสูงสุด (stipendMax) ต้องมากกว่าหรือเท่ากับเบี้ยเลี้ยงขั้นต่ำ (stipendMin)',
      );
    }

    const deadline = new Date(createJobDto.applicationDeadline);
    const now = new Date();

    // Determine initial status based on deadline if not specified
    let initialStatus = createJobDto.status || 'OPEN';
    if (deadline < now && initialStatus === 'OPEN') {
      throw new BadRequestException(
        'Business Rule Violation: วันปิดรับสมัครงาน (Deadline) ต้องเป็นวันในอนาคตสำหรับงานที่เปิดรับ (OPEN)',
      );
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

  /**
   * Update Job
   */
  async update(id: number, updateJobDto: UpdateJobDto) {
    const existingJob = await this.findOne(id);

    const minStipend = updateJobDto.stipendMin !== undefined ? updateJobDto.stipendMin : existingJob.stipendMin;
    const maxStipend = updateJobDto.stipendMax !== undefined ? updateJobDto.stipendMax : existingJob.stipendMax;

    // Business Rule 1 Check
    if (maxStipend < minStipend) {
      throw new BadRequestException(
        'Business Rule Violation: เบี้ยเลี้ยงสูงสุด (stipendMax) ต้องมากกว่าหรือเท่ากับเบี้ยเลี้ยงขั้นต่ำ (stipendMin)',
      );
    }

    const data: any = { ...updateJobDto };
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

  /**
   * Delete Job
   */
  async remove(id: number) {
    await this.findOne(id); // Throws NotFoundException if doesn't exist

    return this.prisma.job.delete({
      where: { id },
    });
  }

  /**
   * Summary Stats for Dashboard / Home
   */
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
}
