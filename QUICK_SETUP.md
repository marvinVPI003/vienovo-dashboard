# ⚡ VIENOVO DASHBOARD - QUICK SETUP CHECKLIST

## Before You Start
- [ ] You have access to the Google Sheet: `https://docs.google.com/spreadsheets/d/1MbE-tRIBo7uqSxaOMgeDP1BttzHvfGevtrcOQruInsk/`
- [ ] You have a Google Account to deploy Apps Script
- [ ] You have a text editor (Notepad, VS Code, etc.)

---

## STEP 1: Deploy Google Apps Script (5 minutes)

### 1.1 Create New Apps Script Project
- [ ] Go to https://script.google.com
- [ ] Click "New project"
- [ ] Name it: `Vienovo Dashboard API`

### 1.2 Copy and Paste Code
- [ ] Open `vienovo_apps_script_v2.js` from your files
- [ ] Copy ALL the code
- [ ] Go back to Google Apps Script
- [ ] Delete any existing code in `Code.gs`
- [ ] Paste the entire Apps Script code
- [ ] Click **Save** (Ctrl+S or Cmd+S)

### 1.3 Deploy as Web App
- [ ] Click **Deploy** button (top right)
- [ ] Click **"New deployment"**
- [ ] Click dropdown, select **"Web app"**
- [ ] **Execute as:** Choose your Google account
- [ ] **Who has access:** Select **"Anyone"**
- [ ] Click **Deploy**
- [ ] A popup will ask for permissions → Click **Review permissions** → Select your account → Click **Allow**
- [ ] **COPY THE URL** that appears (starts with `https://script.googleapis.com/macros/d/`)
- [ ] **SAVE THIS URL** - You need it in Step 2

---

## STEP 2: Update Dashboard HTML (2 minutes)

### 2.1 Edit Dashboard File
- [ ] Open `vienovo_dashboard_v2.html` in a text editor
- [ ] Press Ctrl+F (or Cmd+F) to find
- [ ] Search for: `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE`
- [ ] You should find it on line ~340 in the JavaScript section

### 2.2 Replace with Your URL
- [ ] Delete the text `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE`
- [ ] Paste your URL from Step 1.3
- [ ] It should look like: `const API_URL = 'https://script.googleapis.com/macros/d/AKfycbx...';`
- [ ] Click **Save**

---

## STEP 3: Open Dashboard (1 minute)

### 3.1 Test the Dashboard
- [ ] Open `vienovo_dashboard_v2.html` in your web browser
- [ ] You should see the Vienovo dashboard load
- [ ] If you don't see data yet → See "Troubleshooting" below

### 3.2 Test Plant Selection
- [ ] Click the **Plant/Location** dropdown
- [ ] Select different plants (AC, PFMIS, etc.)
- [ ] Check that numbers change

### 3.3 Test Time Period
- [ ] Click the **Time Period** dropdown
- [ ] Try "Daily", "Weekly", "Monthly"

---

## Troubleshooting

### Problem: "Failed to load data" message
**Solution:**
1. Check that your API URL is correct (no typos)
2. Open browser console (F12 → Console tab)
3. Look for red error messages
4. Try testing the Apps Script URL directly in your browser
   - Just paste your URL into the address bar
   - You should see JSON data

### Problem: "One or more sheets not found"
**Solution:**
1. Go to your Google Sheet
2. Check these sheet names exist (EXACT spelling, case-sensitive):
   - `MR daily`
   - `PC daily`
   - `MCOS daily`
   - `Downtime`
3. If names are different, edit `vienovo_apps_script_v2.js` lines 15-18
4. Re-deploy the Apps Script

### Problem: Dashboard shows mock data instead of real data
**This is OK!** This means the API URL isn't configured correctly.
- Follow "Problem: Failed to load data" solution above
- The dashboard automatically shows sample data while you're setting up

### Problem: Blank dashboard or buttons don't work
1. Try refreshing the page (F5)
2. Clear your browser cache
3. Try in a different browser
4. Check browser console for errors (F12 → Console)

---

## After Setup is Complete

### Share with Your Team
1. Upload `vienovo_dashboard_v2.html` to a shared location:
   - Google Drive
   - Company file server
   - Web hosting service
2. Share the file link with your team
3. Everyone can open it and see live production data

### Access from Multiple Computers
- The HTML file is standalone (no installation needed)
- Just put it somewhere accessible
- Open in any web browser
- Data updates from your Google Sheet automatically

### Make It Your Own
- Edit the sidebar navigation to match your priorities
- Modify KPI card labels
- Change colors in the CSS section
- Add more sections as needed
- See `DEPLOYMENT_GUIDE_V2.md` for details

---

## Files You'll Use

| File | Purpose | Action |
|------|---------|--------|
| `vienovo_apps_script_v2.js` | Backend data server | Paste into Google Apps Script |
| `vienovo_dashboard_v2.html` | The dashboard | Open in browser, update API URL |
| `DEPLOYMENT_GUIDE_V2.md` | Detailed instructions | Reference if you get stuck |
| `QUICK_SETUP.md` | This checklist | Follow step-by-step |

---

## Need Help?

**Question:** How do I know if the Apps Script is working?
**Answer:** Go to your Apps Script → Click Deploy → Click your deployment → View the URL in your browser. If you see JSON data, it's working!

**Question:** Can I modify the dashboard?
**Answer:** Yes! It's just HTML/CSS/JavaScript. Edit any text, colors, or layout. Change the API_URL anytime if needed.

**Question:** How often does data update?
**Answer:** Data refreshes when you open or refresh the dashboard. It always pulls the latest from your Google Sheet.

**Question:** Can I share this with people outside my organization?
**Answer:** Yes! Share the HTML file link. Anyone can view if they have the link (but they can't edit your data).

---

## Quick Links

- 📊 Google Sheet: https://docs.google.com/spreadsheets/d/1MbE-tRIBo7uqSxaOMgeDP1BttzHvfGevtrcOQruInsk/
- 📝 Apps Script Editor: https://script.google.com
- 🎨 Dashboard Color Scheme: Vienovo Blue (#0052A3) + Gold (#FFC107)

---

**Last Updated:** May 2026  
**Version:** 2.0  
**Status:** Ready for Setup ✅
