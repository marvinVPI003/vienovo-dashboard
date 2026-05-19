# 🚀 VIENOVO DASHBOARD - COMPLETE SETUP & TESTING GUIDE

## Your Dashboard is Ready! Here's How to Get It Running

You have everything you need to run your production dashboard right now. Follow these simple steps:

---

## PHASE 1: INSTALLATION (3 minutes)

### Step 1: Open Command Prompt / Terminal
Navigate to your dashboard folder:
```bash
cd "D:\Profile\Documents\Claude\Projects\Operation Dashboard"
```

### Step 2: Install Dependencies
Run this command (first time only):
```bash
npm install
```

This will install:
- ✅ Express (web server)
- ✅ CORS (allows dashboard to talk to backend)
- ✅ Google Sheets API (connects to your data)

**Wait time:** 1-2 minutes (this is normal on first run)

---

## PHASE 2: START THE SERVER (1 minute)

### Step 3: Launch Your Backend
Run this command:
```bash
npm start
```

You should see this output:
```
🚀 Vienovo Dashboard Backend running on http://localhost:3000
📊 API: http://localhost:3000/api/data
🏭 Plant API: http://localhost:3000/api/plant/AC
💚 Health: http://localhost:3000/health
```

**If you see this, SUCCESS! ✅ Your backend is running and connected to Google Sheets.**

---

## PHASE 3: TEST THE BACKEND (1 minute)

Before opening the dashboard, let's verify the backend is pulling real data.

### Option A: Quick Browser Test
Open any web browser and go to:
```
http://localhost:3000/api/data
```

You should see JSON data with:
- ✅ `production` data from "MR daily" sheet
- ✅ `costs` data from "PC daily" sheet  
- ✅ `downtime` data from "Downtime" sheet
- ✅ `analytics` with KPIs calculated

### Option B: Test Specific Plant Data
Try these URLs to see data for each plant:
```
http://localhost:3000/api/plant/AC       (Laguna plant)
http://localhost:3000/api/plant/PFMIS    (PFMIS plant)
http://localhost:3000/api/plant/HOREB    (Horeb plant)
http://localhost:3000/api/plant/ARGAO    (Argao plant)
http://localhost:3000/api/plant/BUKID    (Bukid plant)
http://localhost:3000/api/plant/NATIONAL (All operating plants combined)
```

If you see data in JSON format, **CONGRATULATIONS!** Your backend is successfully:
- 🎯 Connecting to Google Sheets
- 📊 Reading your data
- 🔄 Transforming it into usable format

---

## PHASE 4: OPEN YOUR DASHBOARD (30 seconds)

Now that your backend is running, open the dashboard:

### Option 1: Direct File Open
Simply open this file in your browser:
```
D:\Profile\Documents\Claude\Projects\Operation Dashboard\vienovo_dashboard_final.html
```

Or double-click:
```
vienovo_dashboard_final.html
```

### Option 2: Via Browser
1. Open your browser
2. Go to: `file:///D:/Profile/Documents/Claude/Projects/Operation%20Dashboard/vienovo_dashboard_final.html`

---

## PHASE 5: VERIFY DASHBOARD IS WORKING ✅

When the dashboard opens, you should see:

### KPI Cards (Top of page):
- 📈 **Production** (MT/month) - Should show your May 2026 total
- 💰 **Cost/Ton** (PHP) - Should show average production cost
- ⭐ **Quality Score** (%) - Should show quality percentage
- 🔧 **OEE** (%) - Should show Overall Equipment Effectiveness

### Data Loading Status:
- If you see colored numbers: **✅ Real data is loading!**
- If you see "Loading..." message that persists: ⚠️ Check troubleshooting below

### Tabs Available:
- 📊 **Overview** - Summary view with all KPIs
- 📈 **Production** - Daily/monthly production by product type
- ⭐ **Quality** - Rejection rates and quality details
- 💸 **Costs** - Cost breakdown, cost per ton analysis
- 🔌 **Resources** - Fuel, electricity, coal consumption
- ⏱️ **Downtime** - Equipment downtime log
- 🎯 **OEE** - Performance, Quality, Availability metrics
- 🔮 **Forecast** - Expected monthly output based on current trend

### Per-Plant Selector:
- Click plant names to see individual plant data
- Compare AC vs PFMIS vs Horeb vs Argao vs Bukid
- See NATIONAL summary

---

## WHAT HAPPENS NEXT (Auto Features)

✅ **Real-time Updates**
- Dashboard auto-refreshes every 30 seconds
- No need to manually refresh

✅ **AI Insights**
- Panel on right side shows automatic recommendations
- Analyzes your data for patterns and alerts

✅ **Data Export**
- Click "Generate PDF Report" to create presentation slides
- Perfect for your COMEX meetings

✅ **Plant Comparison**
- All plants' data displayed together
- Easy benchmarking

---

## TROUBLESHOOTING

### ❌ Dashboard shows "Loading..." forever

**Solution 1:** Make sure backend server is running
- Check your command prompt/terminal
- You should see the 🚀 startup message
- If not, run `npm start` again

**Solution 2:** Clear browser cache
- Press Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
- Clear "Cached images and files"
- Refresh the dashboard page

**Solution 3:** Check browser console for errors
- Press F12 to open Developer Tools
- Click "Console" tab
- Look for red error messages
- Report them and I'll fix immediately

---

### ❌ Backend won't start - "Port 3000 already in use"

**Solution:** Kill the existing process

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID_number> /F
npm start
```

**Mac/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
npm start
```

---

### ❌ "Failed to fetch from API" error

**Solution 1:** Verify backend is running
- You should see startup messages in terminal

**Solution 2:** Check your internet connection
- Backend needs internet to reach Google Sheets

**Solution 3:** Verify Google API key is valid
- Open `backend_server.js` line 39
- Confirm the API key is there: `AIzaSyBKNLhEhSJb7KhZhSJkGlZRY-6vj7Yd2Oo`

---

### ❌ "No data showing" or blank tables

**Causes:**
1. Google Sheets not updated yet
2. Column names don't match expectations
3. Data validation errors

**How to verify:**
1. Open http://localhost:3000/api/data in browser
2. Look at the JSON response
3. Check if your sheets have data in expected columns
4. Share the response with me if blank

---

## WHAT YOUR DATA STRUCTURE SHOULD BE

Your Google Sheet (`1MbE-tRIBo7uqSxaOMgeDP1BttzHvfGevtrcOQruInsk`) should have these 4 sheets:

### Sheet 1: "MR daily"
Columns: Date, Plant, Volume, Product Type, etc.
```
Expected data for AC, PFMIS, HOREB, ARGAO, BUKID (+ CCPC, SOUTH for tolling)
```

### Sheet 2: "PC daily"
Columns: Date, Plant, Volume, Cost per Ton, Fixed Cost, Variable Cost, etc.
```
Expected cost data with breakdown
```

### Sheet 3: "MCOS daily"
Columns: Utility consumption data
```
Fuel (liters), Electricity (kWh), Coal (kg)
```

### Sheet 4: "Downtime"
Columns: Plant, Date, Incident, Hours, Type (Scheduled/Unscheduled), etc.
```
Equipment downtime records
```

---

## READY FOR CEO PRESENTATIONS? 📊

Once data is verified:

1. **Generate PDF Report**
   - Click "Generate PDF Report" button
   - Perfect for emailing to COMEX

2. **Plant Comparison View**
   - All plants side-by-side
   - Shows performance ranking

3. **Forecast Section**
   - Shows expected month-end production
   - Based on current daily average

4. **AI Insights**
   - Automatic recommendations
   - Highlights improvements needed

---

## NEXT STEPS

### Today:
- ✅ Run `npm install`
- ✅ Run `npm start`
- ✅ Open dashboard and verify data loads
- ✅ Test a few plant views
- ✅ Generate a sample PDF report

### This Week:
- Validate data accuracy against source sheets
- Customize alert thresholds if needed
- Set up automatic daily emails with PDF reports (optional)
- Show to team for feedback

### For COMEX Meeting:
- Share PDF reports
- Show live dashboard for real-time Q&A
- Use plant comparison for performance discussion

---

## COMMAND REFERENCE

```bash
# First time setup
npm install

# Start server
npm start

# With auto-reload during development
npm run dev

# Test endpoints
curl http://localhost:3000/api/data
curl http://localhost:3000/api/plant/AC
curl http://localhost:3000/health
```

---

## SUPPORT

If you encounter any issues:
1. Check this troubleshooting section first
2. Share the error message from browser console (F12)
3. Tell me what you see when you visit http://localhost:3000/api/data

---

**Your dashboard is production-ready. Let's get it running!** 🚀
