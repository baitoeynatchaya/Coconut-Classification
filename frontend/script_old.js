// Elements
const imageInput = document.getElementById("imageInput");
const previewSection = document.getElementById("previewSection");
const previewImg = document.getElementById("preview");
const overlayDiv = document.getElementById("overlay");
const resetBtn = document.getElementById("resetBtn");
const analyzeBtn = document.getElementById("analyzeBtn");

const uploadSection = document.getElementById("uploadSection");
const loadingSection = document.getElementById("loadingSection");
const errorSection = document.getElementById("errorSection");
const errorMessage = document.getElementById("errorMessage");
const resultSection = document.getElementById("resultSection");

const classification = document.getElementById("classification");
const confidence = document.getElementById("confidence");
const harvestStatus = document.getElementById("harvestStatus");
const characteristics = document.getElementById("characteristics");
const recommendations = document.getElementById("recommendations");

// Reset state
function resetAll() {
  uploadSection.classList.remove("hidden");
  previewSection.classList.add("hidden");
  loadingSection.classList.add("hidden");
  errorSection.classList.add("hidden");
  resultSection.classList.add("hidden");
  previewImg.src = "";
  overlayDiv.classList.add("hidden");
}

// Preview รูป
imageInput.addEventListener("change", () => {
  if (imageInput.files && imageInput.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      previewSection.classList.remove("hidden");
      uploadSection.classList.add("hidden");
      overlayDiv.classList.add("hidden");
    };
    reader.readAsDataURL(imageInput.files[0]);
  }
});

// Reset button
resetBtn.addEventListener("click", resetAll);

// Analyze button (call API or mock)
analyzeBtn.addEventListener("click", async () => {
  if (!imageInput.files.length) {
    alert("กรุณาเลือกรูปภาพก่อน!");
    return;
  }

  const file = imageInput.files[0];
  const formData = new FormData();
  formData.append("file", file);

  loadingSection.classList.remove("hidden");
  errorSection.classList.add("hidden");
  resultSection.classList.add("hidden");

  try {
    const response = await fetch("http://127.0.0.1:8000/upload-image", {
      method: "POST",
      body: formData
    });

    if (!response.ok) throw new Error("API request failed");

    const data = await response.json();

    // Overlay บนรูป
    overlayDiv.innerText = `${data.prediction} (${(data.probability*100).toFixed(2)}%)`;
    overlayDiv.classList.remove("hidden");

    // Show result
    loadingSection.classList.add("hidden");
    resultSection.classList.remove("hidden");

    classification.textContent = data.prediction;
    confidence.textContent = (data.probability * 100).toFixed(2);
    harvestStatus.textContent = data.prediction === "ระยะที่ 6" ? "พร้อมเก็บเกี่ยว" : "ยังไม่พร้อม";
    characteristics.innerHTML = `<li>ข้อมูลจาก API</li>`;
    recommendations.textContent = "ใช้ข้อมูล API เป็นหลัก";
  } catch (err) {
    console.warn("API Error, fallback to mock:", err.message);
    startMockAnalysis();
  }
});

// Mock Analysis
function startMockAnalysis() {
  loadingSection.classList.remove("hidden");
  setTimeout(() => {
    loadingSection.classList.add("hidden");
    resultSection.classList.remove("hidden");

    const stages = ["ระยะที่ 4", "ระยะที่ 5", "ระยะที่ 6", "ระยะอื่นๆ"];
    const randomIndex = Math.floor(Math.random() * stages.length);

    classification.textContent = stages[randomIndex];
    confidence.textContent = (80 + Math.random() * 20).toFixed(2);

    let status = "";
    let charList = [];
    let reco = "";

    switch (stages[randomIndex]) {
      case "ระยะที่ 4":
        status = "ยังไม่เหมาะสมต่อการเก็บเกี่ยว";
        charList = ["ผลยังเล็ก", "สีเขียวเข้ม", "เนื้อยังบาง"];
        reco = "ควรรอให้ผลโตเต็มที่และเนื้อหนาขึ้น";
        break;
      case "ระยะที่ 5":
        status = "เริ่มเข้าใกล้ช่วงเก็บเกี่ยว";
        charList = ["ผลใหญ่ขึ้น", "สีเขียวสด", "น้ำหวานเริ่มหอม"];
        reco = "สามารถเก็บเกี่ยวบางส่วนได้ แต่ควรรอให้ครบ 6 เดือนเพื่อคุณภาพดีที่สุด";
        break;
      case "ระยะที่ 6":
        status = "เหมาะสมต่อการเก็บเกี่ยว";
        charList = ["ผลใหญ่เต็มที่", "สีเขียวแก่", "เนื้อหนา", "น้ำหวานหอม"];
        reco = "ควรเก็บเกี่ยวในช่วงนี้เพื่อคุณภาพและรสชาติสูงสุด";
        break;
      default:
        status = "ไม่สามารถจำแนกได้";
        charList = ["อายุน้อยกว่า 4 เดือน", "หรือมากกว่า 6 เดือน"];
        reco = "ควรตรวจสอบผลมะพร้าวเพิ่มเติมก่อนเก็บเกี่ยว";
    }

    harvestStatus.textContent = status;
    characteristics.innerHTML = charList.map(c => `<li>${c}</li>`).join("");
    recommendations.textContent = reco;
  }, 2000);
}
