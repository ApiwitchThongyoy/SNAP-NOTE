import express from "express";
import bcrypt from "bcryptjs";
import db from "../db.js"; // Import การเชื่อมต่อฐานข้อมูล (สังเกตว่าต้องใช้ ../ เพื่อถอยกลับไป 1 โฟลเดอร์)

// สร้าง Router object เพื่อจัดการเส้นทางต่างๆ
const router = express.Router();

// URL: POST /api/register
// (เรากำหนดแค่ "/register" เพราะ "/api" ถูกกำหนดไว้ในไฟล์หลักแล้ว)
router.post("/register", async (req, res) => {
  try {
    // 1. รับข้อมูลจากหน้าฟอร์ม (Request Body)
    const { username, email, password } = req.body;

    // ตรวจสอบว่าข้อมูลครบถ้วนหรือไม่
    if (!username || !email || !password) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    // 2. ตรวจสอบว่ามี email นี้ในระบบแล้วหรือยัง (Optional but recommended)
    const checkEmailSql = "SELECT * FROM users WHERE email = ?";
    db.query(checkEmailSql, [email], async (err, data) => {
      if (err) {
         return res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
      }
      if (data.length > 0) {
        return res.status(409).json({ message: "อีเมลนี้ถูกใช้งานแล้ว" });
      }

      // ถ้าอีเมลยังไม่ถูกใช้ ก็ทำขั้นตอนต่อไป
      // 3. เข้ารหัสรหัสผ่าน (Hashing)
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // 4. สร้างคำสั่ง SQL เพื่อบันทึกข้อมูล
      const insertSql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
      const values = [username, email, hashedPassword];

      // 5. ส่งคำสั่ง SQL ไปยังฐานข้อมูล
      db.query(insertSql, values, (err) => {
        if (err) {
          console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล:", err);
          return res.status(500).json({ message: "ไม่สามารถลงทะเบียนได้" });
        }
        
        // 6. ส่งผลลัพธ์กลับไป
        return res.status(201).json({ message: "ลงทะเบียนสำเร็จ!" });
      });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "มีข้อผิดพลาดเกิดขึ้นในเซิร์ฟเวอร์" });
  }
});

// เพิ่ม API อื่นๆ ได้ที่นี่ เช่น router.post("/login", ...)

// ส่งออก router เพื่อให้ไฟล์หลัก (index.js) นำไปใช้ได้
export default router;

