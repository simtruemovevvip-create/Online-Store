import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Application root element #app was not found.");
}

app.innerHTML = `
  <main class="shell">
    <section class="panel" aria-labelledby="app-title">
      <div class="brand-mark" aria-hidden="true">OS</div>
      <p class="eyebrow">ONLINE STORE PLATFORM</p>
      <h1 id="app-title">เตรียมระบบร้านค้าออนไลน์</h1>
      <p class="intro">
        โครงสร้าง Frontend ใหม่พร้อมใช้งานสำหรับการพัฒนาต่อ
        ระบบเดิมยังคงอยู่ใน Google Apps Script ระหว่างการย้ายระบบ
      </p>
      <div class="status-row">
        <span class="status-dot"></span>
        <span>Frontend foundation พร้อมสำหรับการพัฒนา</span>
      </div>
      <p class="note">
        หน้านี้เป็นหน้าเริ่มต้นสำหรับตรวจสอบการ Build เท่านั้น
        ยังไม่ได้เชื่อมต่อฐานข้อมูลหรือระบบเข้าสู่ระบบจริง
      </p>
    </section>
  </main>
`;
