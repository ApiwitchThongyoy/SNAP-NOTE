import express from "express";
import bcrypt from "bcryptjs";
import db from "./db.js"; // Import การเชื่อมต่อฐานข้อมูลที่เราสร้างไว้

const app = express();
const port = 3001; // หรือ Port อื่นๆ ที่คุณต้องการ

// Middleware เพื่อให้ Express อ่านข้อมูลแบบ JSON จาก Request Body ได้
app.use(express.json());

// สร้าง API Endpoint สำหรับการลงทะเบียน (Register/Sign Up)
// ใช้เมธอด POST เพราะเป็นการ "สร้าง" ข้อมูลใหม่
app.post("/api/register", async (req, res) => {
  try {
    // 1. รับข้อมูลจากหน้าฟอร์ม (Request Body)
    const { username, email, password } = req.body;

    // ตรวจสอบว่าข้อมูลครบถ้วนหรือไม่
    if (!username || !email || !password) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    // 2. เข้ารหัสรหัสผ่าน (Hashing) เพื่อความปลอดภัย
    const salt = await bcrypt.genSalt(10); // สร้างตัวสุ่มเพื่อเพิ่มความปลอดภัย
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. สร้างคำสั่ง SQL เพื่อบันทึกข้อมูลลงตาราง users
    // (สมมติว่าคุณมีตารางชื่อ users และมีคอลัมน์ id, username, email, password)
    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    const values = [username, email, hashedPassword];

    // 4. ส่งคำสั่ง SQL ไปยังฐานข้อมูล
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล:", err);
        // อาจจะเกิดจาก username หรือ email ซ้ำ
        return res.status(500).json({ message: "ไม่สามารถลงทะเบียนได้" });
      }

      // 5. ส่งผลลัพธ์กลับไปให้ Client (Frontend)
      console.log("บันทึกข้อมูลผู้ใช้ใหม่สำเร็จ:", result);
      res.status(201).json({ message: "ลงทะเบียนสำเร็จ!" });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "มีข้อผิดพลาดเกิดขึ้นในเซิร์ฟเวอร์" });
  }
});

// เริ่มการทำงานของเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});