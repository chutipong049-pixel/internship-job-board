import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    constructor(prisma: PrismaService);
    register(dto: {
        email: string;
        password: string;
        name: string;
        role?: string;
    }): Promise<{
        message: string;
        user: {
            id: number;
            email: string;
            name: string;
            role: string;
        };
    }>;
    login(dto: {
        email: string;
        password: string;
    }): Promise<{
        message: string;
        user: {
            id: number;
            email: string;
            name: string;
            role: string;
        };
    }>;
}
