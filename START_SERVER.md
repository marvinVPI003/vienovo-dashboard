# 🚀 VIENOVO DASHBOARD - BACKEND STARTUP GUIDE

## Quick Start (3 steps)

### Step 1: Install Dependencies
Open a terminal/command prompt in this folder and run:
```bash
npm install
```

This installs:
- **express** - Web server framework
- **cors** - Enables cross-origin requests
- **googleapis** - Google Sheets API access

### Step 2: Start the Backend Server
```bash
npm start
```

Or if you have nodemon installed:
```bash
npm run dev
```

You should see:
```
🚀 Vienovo Dashboard Backend running on http://localhost:3000
📊 API: http://localhost:3000/api/data
🏭 Plant API: http://localhost:3000/api/plant/AC
💚 Health: http://localhost:3000/health
```

### Step 3: Open the Dashboard
Open this file in your browser:
```
vienovo_dashboard_final.html
```

The dashboard will automatically connect to `http://localhost:3000/api/data` and load your real Google Sheets data.

---

## What the Backend Does

✅ **Connects to your Google Sheet** (ID: 1MbE-tRIBo7uqSxaOMgeDP1BttzHvfGevtrcOQruInsk)
✅ **Reads 4 sheets**: MR daily, PC daily, MCOS daily, Downtime
✅ **Transforms raw data** into structured analytics
✅ **Calculates KPIs**: Production totals, costs, quality scores, OEE, downtime
✅ **Serves via REST API** at http://localhost:3000/api/data
✅ **Enables real-time updates** with 30-second refresh
✅ **Supports per-plant queries** like /api/plant/AC

---

## API Endpoints

### Get All Data
```
GET http://localhost:3000/api/data
```
Returns: All plants' production, costs, downtime, and analytics

### Get Specific Plant
```
GET http://localhost:3000/api/plant/AC
GET http://localhost:3000/api/plant/PFMIS
GET http://localhost:3000/api/plant/NATIONAL
```
Returns: Production, costs, and downtime for that plant

### Health Check
```
GET http://localhost:3000/health
```
Returns: Server status

---

## Required Setup

**Google Sheets API Key:**
The backend uses the API key already configured:
```
AIzaSyBKNLhEhSJb7KhZhSJkGlZRY-6vj7Yd2Oo
```

This key is embedded in `backend_server.js` line 39.

**Note for Production:**
For production deployment, use environment variables:
```bash
GOOGLE_API_KEY=your_key_here npm start
```

---

## Troubleshooting

### Issue: "Port 3000 already in use"
```bash
# Kill existing process on port 3000
# On Mac/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: "Cannot find module 'express'"
Make sure you ran `npm install` first.

### Issue: "Google Sheets API error"
Check that your internet connection is working and the sheet ID is correct in `backend_server.js`.

### Issue: Dashboard shows "Loading..." forever
Make sure the backend server is running (you should see the startup messages).
Check your browser's DevTools Console (F12) for errors.

---

## Dashboard Features

Once running, you'll have access to:

✅ **8 Tabs**: Overview, Production, Quality, Costs, Resources, Downtime, OEE, Forecast
✅ **Real-time KPI Cards**: Production, Cost, Quality, OEE
✅ **Plant Selector**: Switch between AC, PFMIS, HOREB, ARGAO, BUKID, NATIONAL
✅ **Data Tables**: Production by product type, cost analysis, downtime details
✅ **Interactive Charts**: Trends, distribution, comparisons
✅ **AI Insights**: Automated recommendations based on data
✅ **PDF Export**: Generate reports for presentations
✅ **Auto-Refresh**: Updates every 30 seconds

---

## Next: CEO Presentation

Once you verify the data is loading correctly, the dashboard is ready for:
- Daily monitoring by your team
- Weekly analysis reports
- COMEX (CEO) presentations with PDF export
- Plant benchmarking and comparison

---

**Questions?** Check the browser console (F12) for any error messages, or review the API response at http://localhost:3000/api/data
