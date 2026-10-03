# 📊 Google Sheets Setup Guide — લોયાધામ શિબિર ફોર્મ

Follow these steps to save all public form submissions directly to your Google Sheet.

---

## Step 1: Create a Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com)
2. Create a **new blank spreadsheet**
3. Name it: **"લોયાધામ શિબિર-૧ નોંધણી"**
4. **No need to add headers** — they will be added automatically! ✅

---

## Step 2: Add the Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. **Delete** all the existing code in the editor
3. **Paste** this code:

```javascript
// 9 fields per family member
var MEMBER_FIELDS = ['name', 'relation', 'age', 'mobile', 'from', 'to', 'skill', 'health', 'seva'];
var MEMBER_LABELS = {
  'name': 'નામ', 'relation': 'સંબંધ', 'age': 'ઉંમર', 'mobile': 'મોબાઈલ',
  'from': 'રોકાણ_થી', 'to': 'રોકાણ_સુધી', 'skill': 'આવડત', 'health': 'તકલીફ', 'seva': 'સેવા'
};
var BASE_HEADERS = ['નામ', 'ઉંમર', 'મોબાઈલ', 'વોટ્સએપ', 'સરનામું', 'વર્ષો જોડાયેલા', 'સંતો સંપર્ક', 'પ્રશ્ન ૧', 'પ્રશ્ન ૨', 'સભ્યોની સંખ્યા', 'સબમિટ તારીખ'];

// How many member column-sets currently exist in the sheet?
function getCurrentMemberCount(sheet) {
  var lastCol = sheet.getLastColumn();
  var extraCols = lastCol - BASE_HEADERS.length;
  if (extraCols <= 0) return 0;
  return Math.floor(extraCols / MEMBER_FIELDS.length);
}

// Build headers for one member (e.g., સભ્ય3_નામ, સભ્ય3_સંબંધ, ...)
function memberHeaders(memberNum) {
  var h = [];
  for (var j = 0; j < MEMBER_FIELDS.length; j++) {
    h.push('સભ્ય' + memberNum + '_' + MEMBER_LABELS[MEMBER_FIELDS[j]]);
  }
  return h;
}

// Ensure the sheet has at least `needed` member column-sets
function ensureColumns(sheet, needed) {
  var firstCell = sheet.getRange('A1').getValue();

  // First time: create base headers
  if (!firstCell || firstCell === '') {
    var headers = BASE_HEADERS.slice();
    // Add columns for however many members this first submission has
    for (var i = 1; i <= needed; i++) {
      headers = headers.concat(memberHeaders(i));
    }
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#fff3e0');
    headerRange.setFontColor('#bf360c');
    headerRange.setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
    for (var k = 1; k <= BASE_HEADERS.length; k++) {
      sheet.autoResizeColumn(k);
    }
    return;
  }

  // Sheet already has headers — check if we need more member columns
  var current = getCurrentMemberCount(sheet);
  if (needed > current) {
    // Add new member column headers (only the new ones)
    for (var i = current + 1; i <= needed; i++) {
      var newHeaders = memberHeaders(i);
      var startCol = BASE_HEADERS.length + ((i - 1) * MEMBER_FIELDS.length) + 1;
      var range = sheet.getRange(1, startCol, 1, newHeaders.length);
      range.setValues([newHeaders]);
      range.setFontWeight('bold');
      range.setBackground('#fff3e0');
      range.setFontColor('#bf360c');
      range.setHorizontalAlignment('center');
    }
  }
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    var memberCount = parseInt(data.membersCount) || 0;

    // Dynamically expand columns if this submission has more members than before
    ensureColumns(sheet, memberCount);

    // Build the row: base fields
    var row = [
      data.name || '',
      data.age || '',
      data.mobile || '',
      data.whatsapp || '',
      data.address || '',
      data.yearsConnected || '',
      data.saintContact || '',
      data.question1 || '',
      data.question2 || '',
      memberCount,
      data.submittedAt || new Date().toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'})
    ];

    // Add member fields — fill up to the current max columns in the sheet
    var maxMembers = Math.max(memberCount, getCurrentMemberCount(sheet));
    for (var i = 1; i <= maxMembers; i++) {
      for (var j = 0; j < MEMBER_FIELDS.length; j++) {
        var key = 'member' + i + '_' + MEMBER_FIELDS[j];
        row.push(data[key] || '');
      }
    }

    sheet.appendRow(row);

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

// Optional: run manually to set up base headers only
function setupHeaders() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  ensureColumns(sheet, 0);
}
```

4. Click **💾 Save** (or Ctrl+S)
5. **Deploy → New deployment** → Web app → Anyone → Deploy
6. Copy the new URL and update line 14 in `script.js`

---

## How Dynamic Columns Work

| Submission | Members | What Happens |
|---|---|---|
| User 1 (1 member) | 1 | Creates base headers + 9 columns for સભ્ય1 |
| User 2 (0 members) | 0 | No new columns added, member columns stay empty |
| User 3 (4 members) | 4 | Adds 27 new columns (સભ્ય2, સભ્ય3, સભ્ય4) |
| User 4 (2 members) | 2 | No new columns needed, fills સભ્ય1 & સભ્ય2 only |

The sheet **grows only when needed** — no wasted columns! 🎉
