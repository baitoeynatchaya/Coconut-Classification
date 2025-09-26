import os
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import shutil
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import uvicorn

# สร้าง FastAPI app 
app = FastAPI()

os.makedirs("uploads", exist_ok=True)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="localhost", 
        port=5000, 
        reload=True
    )

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)
# --- โหลดโมเดลตอนเริ่ม (global) ---
MODEL_PATH = "best_coconut_vgg19_softmax_model (1).keras"
model = load_model(MODEL_PATH)

# --- Class labels ---
CLASS_LABELS = ['stage4', 'stage5', 'stage6', 'other']

# root endpoint
@app.get("/")
def read_root():
    return {"message": "Hello FastAPI! 🚀"}

# endpoint สำหรับส่งข้อความกลับ
@app.get("/echo/{text}")
def echo(text: str):
    return {"you_sent": text}

# endpoint แบบ POST
@app.post("/predict")
def predict(data: dict):
    # สมมุติว่าเราจะคืนค่ากลับไป
    print("test\n")
    model.summary()
    return {"received_data": data, "status": "success"}

# --- API อัปโหลดรูปและ predict ---
@app.post("/predict-coconut")
async def upload_image(file: UploadFile = File(...)):
    os.makedirs("uploads", exist_ok=True)
    file_path = os.path.join("uploads", file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # --- Preprocess รูป ---
    img = image.load_img(file_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) / 255.0
   
    # --- Predict ---
    predictions = model.predict(img_array)
    pred_class = CLASS_LABELS[np.argmax(predictions)]
    print(predictions)
    pred_prob = float(np.max(predictions))
 
    return {
        "predictedResult": pred_class,
        "confidenceScore": pred_prob
    }