# 🅿️ SpotLink End-to-End Testing Guide

This guide provides a comprehensive, step-by-step walkthrough to test the entire SpotLink application—from authentications and discovery to real-time dynamic pricing, reservations, and visitor parking passes.

---

## 🚀 Step 1: Launch the Services

To test the application, both the server (backend API + persistent local MongoDB database) and client (Vite React frontend) must be running concurrently.

1. **Start the Backend Server:**
   Open a terminal window in the root directory and run:
   ```bash
   npm run server
   ```
   *This starts Nodemon on Port 5000, boots the persistent local WiredTiger MongoDB instance, and automatically seeds 3 premium parking spots in Pune, Mumbai, and Bangalore.*

2. **Start the React Frontend:**
   Open a second terminal window in the root directory and run:
   ```bash
   npm run dev
   ```
   *This launches the Vite Dev server (typically on `http://localhost:5173`).*

3. **Open the App:**
   Open your browser and navigate to the frontend URL (e.g. `http://localhost:5173`).

---

## 👤 Step 2: Sign Up & Authentication

To experience both sides of the SpotLink ecosystem, register a **Driver** account and an **Owner** account.

### A. Register the Driver Account
1. Click **Sign Up** on the top right.
2. Fill in the form:
   * **Name:** `Ramesh Driver`
   * **Email:** `ramesh@driver.com`
   * **Password:** `password123`
   * **Role:** Select **Driver**
3. Submit the registration. You will be automatically signed in and redirected to the Home page.
4. Click **Logout** on the top bar.

### B. Register the Owner Account
1. Click **Sign Up** again.
2. Fill in the form:
   * **Name:** `Suresh Owner`
   * **Email:** `suresh@owner.com`
   * **Password:** `password123`
   * **Role:** Select **Owner**
3. Submit the registration and click **Logout**.

---

## 🏠 Step 3: Register a Hosted Parking Spot (Owner Console)

1. Log in using the **Owner** credentials (`suresh@owner.com` / `password123`).
2. Navigate to the **Owner Console** or **My Spaces** page.
3. Click the **Register Space** or **Add Space** button.
4. Input the details for your spot:
   * **Title:** `Lonavala Weekend Valet`
   * **Base Price (₹/hr):** `60`
   * **Total Spots:** `10`
   * **Address:** `Plot 15, Gold Valley Road`
   * **City:** `Pune`
   * **Amenities:** Check `CCTV`, `Security`, and `Covered`.
5. Submit the form. Notice the spot is saved directly to MongoDB, and is displayed instantly under your hosted spaces list with `10 / 10 Slots Free`!
6. Click **Logout**.

---

## 🔍 Step 4: Search & Real-Time Discovery (Driver Console)

1. Log in using the **Driver** credentials (`ramesh@driver.com` / `password123`).
2. Go to the **Find Parking** page.
3. **Explore seeded spots:**
   * You will see the newly created `Lonavala Weekend Valet` along with the automatically seeded Pune, Mumbai, and Bangalore spots!
4. **Test Search and Filter controls:**
   * Type `Lonavala` in the search bar and click Search. Only your newly added spot will appear!
   * Toggle the **Filters** panel. Filter by type (e.g., `Residential` or `Commercial`), or set a max price cap. Watch results update in real-time.
5. **Observe Dynamic Pricing & Badges:**
   * High occupancy spots will display higher prices and show a red **`🔥 High demand`** badge next to them!

---

## 📅 Step 5: Reserve and Confirm a Spot (Driver Console)

1. On your selected parking spot card, click **Book Now**.
2. Set your reservation timeframes:
   * **Start Time:** Select a time starting 1 hour from now.
   * **End Time:** Select a time 4 hours after the start.
3. Observe the **Estimated Booking Amount Summary** on the right:
   * It calculates the `Duration` (e.g., 3 hours) and multiplies it by the spot's `Dynamic Price` instantly!
4. Input your vehicle details:
   * **Vehicle Number:** `MH 12 AB 7777`
   * **Vehicle Type:** `Car`
5. Click **Confirm & Pay**.
6. A success message will appear displaying your **Unique Booking Transaction ID**! You will be automatically redirected to your ledger.

---

## 📊 Step 6: Console Tracking (Driver Console)

1. Go to the **Dashboard** page.
2. Under the **Driver Console** tab, look at your booking ledger:
   * You will see the reservation details: spot name, date/time, total amount, status (`confirmed` or `active`), and unique transaction code.
3. **Test atomic cancellations:**
   * Click the **Cancel** button on your active reservation.
   * Confirm the prompt. The status will immediately flip to `cancelled` and free up a spot on the backend database automatically!

---

## 🔒 Step 7: Visitor Security Pass (Resident Guest Parking)

This simulator tests residential building visitor authorizations (e.g., guard gate check-in).

1. Log in as your **Owner / Resident** account (`suresh@owner.com`).
2. Navigate to the **Guest Parking** page.
3. Click **Register Guest** and fill out the visitor form:
   * **Guest Name:** `Amit Kumar`
   * **Vehicle Number:** `MH 14 CC 5555`
   * **Assigned Slot:** `Visitor Slot 3`
   * **Validity Limit:** Choose tomorrow's date.
4. Click **Register Guest**.
5. **Behold the security code generation:**
   * A success banner pops up displaying a **6-character cryptographically secure token** (e.g., `3F9A1B`) in large, prominent font.
   * Click the **Copy Code** button.
6. **Simulate Security Gate Verification:**
   * Paste your copied code into the **Verify Code** input box and click **Verify**.
   * A confirmation alert will load displaying `Verification Successful: Registered visitor Amit Kumar has been authorized to park at Visitor Slot 3`.
   * Scroll down to the **Visitor History** ledger—Amit's status has automatically flipped from `pending` to `active`!

---

🎉 **Congratulations!** You have successfully completed the end-to-end integration test of the SpotLink Web App!
