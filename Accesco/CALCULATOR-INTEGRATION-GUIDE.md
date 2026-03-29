# 📊 ACCESSO CALCULATOR - NEXT.JS INTEGRATION GUIDE

## 🎯 What You're Building

A complete financial calculator with:
- ✅ Smart budget planning (Needs/Wants/Savings)
- ✅ CalcIQ Intelligence hero section
- ✅ Interactive breakdown cards
- ✅ Responsive design matching original HTML

---

## 📁 FILES PROVIDED

### **1. CalcIQHero.jsx** 
Hero section for homepage (purple gradient card with "Launch Calculator" button)

### **2. CalculatorPage.jsx**
Full calculator page component

### **3. calculator.css**
Complete styling matching the HTML design

---

## 🚀 INSTALLATION STEPS

### **Step 1: Create Calculator Page**

```bash
# Create directory
mkdir -p app/calculator

# Add files
app/calculator/page.jsx          ← CalculatorPage.jsx
app/calculator/calculator.css    ← calculator.css
```

**File structure:**
```
app/
├── calculator/
│   ├── page.jsx           (CalculatorPage.jsx)
│   └── calculator.css     (calculator.css)
├── page.jsx               (Homepage)
└── components/
    └── CalcIQHero.jsx     (Hero section)
```

---

### **Step 2: Add Hero to Homepage**

Open `app/page.jsx` and add the CalcIQ hero section:

```jsx
// app/page.jsx
import CalcIQHero from './components/CalcIQHero'

export default function HomePage() {
  return (
    <div>
      {/* Your existing homepage content */}
      
      {/* Add CalcIQ Hero Section */}
      <CalcIQHero />
      
      {/* Rest of your content */}
    </div>
  )
}
```

---

### **Step 3: Create Components Folder**

```bash
# Create components directory if it doesn't exist
mkdir -p app/components

# Add CalcIQHero component
app/components/CalcIQHero.jsx  ← CalcIQHero.jsx
```

---

### **Step 4: Add Logo Image (Optional)**

If you have an Accesco logo:

```bash
# Add to public folder
public/images/accesco.png  ← Your logo
```

If you don't have a logo, the component will work without it.

---

## 🎨 CUSTOMIZATION

### **Change Colors**

Edit `calculator.css`:

```css
:root {
  --accent: #8b0a14;      /* Main red color */
  --accent-2: #c03b3b;    /* Secondary red */
  --muted: #8a8a8a;       /* Gray text */
  --bg: #fff7f5;          /* Page background */
}
```

### **Change Hero Colors**

Edit `CalcIQHero.jsx`, look for the `<style jsx>` section:

```css
background: linear-gradient(135deg, #4a0e4e 0%, #2d1b69 100%);
/* Change to your colors */
```

---

## 📱 HOW IT WORKS

### **User Flow:**

1. **Homepage** → User sees CalcIQ hero section
2. **Click "Launch Calculator"** → Navigates to `/calculator`
3. **Fill in details:**
   - Monthly income
   - Rent/EMI
   - City & lifestyle
   - Household size
4. **Click "CALCULATE PLAN"** → Shows budget breakdown
5. **View results:**
   - Needs (rent, grocery, transport, bills)
   - Wants (shopping, dining, entertainment)
   - Savings (monthly surplus)
6. **Set goal** → Enter savings goal and plan

---

## ✨ FEATURES

### **CalcIQ Hero (Homepage)**
- ✅ Purple gradient design
- ✅ "Powered by AI" badge
- ✅ Animated savings card
- ✅ Progress dots animation
- ✅ Responsive layout
- ✅ Click → Navigate to calculator

### **Calculator Page**
- ✅ Income validation (min ₹500)
- ✅ Smart budget allocation
- ✅ Lifestyle-based calculations
- ✅ Editable breakdown values
- ✅ Savings goal planning
- ✅ Red accent theme
- ✅ Mobile responsive

---

## 🔧 ADVANCED: Add to Existing Homepage

If you already have a homepage with content:

```jsx
// app/page.jsx
import CalcIQHero from './components/CalcIQHero'

export default function HomePage() {
  return (
    <main>
      {/* Existing hero/banner */}
      <section className="hero">
        {/* Your content */}
      </section>

      {/* Services section */}
      <section className="services">
        {/* Your services */}
      </section>

      {/* ADD CALCIQ HERO HERE */}
      <CalcIQHero />

      {/* Rest of content */}
      <section className="about">
        {/* Your about */}
      </section>
    </main>
  )
}
```

---

## 🎯 NAVIGATION SETUP

The hero button navigates to `/calculator`. Make sure:

```jsx
// In CalcIQHero.jsx, line ~17
const handleLaunchCalculator = () => {
  window.location.href = '/calculator'
}
```

For Next.js Link navigation (preferred):

```jsx
import Link from 'next/link'

// Replace the button with:
<Link href="/calculator">
  <button className="launch-btn">
    Launch Calculator
    <svg>...</svg>
  </button>
</Link>
```

---

## 📊 CALCULATION LOGIC

### **Budget Allocation:**

**Student/Frugal:**
- Needs: 45%
- Wants: 25%
- Savings: 30%

**Working Professional:**
- Needs: 50%
- Wants: 30%
- Savings: 20%

**High Comfort:**
- Needs: 45%
- Wants: 40%
- Savings: 15%

### **Needs Breakdown:**
- Rent: User-provided
- Grocery: 40% of remaining needs × household size
- Transport: 35% of remaining needs
- Bills: 25% of remaining needs

### **Wants Breakdown:**
- Shopping: 40%
- Dining: 35%
- Entertainment: 25%

---

## 🐛 TROUBLESHOOTING

### **Logo not showing**
- Check `public/images/accesco.png` exists
- Or remove logo: Delete `<img>` tag from brand-box

### **Calculator page not found**
- Verify file at `app/calculator/page.jsx`
- Restart dev server: `npm run dev`

### **Styles not applying**
- Check `import './calculator.css'` at top of page.jsx
- Clear browser cache: `Ctrl + Shift + R`

### **Hero not showing on homepage**
- Verify `CalcIQHero.jsx` in `app/components/`
- Check import path in homepage

---

## 📏 RESPONSIVE BREAKPOINTS

- **Desktop:** 1024px+ (side-by-side grid)
- **Tablet:** 768px-1023px (stacked)
- **Mobile:** <768px (full-width cards)

---

## 🎨 DESIGN MATCHING ORIGINAL

| Feature | Original HTML | Next.js Replica |
|---------|---------------|-----------------|
| Red accent theme | ✅ | ✅ |
| Brand header | ✅ | ✅ |
| Two-column layout | ✅ | ✅ |
| Input validation | ✅ | ✅ |
| Breakdown cards | ✅ | ✅ |
| Editable values | ✅ | ✅ |
| Savings goal | ✅ | ✅ |
| Mobile responsive | ✅ | ✅ |

---

## ✅ SUCCESS CHECKLIST

After installation, verify:

- [ ] CalcIQ hero shows on homepage
- [ ] "Launch Calculator" button works
- [ ] Calculator page loads at `/calculator`
- [ ] Can input income and calculate
- [ ] Results show in 3 cards
- [ ] Values are editable
- [ ] Mobile layout works
- [ ] All styles applied correctly

---

## 🎉 YOU'RE DONE!

Your calculator is now fully integrated! 

**Test URLs:**
- Homepage: `http://localhost:3000`
- Calculator: `http://localhost:3000/calculator`

**Next Steps:**
1. Customize colors to match your brand
2. Add your logo
3. Test on mobile devices
4. Deploy! 🚀
