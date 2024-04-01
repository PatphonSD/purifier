
## Monorepo Purifier: โปรเจคเครื่องฟอกอากาศ

**Purifier** เป็น monorepo สำหรับพัฒนาเครื่องฟอกอากาศอัจฉริยะ โปรเจคนี้ประกอบไปด้วย:

* **Backend:** ควบคุมการทำงานของเครื่องฟอกอากาศ เก็บข้อมูล และเชื่อมต่อกับ MQTT
* **Frontend:** แสดงผลข้อมูลและควบคุมเครื่องฟอกอากาศผ่านเว็บ

### การโคลน

1. ติดตั้ง Git
2. โคลน monorepo ไปยังเครื่องของคุณ

```
git clone https://github.com/PatphonSD/purifier.git
```

### การเริ่มต้นใช้งาน

**Backend:**

1. ติดตั้ง Docker
2. สร้าง image Docker

```
docker-compose build
```

3. รัน backend

```
docker-compose up -d
```

**Frontend:**

1. ติดตั้ง Node.js
2. ติดตั้ง dependencies

```
cd frontend
npm install
```

3. รัน frontend

```
npm run start
```

### การเชื่อมต่อกับ MQTT

1. ตั้งค่า MQTT broker ของคุณ
2. แก้ไขไฟล์ `backend/config.js`
   * ตั้งค่า `MQTT_HOST` เป็น hostname หรือ IP address ของ MQTT broker
   * ตั้งค่า `MQTT_PORT` เป็น port ของ MQTT broker
   * ตั้งค่า `MQTT_USERNAME` และ `MQTT_PASSWORD` (ถ้ามี)
3. รัน backend อีกครั้ง

```
docker-compose restart backend
```

### เอกสารประกอบ

* **Backend:** ดู README ใน `backend` directory
* **Frontend:** ดู README ใน `frontend` directory

### บทสรุป

Purifier เป็น monorepo ที่ช่วยให้คุณพัฒนาเครื่องฟอกอากาศอัจฉริยะ โปรเจคนี้ประกอบไปด้วย backend และ frontend

**หมายเหตุ:**

* ปรับแต่ง monorepo ตามความต้องการของคุณ
* ศึกษาเพิ่มเติมเกี่ยวกับ MQTT และ Docker

**แจ้งให้เราทราบหากมีคำถามเพิ่มเติม!**
