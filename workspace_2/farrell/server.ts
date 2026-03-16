import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const db = new Database("properties.db");

// Initialize database
db.exec(`
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
`);

// Seed initial data if empty
const count = db.prepare("SELECT COUNT(*) as count FROM properties").get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO properties (id, title, location, price, beds, baths, sqm, image, category)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const initialProperties = [
    ['1', 'Clifton Modern Masterpiece', 'Clifton, Cape Town', '$15,000,000', 5, 6, 850, 'https://picsum.photos/seed/clifton/800/600', 'Coastal'],
    ['2', 'Bishopscourt Heritage Estate', 'Bishopscourt, Cape Town', '$8,000,000', 7, 5, 1200, 'https://picsum.photos/seed/bishopscourt/800/600', 'Heritage'],
    ['3', 'Waterfront Penthouse', 'V&A Waterfront, Cape Town', '$5,000,000', 3, 3, 450, 'https://picsum.photos/seed/waterfront/800/600', 'Urban']
  ];

  for (const p of initialProperties) {
    insert.run(...p);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use("/uploads", express.static(uploadsDir));

  // API Routes
  app.get("/api/properties", (req, res) => {
    const properties = db.prepare("SELECT * FROM properties ORDER BY created_at DESC").all();
    res.json(properties);
  });

  app.post("/api/properties", upload.single("imageFile"), (req, res) => {
    const { title, location, price, beds, baths, sqm, image, category } = req.body;
    const id = Math.random().toString(36).substring(2, 11);
    
    // Use uploaded file path if available, otherwise use provided URL
    const finalImage = req.file ? `/uploads/${req.file.filename}` : image;
    
    try {
      const insert = db.prepare(`
        INSERT INTO properties (id, title, location, price, beds, baths, sqm, image, category)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insert.run(id, title, location, price, beds, baths, sqm, finalImage, category);
      
      const newProperty = db.prepare("SELECT * FROM properties WHERE id = ?").get(id);
      res.status(201).json(newProperty);
    } catch (error) {
      console.error("Error adding property:", error);
      res.status(500).json({ error: "Failed to add property" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
