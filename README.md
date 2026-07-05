# ☁ CloudLens — Cloud Cost Intelligence Dashboard

A full-stack dashboard to analyze cloud billing CSVs and surface cost-saving recommendations — **no paid AI APIs required**.

## Features

- 📂 **Drag-and-drop CSV upload** (AWS, GCP, Azure, any format)
- 📊 **Interactive charts**: spend over time, by service, by region, by account
- 🔥 **Smart recommendations** with priority levels and estimated savings
- ⚡ **Demo mode** with realistic AWS-style sample data
- 🌍 **Multi-region and multi-account** support

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Recharts |
| Backend | Node.js + Express |
| CSV Parsing | csv-parser (backend), PapaParse (browser) |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Local Development

### Prerequisites
- Node.js 18+
- npm

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd cloud-cost-dashboard

# Install backend deps
cd backend && npm install && cd ..

# Install frontend deps
cd frontend && npm install && cd ..
```

### 2. Start Backend

```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

### 3. Start Frontend

```bash
cd frontend
npm start
# Runs on http://localhost:3000
# Proxies /api requests to :5000 automatically
```

---

## Deploy to Production

### Backend → Render.com

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your repo
4. Use these settings:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: Node
5. Copy your Render URL (e.g. `https://your-app.onrender.com`)

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Set **Root Directory** to `frontend`
4. Add environment variable:
   - `REACT_APP_API_URL` = your Render backend URL
5. Deploy!

---

## CSV Format

The backend auto-detects column names. Supported column names include:

| Data | Accepted Column Names |
|------|-----------------------|
| Cost | `cost`, `amount`, `charge`, `total`, `price`, `spend` |
| Service | `service`, `product`, `resource`, `type` |
| Date | `date`, `time`, `period`, `month` |
| Region | `region`, `location`, `zone` |
| Account | `account`, `project`, `subscription` |

A sample file is included: `sample-billing.csv`

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/api/analyze` | Upload & analyze CSV |
| `GET` | `/api/demo` | Load demo dataset |

### POST /api/analyze

**Request**: `multipart/form-data` with field `file` (CSV)

**Response**:
```json
{
  "success": true,
  "data": {
    "summary": { "totalCost": 12500.50, "uniqueServices": 8, ... },
    "topServices": [{ "name": "EC2", "cost": 5000, "percentage": 40 }, ...],
    "spendOverTime": [{ "date": "2024-01", "cost": 3200 }, ...],
    "byRegion": [...],
    "byAccount": [...],
    "recommendations": [{ "priority": "high", "title": "...", "potentialSaving": 500 }, ...]
  }
}
```

---

## Project Structure

```
cloud-cost-dashboard/
├── backend/
│   ├── src/
│   │   └── index.js          # Express server + analysis engine
│   └── package.json
├── frontend/
│   ├── public/index.html
│   ├── src/
│   │   ├── App.js            # Root with upload/dashboard routing
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── UploadPage.js # Drag-drop upload + demo
│   │   │   ├── Dashboard.js  # Composes all sections
│   │   │   ├── SummaryCards.js
│   │   │   ├── Charts.js     # Area, Bar, Pie charts
│   │   │   ├── ServiceTable.js
│   │   │   └── Recommendations.js
│   │   └── index.css
│   └── package.json
├── sample-billing.csv         # Test data
├── vercel.json
├── render.yaml
└── README.md
```

---

## Recommendation Engine

The backend generates recommendations based on:

- **Cost Spike**: Services consuming >30% of budget → rightsize
- **Optimization**: Services 15-30% of budget → savings plans
- **Region Consolidation**: Spread across 3+ regions
- **Spend Anomaly**: MoM increase >20% detected
- **Reserved Instances**: Total spend >$500 → commit discounts
- **Idle Resources**: Industry-standard 30% waste estimate
- **Auto-Scaling**: Off-peak cost reduction opportunity

Each recommendation includes:
- Priority level (high/medium/low)
- Estimated potential saving
- Actionable next step

---

## License

MIT
