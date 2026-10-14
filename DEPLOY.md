# Deploying AdClone AI

This app has two parts:

- **The website** (React, built by Vite into `dist/`).
- **Small server functions** in the `api/` folder that talk to Gemini. Your Gemini API key lives only here, on the server, so visitors can never see or steal it.

Sign-in uses **Firebase Authentication (Google)**, and saved projects live in **Cloud Firestore**. Each user can only see their own data.

You need to do the steps below once. They take about 15 minutes.

---

## 0. Check you can open the Firebase project

The Firebase project in `firebase-applet-config.json` is **`dev-precinct-st3g1`**. It was created automatically by **Google AI Studio**.

1. Go to <https://console.firebase.google.com> signed in with the Google account you used in AI Studio.
2. Look for **dev-precinct-st3g1** in your project list.

**If you can open it:** great, use it and continue to step 1.

**If you can't see it or can't open it** (AI Studio sometimes keeps these projects to itself), make your own:

1. In the Firebase console click **Add project**, give it a name (e.g. `adclone-ai`), and finish the wizard.
2. In the new project: **Build > Firestore Database > Create database** (choose a region near your users, start in *production mode*).
3. **Project settings (gear icon) > General > Your apps > Add app > Web (`</>`)**. Register it and copy the `firebaseConfig` values it shows you.
4. Replace the values in `firebase-applet-config.json` with yours: `projectId`, `appId`, `apiKey`, `authDomain`, `storageBucket`, `messagingSenderId`. Set `"firestoreDatabaseId": ""` (empty) if you created the normal "(default)" database.
5. In `firebase.json`, change `"database"` to `"(default)"` (or your database id), and in `.firebaserc` change `dev-precinct-st3g1` to your new project id.
6. Commit and push those changes.

> The values in `firebase-applet-config.json` (including its `apiKey`) are **public identifiers**, not secrets. Firebase is designed for them to be in the website. Your data is protected by sign-in plus the security rules in `firestore.rules`.

---

## 1. Turn on Google sign-in in Firebase

1. Firebase console > your project > **Build > Authentication**. Click **Get started** if you see it.
2. **Sign-in method** tab > **Add new provider** > **Google** > **Enable**.
3. Pick a support email (yours) and **Save**.

---

## 2. Put the repo on Vercel

1. Go to <https://vercel.com>, sign in with GitHub.
2. **Add New… > Project**, choose **czardiamond/Ad-cloning-**, click **Import**.
3. Vercel should detect **Vite** automatically. Leave Build Command `npm run build` and Output Directory `dist` (these are also set in `vercel.json`).
4. Before clicking Deploy, open **Environment Variables** and add:

   | Name | Value |
   |---|---|
   | `GEMINI_API_KEY` | Your Gemini API key from <https://aistudio.google.com/apikey> (the project needs billing turned on for Veo video and the image models) |
   | `FIREBASE_PROJECT_ID` | `dev-precinct-st3g1` (or your own project id from step 0) |

   Do **not** add a `VITE_` prefix. That would put the key into the website.
5. Click **Deploy**. When it finishes you'll get an address like `https://ad-cloning-xyz.vercel.app`.

If you add or change environment variables later, go to **Deployments**, open the latest one and click **Redeploy** so they take effect.

---

## 3. Allow your Vercel address to use Google sign-in

Firebase only allows sign-in from websites you list.

1. Firebase console > **Authentication > Settings > Authorized domains > Add domain**.
2. Add your Vercel domain **without** `https://`, e.g. `ad-cloning-xyz.vercel.app`.
3. If you later connect a custom domain (e.g. `adclone.ai`), add that too.

If you skip this, the sign-in button shows: *"This website address is not yet authorized for sign-in."*

---

## 4. Deploy the Firestore security rules

The new rules (`firestore.rules`) make sure each person can only read and write their own profile and projects. Until you deploy them, the old "anyone can read and write everything" rules are still live.

**Option A: from your computer (recommended)**

```bash
npm install -g firebase-tools
firebase login
cd Ad-cloning-
firebase deploy --only firestore:rules
```

`firebase.json` already points at `firestore.rules` and at the app's named database, and `.firebaserc` points at `dev-precinct-st3g1`.

**Option B: paste in the console**

Firebase console > **Firestore Database** > pick the database named `ai-studio-adcloneai-…` (top of the page, if there's more than one) > **Rules** tab > paste the contents of `firestore.rules` > **Publish**.

---

## 5. Try it

1. Open your Vercel address.
2. Click the account button (top right) > **Continue with Google**.
3. Generate some ad copy or an image. It should work without any key prompt.
4. Save a project, sign out, sign back in: your project should still be there. Sign in with a different Google account: it should **not** see the first account's projects.

---

## Running it on your own computer

The AI features need the `api/` functions, so use the Vercel CLI instead of plain `npm run dev`:

```bash
npm install
npm install -g vercel
vercel link          # connect to your Vercel project once
vercel env pull .env.local   # downloads GEMINI_API_KEY and FIREBASE_PROJECT_ID
vercel dev           # runs the website and /api together on http://localhost:3000
```

Add `localhost` to Firebase **Authorized domains** if it isn't there already (it usually is by default).

---

## Good to know

- **Everyone starts on the Free tier.** The `tier` field is stored on each user's profile in Firestore. The browser is not allowed to change it; paid plans will be switched on later from the server after a payment.
- **Request size limit:** each AI request is capped at 4 MB (Vercel's own limit is about 4.5 MB). Very large reference images or long audio clips will be rejected with a friendly message.
- **Video:** Veo videos are generated on the server and downloaded through `/api/video-file`, which adds the key server-side. The finished video plays from the browser's memory, so it isn't kept after a page reload yet (saving media to cloud storage is planned for a later phase).
- **Old data:** projects saved before this change were stored by email, not by account, so they won't show up after signing in with Google.
