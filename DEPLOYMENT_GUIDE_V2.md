# 🎨 VIENOVO PRODUCTION DASHBOARD v2 - DEPLOYMENT GUIDE

Complete setup instructions for the professional production dashboard with real data from Google Sheets.

---

## **QUICK START (3 Steps)**

### Step 1: Deploy Google Apps Script
1. Go to **[script.google.com](https://script.google.com)**
2. Create **"New project"** → Name it `Vienovo Dashboard API`
3. Replace ALL code in `Code.gs` with the code from `vienovo_apps_script.js`
4. Click **Save** (Ctrl+S)
5. Click **Deploy** → **New deployment** → Select **"Web app"**
6. Set: Execute as: *Your Google Account* | Who has access: *Anyone*
7. Click **Deploy** and **Authorize**
8. **COPY THE WEB APP URL** (starts with `https://script.googleapis.com/macros/d/...`)

### Step 2: Update Dashboard HTML
1. Open `vienovo_dashboard_v2.html` in a text editor
2. Find line ~340: `const API_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';`
3. Replace with your URL from Step 1
4. **Save the file**

### Step 3: Open Dashboard
1. Open `vienovo_dashboard_v2.html` in your browser
2. You should see the dashboard with data loading
3. Use the plant selector and time period dropdowns to view different views

---

## **DETAILED SETUP**

### Verify Google Sheet Structure

Your Google Sheet (1MbE-tRIBo7uqSxaOMgeDP1BttzHvfGevtrcOQruInsk) must have these sheets:

| Sheet Name | Purpose | Key Columns |
|-----------|---------|---|
| **MR daily** | Production data | YEAR, PLANT, DATE, WEEK, MONTH, TOTAL VOLUME, PELLET VOLUME, CRUMBLE VOLUME, REMILL REJECT |
| **PC daily** | Production costs | YEAR, PLANT, DATE, WEEK, VOLUME.MT, VARIABLE COST, FIXED COST, MCOS, MCOS/TON |
| **MCOS daily** | Detailed costing | YEAR, PLANT, DATE, WEEK, MONTH, [Cost breakdown] |
| **Downtime** | Maintenance log | PLANT, DATE, WEEK NUM, MONTH, WORKING HOURS, SCHEDULED OPER, SCHEDULED DOWNTIME, UNSCHEDULED DOWNTIME |

**⚠️ Sheet names MUST match exactly (case-sensitive)**

### Update Sheet Names in Apps Script (if needed)

If your sheet names are different, edit `vienovo_apps_script.js` lines 11-14:

```javascript
const mrSheet = ss.getSheetByName('MR daily');           // Change if different
const pcSheet = ss.getSheetByName('PC daily');           // Change if different
const mcosSheet = ss.getSheetByName('MCOS daily');       // Change if different
const downtimeSheet = ss.getSheetByName('Downtime');     // Change if different
```

Then paste the updated code into your Google Apps Script.

---

## **COLUMN MAPPING REFERENCE**

### MR Daily Sheet (Production Data)
```
A: YEAR
B: PLANT (AC, PFMIS, HOREB, ARGAO, BUKID, CCPC, SOUTH)
C: DATE
D: WEEK
E: MONTH
F: TOTAL VOLUME (MT)
G: PELLET VOLUME (MT)
H: CRUMBLE VOLUME (MT)
I: REMILL REJECT (MT)
... (additional columns for capacity, rejection rate, etc.)
```

### PC Daily Sheet (Cost Data)
```
A: YEAR
B: PLANT
C: DATE
D: WEEK
E: VOLUME.MT
F: VARIABLE COST
G: FIXED COST
H: MCOS
I: MCOS/TON
J: ROLLS & DIE
K: FUEL
L: POWER RATE
```

### MCOS Daily Sheet
Similar to PC Daily, includes detailed cost breakdowns

### Downtime Sheet
```
A: PLANT
B: DATE
C: WEEK NUM
D: MONTH
E: WORKING HOURS
F: SCHEDULED OPER
G: SCHEDULED DOWNTIME (hrs)
H: UNSCHEDULED DOWNTIME (hrs)
I: EQUIPMENT DOWNTIME %
J: EQUIPMENT DOWNTIME
K: ELECTRICAL
```

---

## **TROUBLESHOOTING**

### "There's no data on the dashboard"

**Check 1: Verify API URL**
- Open your browser console (F12 → Console)
- Look for error messages about the API URL
- Make sure you copied the FULL Apps Script URL correctly

**Check 2: Verify Sheet Names**
- Open your Google Sheet
- Check that sheet names are EXACTLY: `MR daily`, `PC daily`, `MCOS daily`, `Downtime`
- Sheet names are case-sensitive

**Check 3: Test Apps Script Manually**
- Go to your Google Apps Script in script.google.com
- Click **Deploy** → Find your Web App deployment
- Click the **URL** to test it directly
- You should see JSON data in your browser

**Check 4: Browser Console Errors**
- Open Dashboard → Press F12 → Console tab
- Look for red error messages
- Common errors:
  - `Failed to fetch` - URL is wrong
  - `Sheet not found` - Sheet name mismatch
  - `JSON.parse error` - Apps Script not returning valid JSON

### "Invalid URL error when deploying Apps Script"

- Make sure you selected **"Web app"** (not "Library")
- Set **"Execute as"** to your Google account
- Set **"Who has access"** to **"Anyone"**

### "Permission denied" when running Apps Script

- Click **Review permissions** during deployment
- Select your Google account
- Click **Allow**

---

## **FEATURES IN V2 DASHBOARD**

✅ **Overview Tab**
- 6 KPI cards (Production, Capacity, Rejection, Cost, OEE, Downtime)
- Daily production breakdown by product type
- Per-plant and National views

✅ **Production Section**
- Production trend charts
- Detailed production table by date/plant/product

✅ **Quality & Rejection**
- Rejection trend analysis
- Weekly rejection metrics
- Status indicators (Good/Warning/Danger)

✅ **Production Costs**
- Cost breakdown charts (Fixed vs Variable)
- Daily cost per ton
- Cost analysis by plant

✅ **Resource Consumption**
- Fuel consumption (Liters, L/Ton)
- Electricity consumption (kWh, kWh/Ton)
- Coal consumption tracking (ready for integration)

✅ **Downtime Log**
- Detailed maintenance/downtime table
- Scheduled vs unscheduled downtime
- Issue tracking

✅ **OEE Metrics**
- Availability, Performance, Quality percentages
- Total OEE score
- OEE trend charts

✅ **Safety Dashboard**
- Days without accident counter
- Monthly incident tracking
- Near-miss reporting

✅ **Professional Design**
- Vienovo brand colors (Blue #0052A3, Gold #FFC107)
- Left sidebar navigation
- Responsive layout (works on desktop and tablet)
- Executive-ready styling

---

## **NEXT STEPS AFTER DEPLOYMENT**

1. ✅ **Verify data is loading correctly**
   - Select different plants
   - Change time periods
   - Check that numbers match your Google Sheet

2. ✅ **Share with team**
   - Upload `vienovo_dashboard_v2.html` to a shared location
   - Google Drive, company server, or web host
   - Share the link with COMEX, CEO, and operations team

3. ✅ **Customize for your needs**
   - Edit the sidebar navigation items to match your priorities
   - Modify KPI cards to show metrics important to your business
   - Add additional charts from your data

4. ✅ **Set up auto-refresh** (Optional)
   - Modify the script to refresh data every 30 minutes
   - Or setup email alerts for KPI thresholds

5. ✅ **Monitor data quality**
   - Regularly check that Apps Script is returning correct data
   - Verify sheet names and columns haven't changed
   - Test with different date ranges

---

## **VIENOVO COLORS USED**

- **Primary Blue:** #0052A3 (Headers, text, borders)
- **Light Blue:** #003D7A (Sidebar, hover effects)
- **Green:** #4CAF50 (Success/good status)
- **Gold:** #FFC107 (Highlights, active states)
- **Light Gray:** #F5F5F5 (Backgrounds)

---

## **FILE STRUCTURE**

```
D:\Profile\Documents\Claude\Projects\Operation Dashboard\
├── vienovo_dashboard_v2.html          ← Open this file in browser
├── vienovo_apps_script.js              ← Deploy to Google Apps Script
├── DEPLOYMENT_GUIDE_V2.md              ← This file
├── vienovo_production_dashboard_executive.html (v1 - deprecated)
└── DEPLOYMENT_GUIDE.md (v1 - deprecated)
```

---

## **SUPPORT & CONTACT**

- **Issues?** Check the browser console (F12 → Console)
- **Need help?** Review the troubleshooting section above
- **Questions?** Contact your IT support or operations team
- **Data format issues?** Verify column mappings match your sheet exactly

---

**Dashboard Version:** 2.0  
**Last Updated:** May 2026  
**Created For:** Vienovo Production Operations  
**Developed by:** Operations & Analytics Team
