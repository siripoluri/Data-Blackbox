**Privacy-first browser extension and analytics dashboard** that reveals how websites track your data.  
The project captures outgoing network requests in real time, classifies domains as **first-party vs third-party**, and visualizes them in a local dashboard.

Built as a showcase of **full-stack engineering and privacy/security technology**.

---

## Features

### Browser Extension (Chrome/Firefox, MV3)
- Captures outgoing requests (**fetch**, **XHR**, **WebSocket**, **main_frame**)
- Deduplicates requests to reduce noise
- Sends anonymized events to a local backend

### Local Backend (Express + SQLite)
- Stores unique domains with hit counts
- Classifies requests as **first-party** or **third-party**
- Exposes APIs for dashboards (`/domains`, `/event`)

### Future Extensions
- Next.js dashboard with interactive Sankey diagrams  
- One-click block/allow rules  
- Packaging for Chrome Web Store  

---

## Tech Stack

- **Extension**: TypeScript, Chrome WebExtension APIs (MV3)  
- **Backend**: Node.js, Express 5, SQLite (`better-sqlite3`)  
- **Database**: Lightweight local `data.db`  
- **Planned Dashboard**: Next.js + D3.js  

---

## Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/<your-username>/data-blackbox.git
cd data-blackbox
````

### 2. Backend (Server)

```bash
cd server
npm install
npm run start
```

Server runs at **[http://localhost:3001](http://localhost:3001)**

**Endpoints**

* `POST /event` → log a domain
* `GET /domains` → fetch all stored domains

### 3. Extension (Chrome/Firefox)

```bash
cd extension
npm install
npm run build
```

Then in Chrome:

1. Open **chrome://extensions**
2. Enable **Developer Mode**
3. Click **Load unpacked** → select the `extension/` folder

---

## How It Works

1. Browse any website
2. The extension intercepts outgoing requests
3. Each domain is recorded locally:

   * **First-party** = same site being visited
   * **Third-party** = trackers, CDNs, ads, analytics
4. The backend aggregates counts and exposes APIs
5. (Planned) Dashboard visualizes the data as an **interactive Sankey map**

---

## Roadmap

* Build **Next.js dashboard** with D3 Sankey visualization
* Implement **allow/block rules** with Supabase
* Package for **Chrome Web Store**

---

