# 📊 Google Sheets Setup Guide — લોયાધામ શિબિર ફોર્મ

Follow these steps to save all public form submissions directly to your Google Sheet.

---

## Step 1: Create a Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com)
2. Create a **new blank spreadsheet**
3. Name it: **"લોયાધામ શિબિર-૧ નોંધણી"**
4. **No need to add headers** — they will be added automatically on first submission! ✅

---

## Step 2: Add the Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. **Delete** all the existing code in the editor
3. **Paste** this code:

```javascript
// Column headers — auto-created on first submission
var HEADERS = [
  'નામ', 'ઉંમર', 'મોબાઈલ', 'વોટ્સએપ', 'સરનામું',
  'વર્ષો જોડાયેલા', 'સંતો સંપર્ક', 'પ્રશ્ન ૧', 'પ્રશ્ન ૨',
  'સભ્યોની સંખ્યા', 'સભ્યોની વિગત', 'સબમિટ તારીખ'
];

function ensureHeaders(sheet) {
  var firstCell = sheet.getRange('A1').getValue();
  if (!firstCell || firstCell === '') {
    var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setValues([HEADERS]);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#fff3e0');
    headerRange.setFontColor('#bf360c');
    headerRange.setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
    for (var i = 1; i <= HEADERS.length; i++) {
      sheet.autoResizeColumn(i);
    }
  }
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Auto-create headers if sheet is empty
    ensureHeaders(sheet);

    sheet.appendRow([
      data.name || '',
      data.age || '',
      data.mobile || '',
      data.whatsapp || '',
      data.address || '',
      data.yearsConnected || '',
      data.saintContact || '',
      data.question1 || '',
      data.question2 || '',
      data.membersCount || 0,
      data.members || '',
      data.submittedAt || new Date().toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'})
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('Loyadham Shibir Form Backend is running!')
    .setMimeType(ContentService.MimeType.TEXT);
}

// Run this manually to set up headers without waiting for first submission
function setupHeaders() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  ensureHeaders(sheet);
}
```

4. Click **💾 Save** (or Ctrl+S)
5. Name the project: **"Loyadham Shibir Form"**

> **Optional:** Run `setupHeaders` manually (Run → setupHeaders) to add headers immediately.

---

## Step 3: Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the ⚙️ gear icon → Select **Web app**
3. Set these options:
   - **Description**: "Loyadham Shibir Form Backend"
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone**
4. Click **Deploy**
5. Click **Authorize access** → Choose your Google account → Click **Allow**
6. **Copy the Web App URL**

---

## Step 4: Connect to Your Form

Your form is already connected. If you need to change the URL, edit line 14 in `script.js`.

---

## Step 5: Test It!

1. Open the form in your browser
2. Fill in some test data
3. Click **"ફોર્મ સબમિટ કરો"**
4. Check your Google Sheet — headers + data should appear automatically! 🎉
