/**
 * The LUXE Clinique — booking-form receiver (Google Apps Script).
 *
 * Paste this into a Google Sheet's Extensions → Apps Script, set SECRET and NOTIFY_EMAIL,
 * then Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone).
 * The web app URL goes into Vercel as ENQUIRY_WEBHOOK_URL and SECRET as ENQUIRY_WEBHOOK_SECRET.
 * See docs/BOOKING_FORM_SETUP.md.
 */

// Must match ENQUIRY_WEBHOOK_SECRET in Vercel. Use a long random string.
const SECRET = "PASTE-THE-SAME-SECRET-YOU-SET-IN-VERCEL";
// Where new-enquiry alerts are emailed (comma-separate several addresses).
const NOTIFY_EMAIL = "luxecliniqueaesthetics@gmail.com";
const SHEET_NAME = "Enquiries";
// Leave empty when the script is opened from the sheet (Extensions → Apps Script).
// For a standalone script (script.new), paste the spreadsheet ID from its URL: /spreadsheets/d/<ID>/edit
const SPREADSHEET_ID = "";

const COLUMNS = ["Received", "Name", "Phone", "Email", "Treatment", "Preferred time", "Message", "Consent", "Status"];

function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (!SECRET || data.secret !== SECRET) return json_({ ok: false, error: "unauthorised" });
    if (data.type !== "appointment-enquiry") return json_({ ok: false, error: "bad type" });

    const sheet = sheet_();
    const row = [
      new Date(data.receivedAt || Date.now()),
      safe_(data.name),
      safe_(data.phone),
      safe_(data.email),
      safe_(data.treatment),
      safe_(data.preferredTime),
      safe_(data.message),
      data.consent ? "Yes" : "No",
      "New",
    ];
    sheet.appendRow(row);

    if (NOTIFY_EMAIL) {
      const lines = COLUMNS.slice(1, 8).map((c, i) => c + ": " + (row[i + 1] || "—"));
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: "New appointment enquiry — " + (row[1] || "website"),
        body: "A new enquiry was sent from the website.\n\n" + lines.join("\n") + "\n\nOpen the sheet: " + book_().getUrl(),
      });
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/** Optional health check: opening the web app URL in a browser shows {"ok":true,"service":"luxe-enquiries"}. */
function doGet() {
  return json_({ ok: true, service: "luxe-enquiries" });
}

function book_() {
  return SPREADSHEET_ID ? SpreadsheetApp.openById(SPREADSHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
}

function sheet_() {
  const ss = book_();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight("bold");
  }
  return sheet;
}

/** Stop spreadsheet formula injection (values starting with = + - @ are stored as text). */
function safe_(v) {
  const s = String(v == null ? "" : v);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
