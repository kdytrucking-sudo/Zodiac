// --- Firebase Web SDK（CDN 版本）---
// 注意：我们用的是 CDN，而不是 npm 包，因为这个项目没有 Vite/Webpack。
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// --- 你的 Firebase Web App 配置（来自控制台 Zodiac 这个 Web 应用） ---
const firebaseConfig = {
  apiKey: "AIzaSyDxBk4psobp1BTrlUKhmfWl4aKAF26gU",
  authDomain: "studio-4395392521-1abeb.firebaseapp.com",
  projectId: "studio-4395392521-1abeb",
  storageBucket: "studio-4395392521-1abeb.firebasestorage.app",
  messagingSenderId: "4133532569115", // 如果和控制台不一致，以控制台为准
  appId: "1:4133532569115:web:afa287808769758b5382be"
};

// --- 初始化 Firebase 前端 ---
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "zodia1");
export const auth = getAuth(app);

logDebug("Firebase initialized");
logDebug(`projectId: ${firebaseConfig.projectId}`);

// --- 调用后端 API，获取今天的 Zodiac 结果 ---
async function loadTodayZodiac() {
  const statusEl = document.getElementById("status");
  const resultEl = document.getElementById("result");
  const dateEl = document.getElementById("zodiac-date");
  const signEl = document.getElementById("zodiac-sign");
  const luckEl = document.getElementById("zodiac-luck");
  const messageEl = document.getElementById("zodiac-message");

  statusEl.textContent = "Loading from backend /api/zodiac/today ...";
  resultEl.classList.add("hidden");

  try {
    const res = await fetch("/api/zodiac/today");
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();

    logDebug("Backend response:", data);

    dateEl.textContent = data.date || "-";
    signEl.textContent = data.sign || "-";
    luckEl.textContent = data.luck || "-";
    messageEl.textContent = data.message || "";

    statusEl.textContent = "Loaded successfully ✅";
    resultEl.classList.remove("hidden");
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Failed to load from backend ❌";
    logDebug("Error calling /api/zodiac/today:", err.message || err);
  }
}

// 简单的调试日志输出到页面
function logDebug(...args) {
  const el = document.getElementById("debug-log");
  if (!el) return;
  const line = args
    .map((v) => (typeof v === "string" ? v : JSON.stringify(v, null, 2)))
    .join(" ");
  el.textContent += line + "\n";
}

// 页面加载完就调用一次
window.addEventListener("DOMContentLoaded", () => {
  logDebug("DOM ready, loading today zodiac…");
  loadTodayZodiac();
});
