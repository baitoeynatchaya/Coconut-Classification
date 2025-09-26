import { apiRequest } from "./apiClient.js";

console.log("is worked");

const uploadContainer = document.getElementById("uploadContainer");
const fileInput = document.getElementById("fileInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const resultSection = document.getElementById("resultSection");
let file = null;

uploadContainer.addEventListener("click", () => {
  console.log(uploadContainer);
  console.log("click");
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 1) {
    alert("Please select only one image file.");
    return;
  }
  file = fileInput.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    alert("Please select an image file.");
    return;
  }
  const reader = new FileReader();
  reader.onload = function (e) {
    uploadContainer.innerHTML = `<img src="${e.target.result}" alt="Selected Image">`;
  };
  reader.readAsDataURL(file);
});

analyzeBtn.addEventListener("click", async () => {
  console.log("analyze click");
  console.log("file:", file);

  if (!file) {
    alert("Please upload image first");
    return;
  }
  // const blob = new Blob([file], { type: file.type });

  const formData = new FormData();
  formData.append("file", file);

  let result = await apiRequest("/upload-image", "POST", formData);
  console.info(result);

  resultSection.classList.remove("hidden");
  document.getElementById("predictedResult").textContent =
    result.predictedResult;
  document.getElementById("confidenceScore").textContent = (
    result.confidenceScore * 100
  ).toFixed(2);
});
