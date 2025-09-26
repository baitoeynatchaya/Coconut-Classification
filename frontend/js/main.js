import { apiRequest } from "./apiClient.js";

console.log("is worked");

const uploadContainer = document.getElementById("uploadContainer");
const fileInput = document.getElementById("fileInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const resultSection = document.getElementById("resultSection");
const loading = document.getElementById("loading");

let fileData = null;
uploadContainer.addEventListener("click", () => {
  console.log(uploadContainer);
  console.log("click");
  fileInput.click();
});

fileInput.addEventListener("change", async () => {
  if (fileInput.files.length > 1) {
    alert("Please select only one image file.");
    return;
  }

  const file = fileInput.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please select an image file.");
    return;
  }

  // Store file data as ArrayBuffer for reuse
  try {
    const arrayBuffer = await file.arrayBuffer();
    fileData = {
      buffer: arrayBuffer,
      name: file.name,
      type: file.type,
      size: file.size,
    };

    console.log("File data cached:", fileData.name, fileData.size);
  } catch (error) {
    console.error("Error reading file:", error);
    alert("Error reading file. Please try again.");
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

  if (!fileData) {
    alert("Please upload image first");
    return;
  }

  console.log("Using cached file data:", fileData.name, fileData.size);

  loading.classList.remove("hidden");

  try {
    // Create a new File object from cached data
    const file = new File([fileData.buffer], fileData.name, {
      type: fileData.type,
      lastModified: Date.now(),
    });

    // Create FormData with the new file object
    const formData = new FormData();
    formData.append("file", file);

    console.log(
      "FormData created with fresh file object:",
      file.name,
      file.size
    );

    let result = await apiRequest("/predict-coconut", "POST", formData);
    console.info(result);

    resultSection.classList.remove("hidden");
    document.getElementById("predictedResult").textContent =
      result.predictedResult;
    document.getElementById("confidenceScore").textContent = (
      result.confidenceScore * 100
    ).toFixed(2);
  } catch (error) {
    console.error("Analysis failed:", error);
    alert("Analysis failed. Please try again.");
  } finally {
    loading.classList.add("hidden");
  }
});
