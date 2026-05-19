# 🎨 VIENOVO PRODUCTION DASHBOARD - DEPLOYMENT GUIDE

## Complete Setup Instructions

---

## **STEP 1: Deploy Google Apps Script**

This script automatically fetches data from your Google Sheets and serves it as JSON.

### 1.1 Create New Apps Script Project

1. Go to **[script.google.com](https://script.google.com)**
2. Click **"New project"**
3. Name it: `Vienovo Dashboard Data Server`
4. In the `Code.gs` file, **paste the entire code** from `vienovo_apps_script.js`
5. Click **Save** (Ctrl+S)

### 1.2 Deploy as Web App

1. Click **"Deploy"** → **"New deployment"**
2. Select **"Web app"** from the dropdown
3. Fill in:
   - **Execute as:** Your Google account email
   - **Who has access:** "Anyone"
4. Click **"Deploy"**
5. A dialog will appear asking for permissions → **Click "Review permissions"** → **Select your account** → **Click "Allow"**
6. **COPY YOUR WEB APP URL** (looks like: `https://script.googleapis.com/macros/d/...`)

**SAVE THIS URL - YOU'LL NEED IT IN STEP 3** ✅

---

## **STEP 2: Verify Your Sheet Names**

Make sure these sheets exist in your Google Sheet with **EXACT names**:

- ✅ `MR daily` (Production data)
- ✅ `PC daily` (Cost data)
- ✅ `MCOS daily` (Detailed cost data)
- ✅ `Downtime` (Downtime/maintenance data)

**If your sheet names are different, edit the Apps Script in `Code.gs` and update these lines:**

```javascript
const mrSheet = ss.getSheetByName('MR daily');     // Change 'MR daily' if needed
const pcSheet = ss.getSheetByName('PC daily');     // Change 'PC daily' if needed
const mcosSheet = ss.getSheetByName('MCOS daily'); // Change 'MCOS daily' if needed
const downtimeSheet = ss.getSheetByName('Downtime'); // Change 'Downtime' if needed
```

---

## **STEP 3: Update Dashboard with Your API URL**

Now connect the dashboard to your Google Apps Script.

1. Open `vienovo_production_dashboard_executive.html` in a text editor
2. Find this line (around line 480):
   ```javascript
   function loadData() {
       // TODO: Replace with your Google Apps Script URL
   ```

3. Replace it with:
   ```javascript
   function loadData() {
       fetch('YOUR_WEB_APP_URL_HERE')
           .then(response => response.json())
           .then(data => {
               dashboardData = data;
               updateDashboard();
           })
           .catch(error => {
               console.error('Error loading data:', error);
               showPlaceholderData();
           });
   }
   ```

4. **Replace `YOUR_WEB_APP_URL_HERE`** with the URL you copied in Step 1.2

5. **Save the file**

---

## **STEP 4: Test Your Dashboard**

### 4.1 Open in Browser

1. Open the HTML file: `vienovo_production_dashboard_executive.html`
2. Should show the Vienovo dashboard with your data!

### 4.2 Check Data Is Loading

- Click **Refresh** in your browser (F5)
- Check if the KPI cards populate with data
- Select different plants to see per-plant data
- Click tabs (Daily, Weekly, Monthly)

### 4.3 Troubleshooting

**If data doesn't load:**

1. Open **Browser Console** (F12 → Console tab)
2. Look for error messages
3. Common issues:
   - **Wrong sheet names:** Update sheet names in Apps Script
   - **Invalid URL:** Re-copy the Web App URL from Step 1.2
   - **Permissions:** Make sure Apps Script is set to "Anyone"

---

## **STEP 5: Share Dashboard with Team**

### 5.1 For Local Use (Your Computer)
- Keep the HTML file on your computer
- Open it anytime to view latest data

### 5.2 For Team Access (Best Practice)
1. Upload `vienovo_production_dashboard_executive.html` to a shared location:
   - Google Drive
   - Company server
   - Web hosting service

2. Share the file link with team members

---

## **FEATURES INCLUDED**

✅ **Daily View**
- Production summary by plant
- Cost breakdown
- Downtime tracking

✅ **Weekly View**  
- Production trends
- Quality summary

✅ **Monthly View**
- Production & capacity charts
- OEE scorecard
- Cost analysis

✅ **Per-Plant + National**
- Toggle between all 8 plants
- National summary always available

✅ **Professional Design**
- Vienovo color palette (Blue, Green, Gold)
- Executive-ready layout
- Mobile responsive

✅ **Auto-Updates**
- Data refreshes when you open dashboard
- Last updated timestamp

---

## **COLUMN MAPPING REFERENCE**

### MR Daily Sheet (Expected Columns)
- A: YEAR | B: PLANT | C: DATE | D: WEEK | E: MONTH
- F: TOTAL VOLUME | G: PELLET VOLUME | H: CRUMBLE VOLUME | I: REMILL REJECT
- ... additional columns for capacity, rejection rate, shrinkage, fuel, electricity, etc.

### PC Daily Sheet (Expected Columns)
- A: YEAR | B: PLANT | C: DATE | D: WEEK
- E: Volume.MT | F: Variable Cost | G: Fixed Cost | H: MCOS | I: MCOS/Ton
- J: Rolls & Die | K: Fuel | L: Power Rate

### MCOS Daily Sheet
- Similar structure to PC daily

### Downtime Sheet
- A: PLANT | B: DATE | C: WEEK NUM | D: MONTH
- E: WORKING HOURS | F: SCHEDULED OPER | G: SCHEDULED DOWNTIME | H: UNSCHEDULED DOWNTIME
- I: EQUIPMENT DOWNTIME % | J: EQUIPMENT DOWNTIME | K: ELECTRICAL

---

## **NEXT STEPS**

**After deployment, you can:**

1. ✅ Add more metrics to the dashboard (modify HTML)
2. ✅ Customize charts (edit Chart.js configurations)
3. ✅ Add email alerts (using Apps Script)
4. ✅ Create weekly/monthly automated reports
5. ✅ Export data to PDF for management reviews

---

## **SUPPORT**

**Questions or Issues?**
- Check the browser console (F12) for errors
- Verify sheet names match exactly
- Ensure Web App URL is correct
- Test the Apps Script manually at the URL

---

**Dashboard Version:** 1.0  
**Last Updated:** May 2026  
**Created For:** Vienovo Production Operations
