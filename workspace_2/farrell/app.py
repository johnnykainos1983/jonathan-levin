import os
import sqlite3
import uuid
import modal
from modal.mount import Mount
from modal.volume import Volume
from fastapi import FastAPI, HTTPException, Request, UploadFile, File, Form, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import FileResponse
from typing import List, Optional

# --- Modal Configuration ---
app = modal.App("farrell-real-estate-v4")
image = (
    modal.Image.debian_slim()
    .pip_install("fastapi", "uvicorn", "pydantic", "python-multipart")
    .add_local_dir("./dist_v4", remote_path="/dist_v4")
)
volume = Volume.from_name("farrell-assets-v4", create_if_missing=True)

# Path for the database inside the Volume
DB_PATH = "/assets/properties.db"
UPLOADS_DIR = "/assets/uploads"

# --- Backend Logic ---
web_app = FastAPI()

# Allow CORS for development
web_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Property(BaseModel):
    id: str
    title: str
    location: str
    price: str
    beds: int
    baths: int
    sqm: int
    image: str
    category: str

class Lead(BaseModel):
    name: str
    email: str
    phone: str
    interest: str
    message: Optional[str] = None

class LoginRequest(BaseModel):
    password: str

# Database Initialization
def init_db():
    os.makedirs(UPLOADS_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS properties (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            location TEXT NOT NULL,
            price TEXT NOT NULL,
            beds INTEGER NOT NULL,
            baths INTEGER NOT NULL,
            sqm INTEGER NOT NULL,
            image TEXT NOT NULL,
            category TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS leads (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            interest TEXT NOT NULL,
            message TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Seed data
    cursor.execute("SELECT COUNT(*) FROM properties")
    if cursor.fetchone()[0] == 0:
        initial_properties = [
            ('1', 'Clifton Modern Masterpiece', 'Clifton, Cape Town', 'R15,000,000', 5, 6, 850, 'https://picsum.photos/seed/clifton/800/600', 'Coastal'),
            ('2', 'Bishopscourt Heritage Estate', 'Bishopscourt, Cape Town', 'R8,000,000', 7, 5, 1200, 'https://picsum.photos/seed/bishopscourt/800/600', 'Heritage'),
            ('3', 'Waterfront Penthouse', 'V&A Waterfront, Cape Town', 'R5,000,000', 3, 3, 450, 'https://picsum.photos/seed/waterfront/800/600', 'Urban')
        ]
        cursor.executemany("INSERT INTO properties (id, title, location, price, beds, baths, sqm, image, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", initial_properties)
    
    # Update any existing records from $ to R
    cursor.execute("UPDATE properties SET price = REPLACE(price, '$', 'R') WHERE price LIKE '$%'")
    
    conn.commit()
    conn.close()

# --- API Routes ---

@web_app.post("/api/login")
async def login(req: LoginRequest):
    if req.password == "farrell2026":
        return {"status": "success"}
    raise HTTPException(status_code=401, detail="Unauthorized")

@web_app.get("/api/properties", response_model=List[Property])
async def get_properties():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM properties ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

@web_app.post("/api/leads")
async def capture_lead(lead: Lead):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    id = str(uuid.uuid4())[:8]
    cursor.execute("""
        INSERT INTO leads (id, name, email, phone, interest, message)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (id, lead.name, lead.email, lead.phone, lead.interest, lead.message))
    conn.commit()
    conn.close()
    
    # --- NOTIFICATION SYSTEM ---
    # This is where Farrell gets notified. 
    # For now, we log it. To enable actual email, add an SMTP or SendGrid call here.
    print(f"NEW LEAD CAPTURED: {lead.name} ({lead.email}) - Interest: {lead.interest}")
    
    return {"status": "success", "id": id}

@web_app.post("/api/properties")
async def add_property(
    title: str = Form(...),
    location: str = Form(...),
    price: str = Form(...),
    beds: int = Form(...),
    baths: int = Form(...),
    sqm: int = Form(...),
    category: str = Form(...),
    image: Optional[str] = Form(None),
    imageFile: Optional[UploadFile] = File(None)
):
    id = str(uuid.uuid4())[:8]
    final_image = image
    
    if imageFile:
        file_path = f"{UPLOADS_DIR}/{id}_{imageFile.filename}"
        with open(file_path, "wb") as buffer:
            buffer.write(await imageFile.read())
        final_image = f"/uploads/{id}_{imageFile.filename}"
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO properties (id, title, location, price, beds, baths, sqm, image, category)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (id, title, location, price, beds, baths, sqm, final_image, category))
    conn.commit()
    conn.close()
    
    return {"id": id, "status": "success"}

# Serve uploads
@web_app.get("/uploads/{filename}")
async def serve_upload(filename: str):
    file_path = f"{UPLOADS_DIR}/{filename}"
    if os.path.exists(file_path):
        return FileResponse(file_path)
    raise HTTPException(status_code=404)

# Serve Frontend
@web_app.get("/{rest_of_path:path}")
async def serve_frontend(rest_of_path: str):
    # Static files check
    dist_path = f"/dist_v4/{rest_of_path}"
    if rest_of_path and os.path.exists(dist_path) and os.path.isfile(dist_path):
        return FileResponse(dist_path)
    
    # Catch-all for SPA (return index.html)
    index_path = "/dist_v4/index.html"
    if os.path.exists(index_path):
        return FileResponse(index_path)
    
    return {"detail": "Frontend not found"}

# --- Modal Wrapper ---

@app.function(
    image=image,
    volumes={"/assets": volume}
)
@modal.asgi_app()
def farrell_app():
    os.makedirs(UPLOADS_DIR, exist_ok=True)
    init_db()
    return web_app
