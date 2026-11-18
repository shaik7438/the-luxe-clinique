# Deploying The LUXE Clinique to Vercel

This project is ready to deploy as-is:

| File | What it does |
|---|---|
| `vercel.json` | Tells Vercel it's a Next.js site and runs it in Mumbai (`bom1`), closest to Delhi. Adds security headers and 30-day caching for images. |
| `package.json` → `engines` / `.nvmrc` | Uses Node 22 (Next.js needs 20.9 or newer). |
| `.env.example` | Lists the environment variables to set in Vercel. |
| `next.config.ts` | Permanently redirects the old WordPress addresses to the new pages. |

---

## 1. Put the project on GitHub

**In the browser (no commands)**
1. Unzip `luxe-clinique-website-github.zip`.
2. Go to <https://github.com/new>, name the repository `luxe-clinique-website`, choose **Private**, and click **Create repository**. Don't tick README, .gitignore or licence.
3. Click **"uploading an existing file"**. Drag in everything *inside* the folder except `docs` and commit. Then upload the `docs` folder in a second commit, because GitHub allows at most 100 files per upload.
4. Turn on hidden files in File Explorer (**View → Show → Hidden items**) so that `.gitignore`, `.nvmrc` and `.env.example` are uploaded too.

**Or with Git**
```bash
git remote add origin https://github.com/YOUR-USERNAME/luxe-clinique-website.git
git push -u origin main
```

## 2. Import into Vercel

1. Go to <https://vercel.com> and choose **Continue with GitHub**.
2. Click **Add New… → Project**, find `luxe-clinique-website`, and click **Import**.
3. The settings fill in automatically from `vercel.json`. Leave Root Directory as `./`.
4. Open **Environment Variables** and add the ones in step 3.
5. Click **Deploy**. It takes about 2–3 minutes, and you'll get a link like `https://luxe-clinique-website.vercel.app`.

Every later `git push` to `main` redeploys automatically. Other branches get their own preview links.

## 3. Environment variables

Add these under **Project → Settings → Environment Variables**, then click **Redeploy**.

| Name | Example value | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.luxeclinique.com` | Used for the sitemap, SEO and sharing previews. Use the `.vercel.app` link until the domain is connected. |
| `ENQUIRY_WEBHOOK_URL` | `https://hooks.zapier.com/hooks/catch/…` | Where the booking form sends enquiries. Without it, the live form says online enquiries aren't connected and shows phone, WhatsApp and email instead. |
| `NEXT_PUBLIC_HERO_GLB` | *(leave empty)* | Optional 3D model. Not needed. |

**Connect the form** — recommended: a free Google Sheet + email alert, see `docs/BOOKING_FORM_SETUP.md` (also set `ENQUIRY_WEBHOOK_SECRET`).

**Or connect the form with Zapier**
1. Create a Zap with the trigger **Webhooks by Zapier → Catch Hook**.
2. Copy the webhook URL it gives you and paste it into Vercel as `ENQUIRY_WEBHOOK_URL`.
3. Add an action, such as **Gmail → Send email** to `luxecliniqueaesthetics@gmail.com`, or a Google Sheets row.
4. Redeploy, then send a test enquiry from `/contact`.

## 4. Connect luxeclinique.com

1. In Vercel go to **Project → Settings → Domains** and add `luxeclinique.com` and `www.luxeclinique.com`.
2. At your domain registrar, set these DNS records:

   | Type | Name | Value |
   |---|---|---|
   | A | `@` | `76.76.21.21` |
   | CNAME | `www` | `cname.vercel-dns.com` |

   Remove any old `@`/`www` A or CNAME records that point at the WordPress host. **Keep the MX (email) records** as they are.
3. Wait for **Valid Configuration**. This can take from a few minutes up to 24 hours, and HTTPS is set up automatically.
4. Pick the primary address (for example, redirect the bare domain to `www`). Update `NEXT_PUBLIC_SITE_URL` to match and redeploy.

## 5. After going live

- Check the home page, a treatment page and the contact form on both phone and desktop.
- Add the site to Google Search Console and submit `/sitemap.xml`.
- Go through `docs/APPROVALS.md` before announcing the site: clinical review, phone numbers and opening hours, and the legal pages.

## Updating and rolling back

```bash
git add -A
git commit -m "Update content"
git push
```

If a deployment goes wrong: **Vercel → Deployments →** pick the previous good one **→ ⋯ → Promote to Production**.

## Deploying from the command line instead (optional)

```bash
npm i -g vercel
vercel login
vercel          # preview deployment
vercel --prod   # production deployment
```
