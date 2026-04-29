# Process Documentation – FoodBridge (Alcamix)

## 1. Project Overview

FoodBridge is a full-stack application (backend-focused in this repository) designed to manage food listings, volunteers, and alerts.

The backend is built using Node.js and Express, exposing REST APIs and storing data in a local JSON file.

---

## 2. Project Structure

```
root/
│
├── data/
│   └── db.json          # Local data storage (mock database)
│
├── node_modules/        # Installed dependencies (auto-generated)
│
├── package.json         # Project configuration (expected)
├── server.js / app.js   # Main backend entry point (expected)
└── README.md
```

---

## 3. Setup Process

### Prerequisites

* Node.js installed
* npm available

### Installation

```bash
npm install
```

---

## 4. Running the Application

Start the backend server:

```bash
npm start
```

Application will run at:

```
http://localhost:3000
```

---

## 5. Backend API Workflow

### Available Endpoints

#### Listings

* `GET /api/listings`
  Fetch all food listings

* `POST /api/listings`
  Create a new food listing

* `POST /api/listings/:id/claim`
  Claim a specific listing

---

#### Volunteers

* `POST /api/volunteers`
  Register a volunteer

---

#### Alerts

* `POST /api/alerts`
  Create alerts for food availability

---

#### Statistics

* `GET /api/stats`
  Retrieve platform statistics

---

## 6. Data Handling

* All data is stored in:

  ```
  data/db.json
  ```
* Acts as a lightweight database
* Should be handled carefully to avoid corruption

---

## 7. Development Workflow

### Step 1: Make code changes

### Step 2: Stage changes

```bash
git add .
```

### Step 3: Commit

```bash
git commit -m "Meaningful message"
```

### Step 4: Sync with remote

```bash
git pull origin main --rebase
```

### Step 5: Push changes

```bash
git push origin main
```

---

## 8. Error Handling

### Push rejected error

```bash
git pull origin main --rebase
git push origin main
```

### Merge conflicts

* Resolve conflicts manually
* Then:

```bash
git add .
git rebase --continue
```

---

## 9. Best Practices

* Do not commit `node_modules/`
* Use `.gitignore` to exclude:

  ```
  node_modules/
  .env
  ```
* Keep commits small and descriptive
* Always pull before pushing
* Use separate branches for features

---

## 10. Future Improvements

* Replace JSON storage with database (MongoDB / MySQL)
* Add authentication system
* Add frontend integration (React / Angular)
* Implement validation and error middleware
* Add unit and integration testing
* Deploy to cloud platform (AWS / Render / Vercel)

---

## 11. Notes

* This project currently uses a file-based database (`db.json`)
* Suitable for development and prototyping
* Not recommended for production-scale applications
