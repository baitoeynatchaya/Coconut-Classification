import { apiRequest } from "./apiClient.js";

console.log("is worked")

const uploadContainer = document.getElementById("uploadContainer");
const fileInput = document.getElementById("fileInput");
const analyzeBtn = document.getElementById("analyzeBtn");

uploadContainer.addEventListener("click", () => {
  console.log("click")
  fileInput.click();
});

fileInput.addEventListener("change", () => {
    
    const file = fileInput.files[0];
    if (!file) return;

    // Only allow image files
    if (!file.type.startsWith("image/")) {
        alert("Please select an image file.");
        return;
    }

    // Display a preview
    const reader = new FileReader();
    reader.onload = function (e) {
        uploadContainer.innerHTML = `<img src="${e.target.result}" alt="Selected Image">`;
    };
    reader.readAsDataURL(file);
});

analyzeBtn.addEventListener("click", async () => {
    console.log("analyze click");
    const result = await apiRequest("");
    console.info(result);
})