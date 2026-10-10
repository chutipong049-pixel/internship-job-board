export declare class CreateJobDto {
    title: string;
    companyId: number;
    category: string;
    jobType: string;
    workplaceType: string;
    description: string;
    requirements: string;
    benefits?: string;
    stipendMin: number;
    stipendMax: number;
    location: string;
    applicationDeadline: string;
    status?: string;
    contactEmail: string;
    applyUrl?: string;
}
