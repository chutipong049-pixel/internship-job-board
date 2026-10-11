# 🎓 Internship & Job Board (ระบบค้นหาและจัดการตำแหน่งงาน & ที่ฝึกงาน)
### Full-Stack Web Application Development (วิชา Web Development Project - 30 คะแนน)
**กลุ่มที่ 8:** Internship & Job Board  
**Entity หลัก:** `Job` / `Company` / `User`  
**สถานะการ Deploy ออนไลน์:**
* 🌐 **Frontend (Vercel):** [https://internship-job-board-qnlm.vercel.app](https://internship-job-board-qnlm.vercel.app/jobs)
* ⚙️ **Backend REST API (Render):** [https://internship-job-board.onrender.com](https://internship-job-board.onrender.com)

---

## 👥 รายชื่อสมาชิกในกลุ่ม (Team Members & Roles)
| ลำดับ | รหัสนักศึกษา | ชื่อ - นามสกุล | บทบาทหน้าที่ความรับผิดชอบ |
| :---: | :---: | :--- | :--- |
| 1 | 67126292 | [ธีรพัฒน์  จิตรพราหมณ์] | 
| 2 | 67107665 | [สัณหณัฐกานต์ พลสิทธิ์] | 
| 3 | 67131326 | [ชุติพงษ์ เพ็งแพ่ง]      |
| 4 | 67122226 | [นางสาวกชกร ดวงจนิดา] | 

---

## 🎯 1. วัตถุประสงค์ของโครงงาน (Project Objectives)
1. พัฒนาระบบ Full-Stack Web Application ที่เชื่อมโยงการทำงานจริงตั้งแต่ **Frontend (Angular 18 + Tailwind CSS) -> Backend (NestJS 10 REST API) -> Database (PostgreSQL + Prisma ORM)** พร้อมรองรับ Production บน Vercel & Render
2. สนับสนุนให้นักศึกษาค้นหาตำแหน่งงานและที่ฝึกงานตรงตามสายงาน (Software Engineering, Data & AI, Design, Marketing ฯลฯ) พร้อมระบบค้นหา (Search) และคัดกรอง (Filter)
3. ให้ฝ่ายบุคคลหรือบริษัทสามารถลงประกาศงาน (Create), แสดงรายการงาน (Read), แก้ไขข้อมูล (Update), และลบประกาศงาน (Delete) ได้อย่างครบถ้วนตามหลัก CRUD
4. พัฒนาระบบยืนยันตัวตน (Authentication) สำหรับสมาชิก เพื่อเข้าสู่ระบบ (Login) จัดการประกาศงาน และแสดงสถานะชื่อผู้ใช้บนแถบ Navbar แบบ Real-time
5. ประยุกต์ใช้กฎทางธุรกิจ (Business Rules) และการตรวจสอบข้อมูล (Validation) ทั้งฝั่ง Frontend และ Backend อย่างปลอดภัยและถูกต้อง

---

## 💻 2. เทคโนโลยีที่ใช้ (Tech Stack)
* **Frontend**: 
  * Angular 18 (Standalone Components Architecture)
  * Tailwind CSS (Theme ส้ม `#ea580c` คุมโทนร่วมกับ Google Font `Kanit`)
  * RxJS (`BehaviorSubject` สำหรับดักฟัง Auth State แบบ Reactive)
  * Angular Routing & Forms
* **Backend**: 
  * NestJS 10, TypeScript, RESTful API Architecture
  * Passport.js, `@nestjs/jwt`, `bcrypt` สำหรับจัดการรหัสผ่านและ Authentication
  * `class-validator`, `class-transformer` สำหรับตรวจสอบ DTO Payload
* **Database & ORM**: 
  * PostgreSQL (เชื่อมต่อผ่าน Prisma ORM 5)
* **Cloud & Deployment**: 
  * **Frontend**: Vercel
  * **Backend**: Render Web Service
  * **Database**: Neon / Supabase PostgreSQL

---

## 🗄️ 3. โครงสร้างฐานข้อมูล (Database Structure & Relations)

ระบบประกอบด้วย Models หลัก มีความสัมพันธ์แบบ **One-to-Many (1:N)**:
* **1 Company มีได้หลาย Jobs (1 to N)**
* **1 Job ขึ้นอยู่กับ 1 Company** (Cascade Delete เมื่อลบบริษัท)
* **User** สำหรับระบบสิทธิ์เข้าใช้งานและลงประกาศงาน

```mermaid
erDiagram
    COMPANY ||--o{ JOB : "has many"
    USER ||--o{ JOB : "posts"
    COMPANY {
        int id PK "auto-increment"
        string name "Company Name (SCG, Intel, Microsoft, Google, Shopee)"
        string logo "Logo URL / Asset Path"
        string website "Website URL"
        string email "Official Email"
        string phone "Contact Number"
        string location "Headquarters Address"
        string industry "Industry Category"
        string description "Company Profile"
        datetime createdAt
        datetime updatedAt
    }
    JOB {
        int id PK "auto-increment"
        int companyId FK "References Company(id)"
        string title "Job Title"
        string category "IT, Design, Data, etc."
        string jobType "INTERNSHIP, FULL_TIME, PART_TIME"
        string workplaceType "ON_SITE, HYBRID, REMOTE"
        string description "Full Job Description"
        string requirements "Applicant Qualifications"
        string benefits "Perks & Benefits"
        float stipendMin "Minimum Stipend (>=0)"
        float stipendMax "Maximum Stipend (>= stipendMin)"
        string location "Workplace Location"
        datetime applicationDeadline "Closing Date"
        string status "OPEN, CLOSED"
        string contactEmail "HR Contact Email"
        string applicationUrl "Online Application Link (Optional)"
        datetime createdAt
        datetime updatedAt
    }
    USER {
        int id PK "auto-increment"
        string email "Unique Email"
        string password "Hashed Password"
        string name "Display Name / Username"
        string role "USER, ADMIN"
        datetime createdAt
    }

 ## 4. กฎทางธุรกิจของระบบ (Business Rules)
ระบบได้กำหนดและตรวจสอบ Business Rules อย่างเข้มงวดทั้งในระดับ Frontend และ Backend:

1. Business Rule 1: การควบคุมสถานะการรับสมัครและกำหนดเวลา (Job Status & Deadline Rule)

  1.1 หากตำแหน่งงานมีสถานะเป็น CLOSED หรือเลยกำหนดวันปิดรับสมัคร:

      หน้าการ์ดงานและหน้ารายละเอียดจะขึ้นสถานะปิดรับสมัคร

      ระบบตรวจสอบวัน Deadline ในขั้นตอนลงประกาศงาน ต้องไม่เป็นวันในอดีต

 2.Business Rule 2: ความถูกต้องของอัตราค่าตอบแทน/เบี้ยเลี้ยง (Stipend Consistency Rule)

    เบี้ยเลี้ยงขั้นต่ำ (stipendMin) และเบี้ยเลี้ยงสูงสุด (stipendMax) ต้องไม่ติดลบ (>= 0)

    เบี้ยเลี้ยงสูงสุดต้องมากกว่าหรือเท่ากับเบี้ยเลี้ยงขั้นต่ำเสมอ (stipendMax >= stipendMin)

    หากผู้ใช้กรอก stipendMax < stipendMin ฟอร์มจะแสดงข้อความเตือนและปฏิเสธการส่งข้อมูล พร้อมทั้งฝั่ง Backend Service จะโยน 400 Bad Request Exception

3. Business Rule 3: ความยืดหยุ่นในการรับสมัคร (Application Flow Rule)

    ช่องลิงก์รับสมัครภายนอก (applicationUrl) กำหนดให้เป็นฟิลด์ทางเลือก (Optional) เพื่อรองรับกรณีที่บริษัทต้องการรับสมัครผ่านการส่งอีเมลติดต่อ (contactEmail) โดยตรง

## 5. วิธีการติดตั้งและรันระบบในเครื่อง (Local Setup)
     สิ่งที่ต้องมีในเครื่อง (Prerequisites):
       Node.js (v18 หรือใหม่กว่า) และ npm
       PostgreSQL (ติดตั้งในเครื่อง หรือรันผ่าน Docker)
       ขั้นตอนที่ 1: ติดตั้งและรันฝั่ง Backend (NestJS)
   Bash
   # 1. เข้าสู่โฟลเดอร์ backend
   cd backend

   # 2. ติดตั้ง Dependencies
   npm install

   # 3. ตรวจสอบไฟล์ .env
   # DATABASE_URL="postgresql://postgres:postgres@localhost:5432/jobboard_db?schema=public"
   # JWT_SECRET="your_jwt_secret_key"

   # 4. สั่ง Prisma สร้าง Database Tables และ Seed ข้อมูล
   npx prisma db push
   npm run prisma:seed

   # 5. เริ่มรัน Backend Server
   npm run start:dev
   Backend REST API จะทำงานที่: http://localhost:3000/api

   Bash
   # 1. เข้าสู่โฟลเดอร์ frontend
   cd frontend

   # 2. ติดตั้ง Dependencies
   npm install

   # 3. เริ่มรัน Dev Server
   npm start
   เปิดบราวเซอร์ไปที่: http://localhost:4200

 ##  6. รายการ REST API Endpoints (NestJS Backend)
ระบบตั้งค่า Global Prefix เป็น /api เพื่อความปลอดภัยและเป็นมาตรฐาน:
Method          Endpoint               หน้าที่การทำงาน                      ตัวอย่าง Payload / Query
POST            /api/auth/register     สมัครสมาชิกใหม่                     { "email": "user@example.com", "password": "...                                                                      "name" "User" }

POST            /api/auth/login        เข้าสู่ระบบและรับ JWT Token            { "email": "user@example.com", "password": "..." }

GET             /api/jobs              ค้นหาและดึงรายการงานทั้งหมด            ?search=Engineer&jobType=FULL_TIME&w
 
GET             /api/jobs/:id          ดึงรายละเอียดของงาน 1 รายการ           /api/jobs/1

POST	          /api/jobs	            สร้างตำแหน่งงานใหม่ (Create)	         { "title": "...", "companyId": 1, "stipendMin": 
15000, ... }

PUT	          /api/jobs/:id	         แก้ไขข้อมูลตำแหน่งงาน (Update)	      { "title": "...", "stipendMax": 35000, ... }

DELETE	       /api/jobs/:id	         ลบตำแหน่งงาน (Delete)	             /api/jobs/1

GET	          /api/companies	      ดึงรายชื่อบริษัททั้งหมดสำหรับ Dropdown	    /api/companies

## 7. โครงสร้างหน้าเว็บ Frontend (Production Features)
        1.Header & Navigation Bar:

          โลโก้แบรนด์ JobBoard ขนาดพอดี คมชัด ไม่ซ้ำซ้อน

          เมนูเลือกดูหางานทั้งหมด พร้อมปุ่มส้มไฮไลต์ "+ ลงประกาศงาน"

          แสดงผลสลับอัตโนมัติ: แสดงปุ่ม "เข้าสู่ระบบ / สมัครสมาชิก" เมื่อยังไม่ได้ล็อกอิน และแสดง Avatar + ชื่อ Username พร้อมปุ่มออกจากระบบ ทันทีที่เข้าสู่ระบบสำเร็จ
        2.List Page (/jobs):

          แบนเนอร์หัวเว็บดีไซน์พรีเมียม สไตล์ภาพประกอบ assets/banner-bg.png ปูเต็มสัดส่วน

          การ์ดทักทายมุมขวา "งานดีๆ รอคุณอยู่" พร้อมไอคอนแบบ Clean Vector (Zero Emojis)

          กล่องตัวกรองค้นหางาน: ค้นหาตามชื่อตำแหน่ง/บริษัท, ประเภทงาน (Internship, Full-time), สถานที่ทำงาน (On-site, Hybrid, Remote), และภูมิภาค

          รายการการ์ดงาน: แสดงโลโก้ของแต่ละบริษัทจริง (assets/scg.png, intel.png, microsoft.png, google.png, shopee.png), แท็กสายงาน, อัตราค่าตอบแทนต่อเดือน, วันที่โพสต์, และปุ่มดูรายละเอียด
       3.Job Form Page (/jobs/new, /jobs/:id/edit):

          ฟอร์มลงประกาศงานคุมธีมสีส้มสด พร้อมแจ้งเตือน Business Rules ด้านบน

          รองรับการเลือกบริษัทจริง แปลงค่า companyId เป็น Integer อัตโนมัติ

          ช่องกรอก applicationUrl เป็น Optional พร้อมกำหนดวัน applicationDeadline ล่วงหน้าเริ่มต้น 30 วัน
       4.Authentication Pages (/login, /register):

          หน้าฟอร์มเข้าสู่ระบบและสมัครสมาชิก ออกแบบมินิมอล ใช้งานง่าย

          บันทึก Token และ User Profile ลงใน Client Storage เพื่อคงสถานะล็อกอินแม้รีเฟรชหน้าเว็บ

## 8. Checklist การตรวจประเมินตามเกณฑ์ (Rubric Self-Check)
[x] Database & Prisma (4 คะแนน): มี Models Company, Job, User ครบถ้วน, Relation 1:N สมบูรณ์, มี Seed Data ครอบคลุมบริษัทชั้นนำ

[x] NestJS REST API (5 คะแนน): มี Auth Module (JWT), Job Module, Global Prefix /api, ValidationPipe พร้อมจัดการ CORS

[x] CRUD Functionality (6 คะแนน): Create, Read (List/Detail), Update, Delete ใช้งานได้จริงและสอดรับกับฐานข้อมูล

[x] Angular Frontend & API Integration (5 คะแนน): เชื่อมต่อ REST API จริงผ่าน HttpClient, มี Service แยกหน้าที่, จัดการ Fallback อย่างราบรื่น

[x] Search / Filter / State Management (3 คะแนน): Search ค้นหาได้จริง, ตัวกรองหลายเงื่อนไข, ดักฟัง Reactive Auth State ด้วย BehaviorSubject

[x] UI/UX & Consistency (3 คะแนน): คุมโทนสีส้ม #ea580c และฟอนต์ Kanit ทั่วทั้งแอปพลิเคชัน, จัดวางโลโก้และแบนเนอร์ตรงตามดีไซน์หลัก ปราศจากอีโมจิ

[x] Validation & Error Handling (2 คะแนน): Client-side Validation ชัดเจน, แจ้งเตือนข้อผิดพลาดจาก Backend และไม่เกิด Unhandled Crash

[x] Deployment & Readiness (2 คะแนน): ระบบออนไลน์พร้อมใช้งานทั้ง Frontend บน Vercel และ Backend บน Render