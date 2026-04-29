# 🍲 FoodBridge – Full Stack Food Sharing Platform

FoodBridge is a full-stack web application that connects **food providers (restaurants/events)** with **volunteers** to reduce food waste and help distribute surplus food to people in need.

---

## 🚀 Features

- 🥘 Create and manage surplus food listings  
- 🙋 Volunteers can claim food and coordinate distribution  
- 🔔 Alert system for new food availability  
- 📊 Real-time statistics tracking (listings, claims, volunteers)  

---

## 🧑‍💻 Tech Stack

- **Frontend:** React (update if different)
- **Backend:** Node.js + Express  
- **Database:** JSON file (`data/db.json`)  

---

## 📂 Project Structure
FoodBridge/
│
├── public/                  # Frontend (static files)
│   ├── css/
│   │   ├── styles.css
│   │   ├── feed.css
│   │   ├── donate.css
│   │   └── volunteer.css
│   │
│   ├── js/
│   │   ├── feed.js
│   │   ├── donate.js
│   │   ├── find.js
│   │   ├── volunteer.js
│   │   ├── volunteer-login.js
│   │   └── volunteer-dashboard.js
│   │
│   ├── images/
│   │   ├── food_spread.png
│   │   ├── hero_food.png
│   │   ├── ngo_shelter.png
│   │   └── volunteer_network.png
│   │
│   ├── pages/
│   │   ├── index.html
│   │   ├── feed.html
│   │   ├── donate.html
│   │   ├── find.html
│   │   ├── volunteer.html
│   │   ├── volunteer-login.html
│   │   └── volunteer-dashboard.html
│
├── server/                  # Backend
│   ├── routes/
│   │   └── api.js
│   │
│   ├── controllers/         # (optional but better)
│   │   └── listingsController.js
│   │
│   ├── data/
│   │   └── db.json
│   │
│   ├── app.js
│   └── server.js
│
├── package.json
├── README.md
└── .gitignore

## Run
```bash
npm install
npm start
```
Open: http://localhost:3000

## Backend APIs
- `GET /api/listings`
- `POST /api/listings`
- `POST /api/listings/:id/claim`
- `POST /api/volunteers`
- `POST /api/alerts`
- `GET /api/stats`

Data is saved in `data/db.json`.
