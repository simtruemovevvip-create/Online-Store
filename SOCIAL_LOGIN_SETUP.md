# ตั้งค่าเข้าสู่ระบบด้วย Google และ Facebook

เอกสารนี้ใช้กับ Online-Store ที่ทำงานบน Google Apps Script โดยปุ่ม Social Login และการตรวจสอบ token ฝั่งเซิร์ฟเวอร์มีอยู่ในระบบแล้ว การเปิดใช้งานจริงจำเป็นต้องสร้าง OAuth/App credentials ของเจ้าของเว็บไซต์ และใส่ไว้ใน Script Properties ของ Apps Script เท่านั้น

> **ห้าม** ใส่ Client Secret, Facebook App Secret, access token หรือ id token ในไฟล์ HTML, Code.gs, GitHub, README หรือแชต

## 1. ตั้งค่า Google Login

1. เปิด [Google Cloud Console](https://console.cloud.google.com/) แล้วเลือกหรือสร้าง Project
2. ไปที่ Google Auth Platform และตั้งค่า Branding / Audience ให้เรียบร้อย
3. ไปที่ Clients แล้วสร้าง OAuth Client ID ชนิด **Web application**
4. ใน **Authorized JavaScript origins** ใส่ origin ที่หน้าเว็บใช้จริง โดยดูจาก address bar หลังเปิด Web App แล้วคัดลอกเฉพาะ protocol + hostname เช่น `https://script.google.com` หรือ `https://script.googleusercontent.com` (ไม่ใส่ path และไม่ใส่ `/exec`) หากระบบแสดงทั้งสอง host ให้เพิ่มทั้งสองค่า
5. คัดลอก Client ID ที่ลงท้ายด้วย `.apps.googleusercontent.com`

คู่มือ Google: [Create a Google Identity Services client ID](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid)

## 2. ตั้งค่า Facebook Login

1. เปิด [Meta for Developers](https://developers.facebook.com/apps/) แล้วสร้างหรือเลือก App
2. เพิ่มผลิตภัณฑ์ **Facebook Login** และเลือกการตั้งค่าสำหรับ Web
3. ใน App Settings > Basic กำหนด App Domains เป็น host ที่ Web App ใช้งานจริง (ไม่ใส่ protocol หรือ path)
4. ใน Facebook Login settings เปิดการใช้งาน JavaScript SDK / Web OAuth ตามหน้าตั้งค่าของ App และอนุญาต domain เดียวกัน
5. ตั้ง App ให้เป็น Live เมื่อผ่านการทดสอบและทำข้อกำหนดของ Meta ครบแล้ว ใน Development mode ให้ทดสอบด้วยบัญชีที่เป็น App role/tester เท่านั้น
6. คัดลอก **App ID** และ **App Secret** เก็บไว้ในที่ปลอดภัย

คู่มือ Meta: [Facebook Login](https://developers.facebook.com/docs/facebook-login/) และ [JavaScript SDK Quickstart](https://developers.facebook.com/docs/javascript/quickstart/)

## 3. ใส่ค่าลง Apps Script Script Properties

เปิด Apps Script ของโปรเจกต์ Online-Store แล้วไปที่ **Project Settings > Script Properties** เพิ่มค่าต่อไปนี้:

| Property | Value |
|---|---|
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `FACEBOOK_APP_ID` | Meta/Facebook App ID |
| `FACEBOOK_APP_SECRET` | Meta/Facebook App Secret |
| `FACEBOOK_GRAPH_VERSION` | `v27.0` (ไม่บังคับ; หากไม่ใส่ระบบใช้ค่าเริ่มต้นนี้) |

ไม่ต้องสร้าง `GOOGLE_CLIENT_SECRET` สำหรับ Google Identity Services flow ที่โค้ดนี้ใช้อยู่ และ **ห้าม** ส่ง Facebook App Secret ไปยังหน้าเว็บ

## 4. อนุญาต UrlFetch และเผยแพร่ Web App

1. ใน Apps Script Editor เลือกฟังก์ชัน `authorizeSocialLoginServices` แล้วกด Run ด้วยบัญชีเจ้าของ Script
2. อนุญาตสิทธิ์ที่ Google ขอ ระบบใช้ UrlFetchApp ตรวจ token จาก Google และ Meta
3. เปิด Deploy > Manage deployments แล้วแก้ไข Web App deployment ให้ใช้เวอร์ชันล่าสุด (Execute as: Me; การเข้าถึงต้องอนุญาตกลุ่มผู้ใช้ของร้านค้าที่ต้องการให้ล็อกอิน)
4. เปิดหน้าเข้าสู่ระบบลูกค้าใหม่แล้วรีเฟรชหน้า ปุ่ม Google/Facebook จะเปิดใช้งานเมื่อพบค่าที่จำเป็นครบ

## 5. ตรวจสอบผล

- Google: กดปุ่ม Google และเลือกบัญชีที่อีเมลผ่านการยืนยันแล้ว
- Facebook: กดปุ่ม Facebook และอนุญาต `public_profile` และ `email`
- ระบบจะตรวจ token ฝั่ง Apps Script ก่อนสร้าง Session และสร้างบัญชีลูกค้าใหม่เมื่อยังไม่เคยผูก provider นี้
- หากพบอีเมลที่มีบัญชีเดิมอยู่แล้ว ระบบจะไม่ผูกบัญชีให้อัตโนมัติ เพื่อป้องกันการยึดบัญชี ให้เข้าสู่ระบบด้วยวิธีเดิมก่อน

## ขอบเขตปัจจุบัน

Social Login ในชุดโค้ดนี้เชื่อมกับ **บัญชีลูกค้า** ผ่านหน้าเข้าสู่ระบบลูกค้า ส่วนบัญชีผู้ดูแลระบบ/เจ้าของระบบยังคงใช้ชื่อผู้ใช้และรหัสผ่านตามเดิมเพื่อแยกสิทธิ์ความปลอดภัย
