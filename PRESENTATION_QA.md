# 🎤 คู่มือเตรียมตัวตอบคำถามอาจารย์วันนำเสนอ (Presentation Q&A Guide)
### โครงงาน: Internship & Job Board (กลุ่มที่ 1)
**วิชา:** Full-Stack Web Application Development (30 คะแนน)

> 💡 **คำแนะนำสำหรับสมาชิกทุกคนในกลุ่ม:** อาจารย์จะสุ่มถามคำถามจากสมาชิกแต่ละคน เพื่อวัดความเข้าใจจริง (ไม่ใช่แค่ทำเสร็จอย่างเดียว) สมาชิกทุกคนควรอ่านและเข้าใจหัวข้อหลักด้านล่างนี้ โดยเฉพาะข้อที่เกี่ยวกับบทบาทของตนเองและภาพรวมระบบ

---

## 📌 สรุปคำถามยอดนิยมที่อาจารย์สุ่มถาม (พร้อมแนวทางการตอบ)

### 1. "Frontend ติดต่อกับ Backend อย่างไร?"
* **คำตอบ:**
  > "Frontend (Angular) ติดต่อกับ Backend (NestJS) ผ่านทาง **HTTP Request (REST API)** โดย Angular จะใช้ `HttpClient` ภายใน `JobService` ทำการส่ง HTTP methods เช่น:
  > - `GET /api/jobs` เพื่อดึงข้อมูลตำแหน่งงาน
  > - `POST /api/jobs` เพื่อส่งข้อมูลในรูปแบบ JSON ไปบันทึก
  > - `PUT /api/jobs/:id` เพื่อแก้ไข
  > - `DELETE /api/jobs/:id` เพื่อลบ
  > 
  > ข้อมูลที่ส่งและตอบกลับจะอยู่ในรูปแบบ **JSON format** และฝั่ง NestJS ได้เปิด CORS (Cross-Origin Resource Sharing) เพื่ออนุญาตให้ Frontend บนพอร์ต 4200 สามารถติดต่อสื่อสารกับ Backend บนพอร์ต 3000 ได้ครับ/ค่ะ"

---

### 2. "Angular Service ทำหน้าที่อะไร?"
* **คำตอบ:**
  > "Angular Service (ในโปรเจกต์คือ `JobService`) ทำหน้าที่เป็น **ศูนย์กลางการจัดการ Business Logic และการติดต่อภายนอก (Data Layer & API Calls)** แยกออกจาก UI Component ครับ/ค่ะ
  > ข้อดีคือ:
  > 1. ทำให้ Components มีหน้าที่แค่แสดงผล UI เท่านั้น ไม่ต้องเขียน HTTP logic ซ้ำซ้อน (Separation of Concerns)
  > 2. นำฟังก์ชันกลับมาใช้ซ้ำได้ (Reusable) เช่น ทั้งหน้า List, Detail, Form สามารถเรียกใช้ `JobService` ตัวเดียวกันได้
  > 3. ทำงานผ่านรูปแบบ **Dependency Injection (DI)** ของ Angular ทำให้จัดการหน่วยความจำและทดสอบได้ง่ายครับ/ค่ะ"

---

### 3. "Controller ใน NestJS ทำหน้าที่อะไร?"
* **คำตอบ:**
  > "Controller (เช่น `JobsController`, `CompaniesController`) ทำหน้าที่เป็น **ผู้รับคำขอ (Request Handler & Router)** จากฝั่ง Client ครับ/ค่ะ
  > โดย Controller จะ:
  > 1. กำหนด URL Endpoint เช่น `@Get()`, `@Post()`, `@Put(':id')`, `@Delete(':id')`
  > 2. รับและตรวจสอบข้อมูลเบื้องต้นผ่าน **DTO (Data Transfer Object)** และ ValidationPipe เช่น ตรวจว่ากรอกข้อมูลครบไหม อีเมลถูกต้องไหม
  > 3. จากนั้น Controller จะส่งต่องานไปให้ **Service** เป็นผู้ประมวลผล ไม่ควรเขียนโค้ดต่อ Database ใน Controller โดยตรงครับ/ค่ะ"

---

### 4. "Service ใน NestJS ทำหน้าที่อะไร?"
* **คำตอบ:**
  > "Service (เช่น `JobsService`) ทำหน้าที่เป็น **ผู้ประมวลผลทางธุรกิจ (Business Logic Layer)** ครับ/ค่ะ
  > หน้าที่หลักคือ:
  > 1. ตรวจสอบกฎทางธุรกิจ (Business Rules) เช่น เช็คว่าเบี้ยเลี้ยงขั้นต่ำไม่เกินเบี้ยเลี้ยงสูงสุด หรือเช็คว่าตำแหน่งงานหมดอายุหรือยัง
  > 2. ติดต่อกับฐานข้อมูลผ่าน **PrismaService** เพื่อทำ CRUD (Create, Read, Update, Delete)
  > 3. ส่งข้อมูลผลลัพธ์กลับไปยัง Controller เพื่อตอบกลับให้ Client ครับ/ค่ะ"

---

### 5. "Prisma ทำหน้าที่อะไร และดีกว่าการเขียน SQL ดิบอย่างไร?"
* **คำตอบ:**
  > "Prisma เป็น **Next-generation ORM (Object-Relational Mapping)** สำหรับ Node.js และ TypeScript ครับ/ค่ะ
  > หน้าที่คือ:
  > 1. เป็นสะพานเชื่อมระหว่างโค้ด TypeScript ของเรากับฐานข้อมูล PostgreSQL
  > 2. ช่วยให้เราจัดการข้อมูลในรูปแบบ JavaScript Objects เช่น `prisma.job.findMany()` แทนการเขียน `SELECT * FROM jobs`
  > 3. ให้ความสามารถ **Type-Safety แบบ 100%**: ถ้าเราพิมพ์ชื่อฟิลด์ผิด หรือใส่ประเภทข้อมูลผิด TypeScript จะฟ้อง Error ทันทีตั้งแต่ตอนเขียนโค้ด
  > 4. มีระบบ **Prisma Migrate** ช่วยสร้างและซิงค์โครงสร้างตารางใน Database จากไฟล์ `schema.prisma` โดยอัตโนมัติครับ/ค่ะ"

---

### 6. "ข้อมูลของระบบถูกบันทึกลงที่ใด?"
* **คำตอบ:**
  > "ข้อมูลถูกบันทึกอย่างถาวรในฐานข้อมูล **PostgreSQL** ชื่อฐานข้อมูล `jobboard_db` บนพอร์ต `5432` ครับ/ค่ะ ซึ่งจัดเก็บเป็นตารางแบบ Relational Database ได้แก่ ตาราง `companies` และ `jobs` ครับ/ค่ะ"

---

### 7. "เมื่อผู้ใช้กดปุ่ม Delete (ลบประกาศงาน) เกิดกระบวนการอะไรขึ้นบ้างตั้งแต่ต้นจนจบ?"
* **คำตอบ (ตอบตามขั้นตอน Flow การทำงานจริง):**
  > 1. **(Frontend UI)**: ผู้ใช้กดปุ่ม 'ลบประกาศ' บนหน้า `JobDetailComponent` -> ระบบจะเปิด Modal ถามยืนยันเพื่อป้องกันการเผลอกดลบโดยไม่ได้ตั้งใจ
  > 2. **(Frontend Service)**: เมื่อกดยืนยัน คอมโพเนนต์จะเรียก `jobService.deleteJob(id)` ส่งคำขอ `DELETE /api/jobs/1` ไปยัง Backend
  > 3. **(Backend Controller)**: `JobsController.remove(@Param('id') id)` ได้รับ Request และแปลง id เป็นตัวเลข ส่งต่อให้ `jobsService.remove(id)`
  > 4. **(Backend Service & Prisma)**: `JobsService` สั่ง `prisma.job.delete({ where: { id } })` เพื่อทำการลบแถวข้อมูลในตาราง `jobs` บน PostgreSQL
  > 5. **(Response & Navigation)**: เมื่อ PostgreSQL ลบเสร็จ จะตอบกลับ Status 200 OK -> ฝั่ง Angular ได้รับการตอบรับ จึงแจ้งเตือน Alert ลบสำเร็จ และใช้ Angular Router นำทางผู้ใช้กลับไปที่หน้าหน้ารวมงาน (`/jobs`) โดยอัตโนมัติครับ/ค่ะ"

---

### 8. "Relation ของ Database ของกลุ่มนี้คืออะไร เชื่อมโยงกันอย่างไร?"
* **คำตอบ:**
  > "ความสัมพันธ์ในระบบของเราคือ **One-to-Many (1:N)** ระหว่าง **Company (บริษัท)** กับ **Job (ตำแหน่งงาน)** ครับ/ค่ะ:
  > - **1 Company สามารถลงประกาศงานได้หลายตำแหน่ง (Jobs)**
  > - **1 Job จะต้องสังกัดบริษัทเดียวเท่านั้น** โดยมี Foreign Key ชื่อ `companyId` ในตาราง `jobs` ชี้ไปยัง `id` ของตาราง `companies`
  > - และเราตั้งค่า `onDelete: Cascade` ไว้ เพื่อให้หากลบบริษัท ตำแหน่งงานทั้งหมดของบริษัทนั้นจะถูกลบตามอย่างถูกต้อง ไม่เกิดข้อมูลค้าง (Orphaned records) ครับ/ค่ะ"

---

### 9. "Business Rule (กฎทางธุรกิจ) ของระบบคืออะไร และถูกป้องกันไว้ที่ใดบ้าง?"
* **คำตอบ:**
  > "ระบบของเรามี Business Rules สำคัญ 2 ข้อ ซึ่งป้องกันไว้ **ทั้งฝั่ง Frontend และ Backend (Two-tier Enforcement)** ครับ/ค่ะ:
  > 
  > 1. **Stipend Consistency Rule (ความถูกต้องของค่าตอบแทน):**
  >    - เบี้ยเลี้ยงขั้นต่ำ (`stipendMin`) และเบี้ยเลี้ยงสูงสุด (`stipendMax`) ต้องมากกว่าหรือเท่ากับ 0
  >    - เบี้ยเลี้ยงสูงสุดต้องไม่น้อยกว่าเบี้ยเลี้ยงขั้นต่ำเสมอ (`stipendMax >= stipendMin`)
  >    - *การตรวจสอบ:* ฝั่ง Angular Form มี Custom Validator แจ้งเตือนสีแดงทันที และฝั่ง NestJS มีการตรวจสอบใน `JobsService` หากผิดเงื่อนไขจะโยน `400 Bad Request` ทันที
  > 
  > 2. **Job Status & Deadline Rule (การควบคุมสถานะปิดรับสมัคร):**
  >    - หากตำแหน่งงานมีสถานะเป็น `CLOSED` หรือพ้นกำหนดวันปิดรับสมัคร (`applicationDeadline < NOW`):
  >      ระบบจะเปลี่ยนป้ายสถานะเป็น 'ปิดรับสมัครแล้ว' และ **Disable ปุ่มส่งใบสมัครงาน (Apply Button)** เพื่อไม่ให้นักศึกษาส่งใบสมัครในงานที่ปิดไปแล้ว
  >    - และในหน้าค้นหางาน ตัวกรองเริ่มต้นจะแสดงเฉพาะงานที่ยังเปิดรับ (OPEN) เพื่อความสะดวกของผู้หางานครับ/ค่ะ"

---

## 👨‍💻 สรุปการเตรียมตัวตามบทบาท (4 Roles)
* **Member 1 (Frontend / UI):** เน้นอธิบาย Tailwind CSS, การจัด Grid/Flexbox, การทำ Responsive Mobile/Desktop, และการทำ Loading Skeleton / Error Alert / Empty State
* **Member 2 (Frontend / Integration):** เน้นอธิบาย `HttpClient`, `JobService`, RxJS `subscribe`, Reactive Forms Validation, และ Angular Routing
* **Member 3 (Backend):** เน้นอธิบาย NestJS Architecture, Controllers, Services, DTOs, การใช้ `class-validator`, และ Global ValidationPipe
* **Member 4 (Database / Integration):** เน้นอธิบาย Entity Relationship, `schema.prisma`, การเชื่อมต่อ PostgreSQL, คำสั่ง Migration และ Seeding Data
