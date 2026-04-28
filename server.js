const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

app.use(express.json({ limit: "2mb" }));
app.use(express.static(__dirname));

const DEFAULT_LISTINGS = [
  { id:"FB-1001", name:"Biryani & Raita", emoji:"🍛", qty:40, type:"Non-Veg", source:"Wedding", city:"Hyderabad", area:"Banjara Hills", mins:45, status:"available", tags:["Spicy","Rice"], postedAt:new Date().toISOString() },
  { id:"FB-1002", name:"Wedding Buffet", emoji:"🍽️", qty:120, type:"Mixed", source:"Wedding", city:"Bangalore", area:"Koramangala", mins:90, status:"available", tags:["Variety","Fresh"], postedAt:new Date().toISOString() },
  { id:"FB-1003", name:"Dal & Roti", emoji:"🫓", qty:25, type:"Veg", source:"Hostel", city:"Mumbai", area:"Andheri", mins:0, status:"claimed", tags:["Vegan","Simple"], postedAt:new Date().toISOString() },
  { id:"FB-1004", name:"Veg Thali", emoji:"🥘", qty:60, type:"Veg", source:"Restaurant", city:"Delhi", area:"Connaught Place", mins:30, status:"available", tags:["Balanced","Hot"], postedAt:new Date().toISOString() }
];

function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(
      DB_FILE,
      JSON.stringify(
        { listings: DEFAULT_LISTINGS, claims: [], volunteers: [], alerts: [] },
        null,
        2
      )
    );
  }
}

function readDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function writeDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function makeId(prefix) {
  return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`;
}

function foodEmoji(type) {
  return {
    Veg: "🥘",
    Vegetarian: "🥘",
    "Non-Veg": "🍗",
    "Non-Vegetarian": "🍗",
    Vegan: "🥦",
    Mixed: "🍽️"
  }[type] || "🍱";
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true, app: "FoodBridge API" });
});

app.get("/api/listings", (req, res) => {
  const db = readDb();
  let listings = db.listings;

  const { status, q, type, city } = req.query;

  if (status) listings = listings.filter(l => l.status === status);
  if (type) listings = listings.filter(l => (l.type || "").toLowerCase() === String(type).toLowerCase());
  if (city) listings = listings.filter(l => (l.city || "").toLowerCase().includes(String(city).toLowerCase()));

  if (q) {
    const query = String(q).toLowerCase();
    listings = listings.filter(l =>
      [l.name, l.city, l.area, l.address, l.source, l.type]
        .some(v => String(v || "").toLowerCase().includes(query))
    );
  }

  res.json(listings.sort((a, b) => new Date(b.postedAt || 0) - new Date(a.postedAt || 0)));
});

app.post("/api/listings", (req, res) => {
  const db = readDb();
  const body = req.body || {};

  if (!body.name || !body.qty || !body.type || !body.source || !body.address || !body.city || !body.pickupFrom || !body.pickupTo || !body.contactName || !body.contactPhone) {
    return res.status(400).json({ message: "Missing required donation fields." });
  }

  const listing = {
    id: makeId("FB"),
    name: String(body.name).trim(),
    emoji: foodEmoji(body.type),
    qty: Number(body.qty),
    type: body.type,
    source: body.source,
    address: body.address,
    city: body.city,
    area: body.area || body.address,
    pincode: body.pincode || "",
    pickupFrom: body.pickupFrom,
    pickupTo: body.pickupTo,
    contact: `${body.contactName} | ${body.contactPhone}`,
    contactEmail: body.contactEmail || "",
    allergens: body.allergens || "",
    desc: body.desc || "",
    status: "available",
    mins: 60,
    tags: [body.type, body.source].filter(Boolean),
    dist: Number((Math.random() * 5 + 0.5).toFixed(1)),
    postedAt: new Date().toISOString(),
    isUserPost: true
  };

  db.listings.unshift(listing);
  writeDb(db);

  res.status(201).json(listing);
});

app.post("/api/listings/:id/claim", (req, res) => {
  const db = readDb();
  const listing = db.listings.find(l => l.id == req.params.id);

  if (!listing) return res.status(404).json({ message: "Listing not found." });
  if (listing.status === "claimed") return res.status(409).json({ message: "This food is already claimed." });

  const { name, phone, claimType } = req.body || {};
  if (!name || !phone) return res.status(400).json({ message: "Name and phone are required." });

  listing.status = "claimed";
  listing.claimedAt = new Date().toISOString();

  const claim = {
    id: makeId("CL"),
    listingId: listing.id,
    name,
    phone,
    claimType: claimType || "Individual",
    createdAt: new Date().toISOString()
  };

  db.claims.push(claim);
  writeDb(db);

  res.json({ listing, claim });
});

app.post("/api/volunteers", (req, res) => {
  const db = readDb();

  const { name, phone, email, city } = req.body || {};

  if (!name || !phone || !email || !city) {
    return res.status(400).json({ message: "Missing required volunteer fields." });
  }

  const volunteer = {
    id: makeId("VOL"),
    ...req.body,
    joinedAt: new Date().toISOString()
  };

  db.volunteers.push(volunteer);
  writeDb(db);

  res.status(201).json(volunteer);
});

app.post("/api/alerts", (req, res) => {
  const db = readDb();

  const { name, phone, email, alertType, location } = req.body || {};

  if (!name || !phone) {
    return res.status(400).json({ message: "Name and phone are required." });
  }

  const alert = {
    id: makeId("AL"),
    name,
    phone,
    email: email || "",
    alertType: alertType || "Individual",
    location: location || "",
    createdAt: new Date().toISOString()
  };

  db.alerts.push(alert);
  writeDb(db);

  res.status(201).json(alert);
});

app.get("/api/stats", (req, res) => {
  const db = readDb();
  const available = db.listings.filter(l => l.status === "available");

  res.json({
    totalListings: db.listings.length,
    available: available.length,
    claimed: db.listings.filter(l => l.status === "claimed").length,
    livePortions: available.reduce((sum, l) => sum + Number(l.qty || 0), 0),
    volunteers: db.volunteers.length,
    alerts: db.alerts.length
  });
});
app.get("/api/volunteers/:id", (req, res) => {
  const db = readDb();

  const volunteer = db.volunteers.find(v => v.id === req.params.id);

  if (!volunteer) {
    return res.status(404).json({ message: "Volunteer not found" });
  }

  res.json(volunteer);
});

app.listen(PORT, () => {
  console.log(`FoodBridge running at http://localhost:${PORT}`);
});