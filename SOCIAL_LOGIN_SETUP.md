# ตั้งค่าเข้าสู่ระบบด้วย Google และ Facebook

เอกสารนี้ใช้กับ Online-Store ที่ทำงานบน Google Apps Script โดยปุ่ม Social Login และการตรวจสอบ token ฝั่งเซิร์ฟเวอร์มีอยู่ในระบบแล้ว การเปิดใช้งานจริงจำเป็นต้องสร้าง OAuth/App credentials ของเจ้าของเว็บไซต์ และใส่ไว้ใน Script Properties ของ Apps Script เท่านั้น

> **ห้าม** ใส่ Client Secret, Facebook App Secret, access token หรือ id token ในไฟล์ HTML, Code.gs, GitHub, README หรือแชต

## 1. ตั้งค่า Google Login

1. เปิด [Google Cloud Console](https://console.cloud.google.com/) แล้วเลือกหรือสร้าง Project
2. ไปที่ Google Auth Platform และตั้งค่า Branding / Audience ให้เรียบร้อย
3. ไปที่ Clients แล้วสร้าง OAuth Client ID ชนิด **Web application**
4. ตรวจ origin จริงที่หน้าเว็บกำลังรัน โดยเปิด DevTools Console (กด F12 > Console) แล้วพิมพ์ `location.origin` คัดลอกผลลัพธ์แบบเต็มเฉพาะ origin ซึ่งต้องมี `https://` และไม่มี path/query
5. ใน **Authorized JavaScript origins** เพิ่ม origin นั้น เช่น หากกำลังทดสอบ Vercel Preview ของ PR นี้และ address bar ใช้โดเมนดังกล่าว ให้เพิ่ม `https://onlinestorevip-git-unified-login-simtruemovevvip-1638s-projects.vercel.app` (ใช้เฉพาะเมื่อเป็น URL ที่เปิดอยู่จริง) แล้วเพิ่ม production domain แยกอีกหนึ่งรายการเมื่อมีโดเมนจริง
6. คัดลอก Client ID ที่ลงท้ายด้วย `.apps.googleusercontent.com`

**สำคัญสำหรับ Apps Script:** Google ไม่อนุญาตให้ลงทะเบียน host ที่ลงท้ายด้วย `googleusercontent.com` เป็น Authorized JavaScript Origin หาก `location.origin` ของหน้า HTML Service เป็น host ดังกล่าว การใช้ Google Identity Services แบบ JavaScript popup ใน iframe นั้นจะไม่สามารถแก้ได้ด้วยการเพิ่ม origin นี้ ให้ทดสอบจาก frontend บนโดเมน HTTPS ที่คุณควบคุม (เช่น Vercel/custom domain) หรือเปลี่ยนเป็น OAuth authorization-code/redirect flow ที่มี callback URL ที่ลงทะเบียนได้ อย่าใส่ `https://script.googleusercontent.com` ลงใน Authorized JavaScript origins เพราะ Google ปฏิเสธโดเมนนี้

คู่มือ Google: [Create a Google Identity Services client ID](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid)

## 2. ตั้งค่า Facebook Login

1. เปิด [Meta for Developers](https://developers.facebook.com/apps/) แล้วสร้างหรือเลือก App
2. เพิ่มผลิตภัณฑ์ **Facebook Login** และเลือกการตั้งค่าสำหรับ Web
3. ใน App Settings > Basic กำหนด App Domains เป็น hostname ที่ Web App ใช้งานจริง (ไม่ใส่ protocol หรือ path)
4. ใน Facebook Login settings เปิด **Login with the JavaScript SDK = Yes** และเพิ่ม hostname ที่หน้าเว็บใช้งานอยู่ใน **Allowed Domains for the JavaScript SDK** (ไม่ใส่ path) หากทดสอบ PR Preview ให้เพิ่ม `onlinestorevip-git-unified-login-simtruemovevvip-1638s-projects.vercel.app` เฉพาะเมื่อ address bar ใช้ host นี้จริง และเพิ่ม production host แยกต่างหาก
5. ตรวจให้แน่ใจว่า App ID ใน Script Properties เป็น App เดียวกับ App ID ในหน้า Meta
6. ตั้ง App ให้เป็น Live เมื่อผ่านการทดสอบและทำข้อกำหนดของ Meta ครบแล้ว ใน Development mode ให้ทดสอบด้วยบัญชีที่เป็น App role/tester เท่านั้น
7. คัดลอก **App ID** และ **App Secret** เก็บไว้ในที่ปลอดภัย

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
4. เปิดหน้าเข้าสู่ระบบใหม่แล้วรีเฟรชหน้า ปุ่ม Google/Facebook จะเปิดใช้งานเมื่อพบค่าที่จำเป็นครบ

## 5. ตรวจสอบผล

- Google: กดปุ่ม Google และเลือกบัญชีที่อีเมลผ่านการยืนยันแล้ว
- Facebook: กดปุ่ม Facebook และอนุญาต `public_profile` และ `email`
- ระบบจะตรวจ token ฝั่ง Apps Script ก่อนสร้าง Session และสร้างบัญชีลูกค้าใหม่เมื่อยังไม่เคยผูก provider นี้
- หากพบอีเมลที่มีบัญชีเดิมอยู่แล้ว ระบบจะไม่ผูกบัญชีให้อัตโนมัติ เพื่อป้องกันการยึดบัญชี ให้เข้าสู่ระบบด้วยวิธีเดิมก่อน

## ขอบเขตปัจจุบัน

Social Login ในชุดโค้ดนี้เชื่อมกับ **บัญชีลูกค้า** ผ่านหน้าเข้าสู่ระบบลูกค้า ส่วนบัญชีเจ้าของระบบยังคงใช้ชื่อผู้ใช้และรหัสผ่านตามเดิมเพื่อแยกสิทธิ์ความปลอดภัย
