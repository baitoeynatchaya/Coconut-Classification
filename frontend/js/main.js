import { apiRequest } from "./apiClient.js";

console.log("is worked");

const uploadContainer = document.getElementById("uploadContainer");
const fileInput = document.getElementById("fileInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const resultSection = document.getElementById("resultSection");
const loading = document.getElementById("loading");

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
    const uploadContent = uploadContainer.querySelector(".upload-content");
    uploadContent.innerHTML = `<img src="${e.target.result}" alt="Selected Image">`;
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

  loading.classList.remove("hidden");
  const formData = new FormData();
  formData.append("file", file);
  try {
    let result = await apiRequest("/predict-coconut", "POST", formData);
    console.info(result);

    resultSection.classList.remove("hidden");
    document.getElementById("predictedResult").textContent =
      result.predictedResult;
    document.getElementById("confidenceScore").textContent = (
      result.confidenceScore * 100
    ).toFixed(2);
  } finally {
    loading.classList.add("hidden");
  }
});
