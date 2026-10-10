import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding with company logos...');

  // 1. ล้างข้อมูลเก่า
  await prisma.job.deleteMany({});
  await prisma.company.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. สร้างบริษัทพร้อมโลโก้ภาพจริง
  const scg = await prisma.company.create({
    data: {
      name: 'SCG',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
      email: 'hr@scg.com',
      phone: '02 586 3333',
      location: 'กรุงเทพมหานคร',
      industry: 'Industrial & Technology',
      description: 'พัฒนาระบบซอฟต์แวร์ที่มีคุณภาพ ร่วมกับทีมงานมากประสบการณ์',
    },
  });

  const intel = await prisma.company.create({
    data: {
      name: 'Intel',
      logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=128&auto=format&fit=crop&q=80',
      email: 'hr@intel.com',
      phone: '02 000 0000',
      location: 'กรุงเทพมหานคร',
      industry: 'Technology & Hardware',
      description: 'ร่วมออกแบบประสบการณ์ผู้ใช้ (UX/UI) สำหรับผลิตภัณฑ์เทคโนโลยีใหม่ๆ',
    },
  });

  const microsoft = await prisma.company.create({
    data: {
      name: 'Microsoft',
      logo: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=128&auto=format&fit=crop&q=80',
      email: 'hr@microsoft.com',
      phone: '02 473 7000',
      location: 'เชียงใหม่',
      industry: 'Software & Cloud',
      description: 'ดูแลและพัฒนาระบบทั้ง Frontend และ Backend ด้วยเทคโนโลยีสมัยใหม่',
    },
  });

  const google = await prisma.company.create({
    data: {
      name: 'Google',
      logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=128&auto=format&fit=crop&q=80',
      email: 'hr@google.com',
      phone: '02 000 1234',
      location: 'กรุงเทพมหานคร',
      industry: 'Technology & AI',
      description: 'ร่วมพัฒนา AI และวิเคราะห์ข้อมูลขนาดใหญ่ เพื่อสร้างผลิตภัณฑ์ที่มีผลกระทบต่อผู้ใช้ทั่วโลก',
    },
  });

  const shopee = await prisma.company.create({
    data: {
      name: 'Shopee',
      logo: 'https://images.unsplash.com/photo-1607532940633-5c68f1212267?w=128&auto=format&fit=crop&q=80',
      email: 'hr@shopee.com',
      phone: '02 118 9000',
      location: 'กรุงเทพมหานคร',
      industry: 'E-commerce & Tech',
      description: 'พัฒนาและดูแลระบบแพลตฟอร์ม E-commerce ที่ผู้ใช้ทุกคนใช้งาน',
    },
  });

  // 3. สร้าง User ทดสอบ
  const hashedPassword = await bcrypt.hash('123456', 10);
  await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Chutipong Phengphaeng',
      role: 'STUDENT',
    },
  });

  // 4. สร้างตำแหน่งงาน
  await prisma.job.createMany({
    data: [
      {
        title: 'Software Engineer (Backend / Frontend)',
        description: 'พัฒนาระบบซอฟต์แวร์ที่มีคุณภาพ ร่วมกับทีมงานมากประสบการณ์ พร้อมเติบโตไปด้วยกัน',
        requirements: 'มีความเชี่ยวชาญด้าน TypeScript, Node.js หรือ Web Development',
        jobType: 'FULL_TIME',
        workplaceType: 'HYBRID',
        category: 'Software Engineering',
        stipendMin: 15000,
        stipendMax: 35000,
        location: 'กรุงเทพมหานคร',
        region: 'CENTRAL',
        status: 'OPEN',
        contactEmail: 'hr@scg.com',
        companyId: scg.id,
        applicationDeadline: new Date('2026-12-31'),
      },
      {
        title: 'Product Design Intern (UX/UI)',
        description: 'ร่วมออกแบบประสบการณ์ผู้ใช้ (UX/UI) สำหรับผลิตภัณฑ์เทคโนโลยีใหม่ๆ',
        requirements: 'ใช้งาน Figma ได้ดี มี Portfolio ผลงาน UI/UX ที่ชัดเจน',
        jobType: 'INTERNSHIP',
        workplaceType: 'ON_SITE',
        category: 'Design',
        stipendMin: 10000,
        stipendMax: 15000,
        location: 'กรุงเทพมหานคร',
        region: 'CENTRAL',
        status: 'OPEN',
        contactEmail: 'hr@intel.com',
        companyId: intel.id,
        applicationDeadline: new Date('2026-12-31'),
      },
      {
        title: 'Full-Stack Software Engineer',
        description: 'ดูแลและพัฒนาระบบทั้ง Frontend และ Backend ด้วยเทคโนโลยีสมัยใหม่',
        requirements: 'จบการศึกษาด้าน Computer Science มีทักษะการเขียนโปรแกรมรอบด้าน',
        jobType: 'FULL_TIME',
        workplaceType: 'REMOTE',
        category: 'Software Engineering',
        stipendMin: 20000,
        stipendMax: 45000,
        location: 'เชียงใหม่',
        region: 'NORTH',
        status: 'OPEN',
        contactEmail: 'hr@microsoft.com',
        companyId: microsoft.id,
        applicationDeadline: new Date('2026-12-31'),
      },
      {
        title: 'Data Science & AI Engineer',
        description: 'ร่วมพัฒนา AI และวิเคราะห์ข้อมูลขนาดใหญ่ เพื่อสร้างผลิตภัณฑ์ที่มีผลกระทบต่อผู้ใช้ทั่วโลก',
        requirements: 'มีความรู้ด้าน Python, Machine Learning และ Cloud Technology',
        jobType: 'FULL_TIME',
        workplaceType: 'HYBRID',
        category: 'Data & AI',
        stipendMin: 25000,
        stipendMax: 60000,
        location: 'กรุงเทพมหานคร',
        region: 'CENTRAL',
        status: 'OPEN',
        contactEmail: 'hr@google.com',
        companyId: google.id,
        applicationDeadline: new Date('2026-12-31'),
      },
      {
        title: 'Fullstack Software Engineer & Platform',
        description: 'พัฒนาและดูแลระบบแพลตฟอร์ม E-commerce ที่ผู้ใช้ทุกคนใช้งาน',
        requirements: 'เชี่ยวชาญ Modern Web Tech และ DevOps พื้นฐาน',
        jobType: 'FULL_TIME',
        workplaceType: 'HYBRID',
        category: 'Software Engineering',
        stipendMin: 20000,
        stipendMax: 40000,
        location: 'กรุงเทพมหานคร',
        region: 'CENTRAL',
        status: 'OPEN',
        contactEmail: 'hr@shopee.com',
        companyId: shopee.id,
        applicationDeadline: new Date('2026-12-31'),
      }
    ] as any,
  });

  console.log('✅ Seeding completed with logos successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });