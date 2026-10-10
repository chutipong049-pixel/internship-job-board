import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    findAll(): Promise<({
        _count: {
            jobs: number;
        };
    } & {
        name: string;
        logo: string | null;
        email: string;
        phone: string | null;
        location: string;
        industry: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    })[]>;
    findOne(id: number): Promise<{
        jobs: {
            location: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            title: string;
            requirements: string;
            benefits: string | null;
            jobType: string;
            workplaceType: string;
            category: string;
            stipendMin: number;
            stipendMax: number;
            region: string | null;
            applicationDeadline: Date;
            status: string;
            contactEmail: string;
            applyUrl: string | null;
            companyId: number;
        }[];
    } & {
        name: string;
        logo: string | null;
        email: string;
        phone: string | null;
        location: string;
        industry: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    create(createCompanyDto: CreateCompanyDto): Promise<{
        name: string;
        logo: string | null;
        email: string;
        phone: string | null;
        location: string;
        industry: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
}
