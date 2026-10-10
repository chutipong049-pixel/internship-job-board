# 🎓 Internship & Job Board (ระบบค้นหาและจัดการตำแหน่งงาน & ที่ฝึกงาน)
### Full-Stack Web Application Development (วิชา Web Development Project - 30 คะแนน)
**กลุ่มที่ 8:** Internship & Job Board  
**Entity หลัก:** `Job` / `Company` (G1)

---

## 👥 รายชื่อสมาชิกในกลุ่ม (Team Members & Roles)
| ลำดับ | รหัสนักศึกษา | ชื่อ - นามสกุล | บทบาทหน้าที่ความรับผิดชอบ |
| :---: | :---: | :--- | :--- |
| 1 | 6xxxxxxxx-x | [ชื่อสมาชิกคนที่ 1] | **Frontend / UI**: พัฒนา Angular Components, UI Design ด้วย Tailwind CSS, ออกแบบ Responsive และ State Display (Loading/Error/Empty) |
| 2 | 6xxxxxxxx-x | [ชื่อสมาชิกคนที่ 2] | **Frontend / Integration**: พัฒนา Angular Services, Routing, เชื่อมต่อ REST API เข้ากับ Backend และจัดการ Client-side Validation |
| 3 | 6xxxxxxxx-x | [ชื่อสมาชิกคนที่ 3] | **Backend**: พัฒนา NestJS Controllers, Services, DTOs, Input Validation ด้วย class-validator และบังคับใช้ Business Rules |
| 4 | 6xxxxxxxx-x | [ชื่อสมาชิกคนที่ 4] | **Database / Integration**: ออกแบบฐานข้อมูล PostgreSQL, เขียน Prisma Schema & Migrations, เตรียม Seed Data และทดสอบเชื่อมโยงระบบ Full-Stack |

---

## 🎯 1. วัตถุประสงค์ของโครงงาน (Project Objectives)
1. พัฒนาระบบ Full-Stack Web Application ที่เชื่อมโยงการทำงานจริงตั้งแต่ **Frontend (Angular + Tailwind CSS) -> Backend (NestJS REST API) -> Database (PostgreSQL + Prisma ORM)**
2. สนับสนุนให้นักศึกษาค้นหาตำแหน่งงานและที่ฝึกงานตรงตามสายงาน (Software Engineering, Data & AI, Design, Marketing ฯลฯ) พร้อมระบบค้นหา (Search) และคัดกรอง (Filter)
3. ให้ฝ่ายบุคคลหรือบริษัทสามารถลงประกาศงาน (Create), แสดงรายการงาน (Read), แก้ไขข้อมูล (Update), และลบประกาศงาน (Delete) ได้อย่างครบถ้วนตามหลัก CRUD
4. ประยุกต์ใช้กฎทางธุรกิจ (Business Rules) และการตรวจสอบข้อมูล (Validation) ทั้งฝั่ง Frontend และ Backend อย่างปลอดภัยและถูกต้อง

---

## 💻 2. เทคโนโลยีที่ใช้ (Tech Stack)
* **Frontend**: Angular 18 (Standalone Components), Tailwind CSS, RxJS, Angular Routing, Reactive Forms
* **Backend**: NestJS 10, TypeScript, RESTful API Architecture, `class-validator`, `class-transformer`
* **Database & ORM**: PostgreSQL 16+, Prisma ORM 5
* **Container (ทางเลือก)**: Docker & Docker Compose สำหรับจำลอง PostgreSQL database ในเครื่อง

---

## 🗄️ 3. โครงสร้างฐานข้อมูล (Database Structure & Relations)

ระบบประกอบด้วย 2 Models หลัก มีความสัมพันธ์แบบ **One-to-Many (1:N)**:
* **1 Company มีได้หลาย Jobs (1 to N)**
* **1 Job ขึ้นอยู่กับ 1 Company** (เมื่อลบบริษัท ตำแหน่งงานที่เกี่ยวข้องจะถูก Cascade Delete)

```mermaid
erDiagram
    COMPANY ||--o{ JOB : "has many"
    COMPANY {
        int id PK "auto-increment"
        string name "Company Name"
        string logo "Logo URL"
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
        string applyUrl "Online Application Link"
        datetime createdAt
        datetime updatedAt
    }
```

---

## ⚖️ 4. กฎทางธุรกิจของระบบ (Business Rules)

ระบบได้กำหนดและตรวจสอบ Business Rules อย่างเข้มงวดทั้งในระดับ **Frontend** (Form Validation & Alert) และ **Backend** (NestJS Service & DTO Exception):

1. **Business Rule 1: การควบคุมสถานะการรับสมัครและกำหนดเวลา (Job Status & Deadline Rule)**
   - หากตำแหน่งงานมีสถานะเป็น `CLOSED` หรือเลยกำหนดวันปิดรับสมัคร (`applicationDeadline < NOW`):
     - ปุ่มส่งใบสมัคร (Apply Now) จะถูกปิดการใช้งาน (Disabled) ทันที พร้อมแสดงป้ายเตือน *"⛔ ปิดรับสมัครแล้ว (Closed)"*
     - หน้าค้นหาหลัก (Job List) มีตัวกรองสถานะที่คัดกรองงานที่ปิดรับสมัครออกจากงานที่เปิดรับ (Default: Open Only)
     - Backend จะไม่อนุญาตให้เปิดรับสมัครงานที่วัน Deadline หมดอายุไปแล้ว
2. **Business Rule 2: ความถูกต้องของอัตราค่าตอบแทน/เบี้ยเลี้ยง (Stipend Consistency Rule)**
   - เบี้ยเลี้ยงขั้นต่ำ (`stipendMin`) และเบี้ยเลี้ยงสูงสุด (`stipendMax`) ต้องเป็นตัวเลขที่ไม่ติดลบ (`>= 0`)
   - เบี้ยเลี้ยงสูงสุดต้องมากกว่าหรือเท่ากับเบี้ยเลี้ยงขั้นต่ำเสมอ (`stipendMax >= stipendMin`)
   - หากผู้ใช้กรอก `stipendMax < stipendMin` ฟอร์มจะแสดงข้อความเตือนสีแดงและไม่ยอมให้กดบันทึก พร้อมทั้งฝั่ง Backend Service จะโยน `400 Bad Request Exception: "เบี้ยเลี้ยงสูงสุดต้องมากกว่าหรือเท่ากับเบี้ยเลี้ยงขั้นต่ำ"`

---

## 🚀 5. วิธีการติดตั้งและรันระบบ (Setup & Execution Guide)

### สิ่งที่ต้องมีในเครื่อง (Prerequisites):
1. **Node.js** (v18 หรือใหม่กว่า) และ **npm**
2. **PostgreSQL** (ติดตั้งในเครื่อง หรือรันผ่าน Docker)

---

### 🚀 ทางลัด: รันทั้งระบบด้วย Docker (One-Click / Command)
หากติดตั้ง Docker Desktop แล้ว สามารถเลือกวิธีรันได้ 2 แบบตามความสะดวก:

#### 🌟 แบบที่ 1: รันทั้งระบบใน Docker (Full-Stack: Database + Backend + Frontend)
- **วิธีดับเบิลคลิก:** ดับเบิลคลิกไฟล์ **`docker-start.bat`**
- **หรือผ่าน Command Line:**
  ```bash
  docker compose up -d --build
  ```
  - หน้าเว็บ Frontend: `http://localhost:4200`
  - Backend API: `http://localhost:3000/api`
  - สั่งหยุดการทำงาน: ดับเบิลคลิก **`docker-stop.bat`** หรือพิมพ์ `docker compose down`

#### 🛠️ แบบที่ 2: รันเฉพาะ Database ใน Docker แล้ว Dev ฝั่ง Code ในเครื่อง (แนะนำช่วงพัฒนา)
- **วิธีดับเบิลคลิก:** ดับเบิลคลิกไฟล์ **`docker-db-only.bat`**
- **หรือผ่าน Command Line:**
  ```bash
  docker compose up -d postgres
  ```
  *(จากนั้นรัน `start-all.bat` หรือรัน Backend และ Frontend ตามขั้นตอนด้านล่างตามปกติ)*

---

### ขั้นตอนที่ 1: เตรียมฐานข้อมูล PostgreSQL (กรณีไม่รัน Full Docker)
สามารถเลือกวิธีใดวิธีหนึ่ง:
* **วิธี A (ใช้ Docker Database):** ดับเบิลคลิก `docker-db-only.bat` หรือ `docker compose up -d postgres`
* **วิธี B (ใช้ Local PostgreSQL):**
  สร้างฐานข้อมูลชื่อ `jobboard_db` และตรวจสอบ connection string ใน `backend/.env`:
  ```env
  DATABASE_URL="postgresql://postgres:postgres@localhost:5432/jobboard_db?schema=public"
  ```

---

### ขั้นตอนที่ 2: รันฝั่ง Backend (NestJS + Prisma)
```bash
# 1. เข้าสู่โฟลเดอร์ backend
cd backend

# 2. ติดตั้ง Dependencies (หากยังไม่ได้ทำ)
npm install

# 3. สั่ง Prisma สร้าง Database Tables และ Client
npx prisma db push
# หรือ npx prisma migrate dev --name init

# 4. ใส่ข้อมูลตัวอย่าง (Seeding Data: บริษัทชั้นนำ และ ตำแหน่งงานหลากหลาย)
npx prisma db seed
# หรือ npm run prisma:seed

# 5. เริ่มรัน Backend Server
npm run start:dev
```
Backend REST API จะทำงานที่: **`http://localhost:3000/api`**

---

### ขั้นตอนที่ 3: รันฝั่ง Frontend (Angular + Tailwind CSS)
เปิด Terminal หน้าต่างใหม่:
```bash
# 1. เข้าสู่โฟลเดอร์ frontend
cd frontend

# 2. ติดตั้ง Dependencies (หากยังไม่ได้ทำ)
npm install

# 3. เริ่มรัน Dev Server
npm start
```
เปิดบราวเซอร์ไปที่: **`http://localhost:4200`**

---

## 📡 6. รายการ REST API Endpoints (NestJS Backend)

| Method | Endpoint | หน้าที่การทำงาน | ตัวอย่าง Query / Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobs` | ค้นหาและดึงรายการงานทั้งหมด (Search & Filter) | `?search=frontend&category=Software+Engineering&status=OPEN` |
| `GET` | `/api/jobs/:id` | ดึงรายละเอียดของงาน 1 รายการ พร้อมข้อมูลบริษัท | `/api/jobs/1` |
| `GET` | `/api/jobs/stats` | ดึงข้อมูลสถิติภาพรวม (จำนวนงาน, เปิดรับ, ที่ฝึกงาน) | `/api/jobs/stats` |
| `POST` | `/api/jobs` | สร้างตำแหน่งงานใหม่ (Create) มี Validation | `{ title: "...", companyId: 1, stipendMin: 15000, ... }` |
| `PUT` | `/api/jobs/:id` | แก้ไขข้อมูลตำแหน่งงาน (Update) มี Validation | `{ title: "...", stipendMax: 20000, ... }` |
| `DELETE` | `/api/jobs/:id` | ลบตำแหน่งงาน (Delete) | `/api/jobs/1` |
| `GET` | `/api/companies` | ดึงรายชื่อบริษัททั้งหมดสำหรับ Dropdown | `/api/companies` |
| `GET` | `/api/companies/:id` | ดึงข้อมูลบริษัทพร้อมตำแหน่งงานทั้งหมดของบริษัท | `/api/companies/1` |

---

## 🖥️ 7. โครงสร้างหน้าเว็บ Frontend (4 Views ตามเกณฑ์คะแนน)

1. **List Page (`/jobs`)**:
   - แถบค้นหาข้อความ (Search Bar) ค้นหาชื่อตำแหน่งงาน, บริษัท, คีย์เวิร์ด
   - ตัวกรอง 4 หมวด (Category, Job Type, Workplace Type, Status)
   - แถบสรุปสถิติงานทั้งหมด / งานที่กำลังเปิดรับ / งานฝึกงาน
   - แสดงสถานะระบบ: Loading Skeleton, Error State พร้อมปุ่ม Retry, และ Empty State
2. **Detail Page (`/jobs/:id`)**:
   - รายละเอียดงานฉบับเต็ม, คุณสมบัติ (Requirements), สวัสดิการ (Benefits)
   - กล่องข้อมูลบริษัท (Company Sidebar Card)
   - ตัวตรวจสอบ Business Rule: หากงาน Closed จะแสดงแถบแจ้งเตือนและระงับปุ่มสมัคร
   - Modal ฟอร์มส่งใบสมัครงานจำลอง (Apply Form Modal)
   - ปุ่มแก้ไขงาน (Edit) และปุ่มลบงาน (Delete) พร้อมหน้าต่างยืนยัน (Confirmation Modal)
3. **Add Page (`/jobs/new`)**:
   - ฟอร์มลงประกาศงานใหม่พร้อม Reactive Forms Validation แบบ Real-time
   - เลือกลิสต์บริษัทจากฐานข้อมูลจริง
   - ตรวจสอบความถูกต้องของอีเมล, ตัวเลขค่าตอบแทน, และวันปิดรับสมัคร
4. **Edit Page (`/jobs/:id/edit`)**:
   - ดึงข้อมูลเดิมมาใส่ในฟอร์มอัตโนมัติ (Pre-populate)
   - สามารถแก้ไขข้อมูลและปรับเปลี่ยนสถานะระหว่าง OPEN / CLOSED ได้

---

## ✅ 8. Checklist การตรวจประเมินตามเกณฑ์ (Rubric Self-Check)
* [x] **Database & Prisma (4 คะแนน)**: 2 Models (`Company`, `Job`), มี Relation 1:N ถูกต้อง, Prisma Schema สมบูรณ์ และมี Seed script
* [x] **NestJS REST API (5 คะแนน)**: Controller, Service, DTO, ValidationPipe, PrismaService แยก Module เป็นระเบียบ
* [x] **CRUD Functionality (6 คะแนน)**: Create, Read (List/Detail), Update, Delete ใช้งานได้จริงและเชื่อมต่อ Database
* [x] **Angular Frontend & API Integration (5 คะแนน)**: เชื่อมต่อ REST API จริงผ่าน `HttpClient`, มี Service, มี Routing
* [x] **Search / Filter / Routing / State (3 คะแนน)**: Search ค้นหาได้จริง, Filter แยกประเภทได้, มี Loading, Error, Empty State ครบ
* [x] **UI/UX & Responsive Design (3 คะแนน)**: ดีไซน์พรีเมียมด้วย Tailwind CSS, แสดงผลสวยงามทั้งจอมือถือและเดสก์ท็อป
* [x] **Validation & Error Handling (2 คะแนน)**: Frontend Reactive Validation + Backend class-validator และไม่เกิด Unhandled Crash
* [x] **Presentation & Individual Understanding (2 คะแนน)**: เตรียมเอกสาร `PRESENTATION_QA.md` อธิบายคำถามที่อาจารย์จะสุ่มถามทุกคน
