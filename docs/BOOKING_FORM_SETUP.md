# Connecting the booking form

The website's booking form posts to `/api/enquiry`, which forwards each enquiry to
`ENQUIRY_WEBHOOK_URL`. We use a free **Google Apps Script** web app owned by the
clinic's Google account. Each enquiry is:

- added as a new row in a Google Sheet called **Enquiries** (with a *Status* column you can update), and
- emailed to `luxecliniqueaesthetics@gmail.com` as a "New appointment enquiry" alert.

No third-party service sees the data, and there is nothing to pay.

## 1. Create the Sheet and script (about 5 minutes)

1. Sign in to the clinic's Google account and open <https://sheets.new>. Name the sheet
   **LUXE – Website enquiries**.
2. Click **Extensions → Apps Script**.
3. Delete the sample code. Paste in everything from `scripts/enquiry-apps-script.gs`.
4. At the top of the script, set:
   - `SECRET` — the secret string you were given (it must match `ENQUIRY_WEBHOOK_SECRET` in Vercel).
   - `NOTIFY_EMAIL` — who gets the alert emails (comma-separate several addresses).
5. Click **Save**.

## 2. Deploy it as a web app

1. Click **Deploy → New deployment**. Next to "Select type", click the gear and choose **Web app**.
2. Set **Execute as: Me** and **Who has access: Anyone**. ("Anyone" is needed so the website can
   post to it. The secret stops anyone else from adding rows.)
3. Click **Deploy**, then **Authorize access**. Choose the clinic account. On "Google hasn't verified this app",
   click **Advanced → Go to (project) (unsafe)** — this is your own script — and **Allow**.
4. Copy the **Web app URL**. It ends in `/exec`.

To check it's live, open the URL in a browser. You should see `{"ok":true,"service":"luxe-enquiries"}`.

## 3. Connect it to the website

In Vercel go to **Project → Settings → Environment Variables** and add, for **Production**:

| Name | Value |
|---|---|
| `ENQUIRY_WEBHOOK_URL` | the `/exec` web app URL |
| `ENQUIRY_WEBHOOK_SECRET` | the same secret as in the script |

Then redeploy. Send a test enquiry from `/contact` and check that a row appears in the sheet and
the alert email arrives.

## Changing the script later

After editing the script, use **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**.
That keeps the same URL. Creating a *new* deployment instead gives a new URL, which would then need
updating in Vercel.

## Privacy notes

- The sheet holds personal data (names, phone numbers, health-related messages). Share it only with
  staff who handle bookings, and delete rows you no longer need, in line with the privacy notice.
- If the secret is ever exposed, change it in both the script and Vercel, then redeploy both.
