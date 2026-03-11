# Cleaning Su Oficina - Commercial Booking Form

Professional commercial cleaning services booking form for Anchorage, Alaska.

## 🚀 Quick Deploy to Vercel

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it: `cleaning-su-oficina` (or whatever you prefer)
3. Make it **Public** or **Private** (your choice)
4. **DO NOT** initialize with README, .gitignore, or license (we already have these)

### Step 2: Upload Project to GitHub

**Option A: Using GitHub Website (Easiest)**
1. Download this entire `cleaning-su-oficina-project` folder to your computer
2. Go to your new GitHub repository
3. Click "uploading an existing file"
4. Drag all the files from the project folder
5. Click "Commit changes"

**Option B: Using Git Command Line**
```bash
cd cleaning-su-oficina-project
git init
git add .
git commit -m "Initial commit - Cleaning Su Oficina booking form"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/cleaning-su-oficina.git
git push -u origin main
```

### Step 3: Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect it's a React app
5. Click "Deploy"
6. Wait 2-3 minutes for deployment
7. Done! You'll get a URL like `cleaning-su-oficina.vercel.app`

### Step 4: Configure Google Places API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to APIs & Services → Credentials
3. Find your API key: `AIzaSyB18lv_Rulnv7jjFrM0PP57bCLO4U4_A_I`
4. Click "Edit API key"
5. Under "Website restrictions" → Add your Vercel URL
6. Example: `*.vercel.app/*`
7. Save

### Step 5: Set Up Custom Domain (Optional)

**Recommended:** `oficina.cleaningsucasa.com` or `commercial.cleaningsucasa.com`

**In Vercel:**
1. Go to your project → Settings → Domains
2. Add domain: `oficina.cleaningsucasa.com`
3. Vercel will give you DNS settings

**In GoDaddy:**
1. Go to DNS settings for cleaningsucasa.com
2. Add CNAME record:
   - Type: CNAME
   - Name: oficina
   - Value: cname.vercel-dns.com
   - TTL: 600
3. Save and wait 10-20 minutes

---

## 📧 Email Configuration

Form submissions go to: **AkCleaningSuCasa@gmail.com**

**Important:** First submission requires email confirmation:
1. Submit a test booking
2. Check AkCleaningSuCasa@gmail.com inbox
3. Click the FormSubmit confirmation link
4. All future submissions will work automatically

---

## 💰 Pricing Structure

### Base Rates (per sqft/month):
- **Office:** $0.12/sqft
- **Healthcare:** $0.18/sqft
- **Hospitality:** $0.15/sqft
- **Retail:** $0.10/sqft
- **Industrial:** $0.08/sqft

### Frequency Discounts:
- Daily: 20% OFF
- 5x/week: 15% OFF
- 3x/week: 10% OFF
- 2x/week: 5% OFF
- Weekly: No discount
- Bi-weekly: 10% upcharge

### Room Pricing:
- Workstations: $8 each
- Conference Rooms: $25 each
- Break Rooms: $30 each
- Restrooms: $35 each
- Exam Rooms: $40 each (medical grade)
- Procedure Rooms: $60 each (surgical grade)
- Guest Rooms: $45 each
- Waiting/Common Areas: $30-35 each
- Dining Areas: $50 each

### Add-ons:
- Window Cleaning: $150/visit
- Floor Waxing: $200/visit
- Carpet Cleaning: $0.35/sqft
- Pressure Washing: $0.25/sqft
- Post-Construction: $0.50/sqft
- Disinfection: $0.15/sqft

### Minimums:
- Office: $299
- Healthcare: $399
- Hospitality: $349
- Retail: $249
- Industrial: $199

---

## 🏢 Market Segments

1. **Office Buildings** - Corporate, Law Firms, Real Estate
2. **Healthcare** - Dental, Medical Clinics, Physical Therapy, Optometry
3. **Hospitality** - Hotels, B&Bs, Lodging
4. **Retail** - Shops, Stores, Boutiques
5. **Industrial** - Warehouses, Manufacturing

---

## 📱 Features

- ✅ 4-step booking wizard
- ✅ Google Places address autocomplete
- ✅ Market segment-specific options
- ✅ Real-time price calculation
- ✅ Sticky price sidebar (desktop)
- ✅ Sticky bottom price (mobile)
- ✅ FormSubmit email integration
- ✅ Animated gradient backgrounds
- ✅ Fully responsive design
- ✅ Professional commercial aesthetic

---

## 🛠 Local Development

```bash
npm install
npm start
```

Opens on `http://localhost:3000`

---

## 📞 Support

For questions or issues, contact: **AkCleaningSuCasa@gmail.com**

---

**Built with React ⚛️ | Deployed on Vercel ▲**
