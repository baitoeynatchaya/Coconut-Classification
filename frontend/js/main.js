import { apiRequest } from "./apiClient.js";

console.log("is worked")

const uploadContainer = document.getElementById("uploadContainer");
const fileInput = document.getElementById("fileInput");
const analyzeBtn = document.getElementById("analyzeBtn");
let file = null;

uploadContainer.addEventListener("click", () => {
    console.log(uploadContainer);
    console.log("click")
    fileInput.click();
});

fileInput.addEventListener("change", () => {
    if(fileInput.files.length>1){
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

// analyzeBtn.addEventListener("click", async () => {
//     console.log("analyze click");
//     const result = await apiRequest("");
//     console.info(result);
// })

analyzeBtn.addEventListener("click", async () => {
    console.log("analyze click");
    if(!file){
        alert("Please upload image first")
        return;
    }
    const formData = new FormData();
    formData.append("file", file);
    console.log(file);
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }
    const result = await apiRequest("/upload-image","POST", formData);
    console.info(result);
})