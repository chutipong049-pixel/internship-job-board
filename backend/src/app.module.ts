import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CompaniesModule } from './companies/companies.module';
import { JobsModule } from './jobs/jobs.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, CompaniesModule, JobsModule, AuthModule],
})
export class AppModule {}
