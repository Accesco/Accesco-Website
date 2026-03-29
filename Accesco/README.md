# Accesco Integrated Platform

This is the integrated Accesco platform with Grokly marketplace functionality powered by Firebase.

## Features

- **Homepage**: Full Accesco homepage with all services
- **Grokly Service**: Complete grocery and marketplace platform at `/services/grokly`
- **Firebase Integration**: Real-time product management and order tracking
- **Google Maps**: Location-based address selection

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing)
3. Go to Project Settings → Your Apps
4. Copy your Firebase configuration
5. Create a `.env.local` file in the root directory
6. Add your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Configure Firestore Database

1. In Firebase Console, go to Firestore Database
2. Create database (start in test mode for development)
3. The app will automatically seed products on first load

### 4. (Optional) Configure Google Maps

For the Grokly address location feature:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

Get your API key from [Google Cloud Console](https://console.cloud.google.com/)

### 5. Add Images and Assets

Place your images in the `public/images/` directory. Required images:
- Logo files (accesco_white.png, grokerly_logo.png, etc.)
- Service visuals
- About section images

Refer to `IMAGES_REQUIRED.md` for the complete list.

### 6. Add JavaScript Files

Place required JavaScript files in the `public/js/` directory:
- `sidebar-menu.js`
- `stack-cards.js`

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the homepage.

Navigate to [http://localhost:3000/services/grokly](http://localhost:3000/services/grokly) for the Grokly marketplace.

## Project Structure

```
├── app/
│   ├── page.js                 # Homepage
│   ├── layout.js               # Root layout
│   ├── services/
│   │   └── grokly/
│   │       ├── page.jsx        # Grokly marketplace
│   │       └── grokly.css      # Grokly styles
│   └── hooks/
│       ├── useProducts.js      # Firebase products hook
│       └── useOrders.js        # Firebase orders hook
├── components/                 # Reusable components
├── lib/
│   └── firebase.js            # Firebase configuration
├── public/
│   ├── images/                # Add your images here
│   └── js/                    # Add your JS files here
└── .env.local                 # Your environment variables (create this)
```

## Firebase Collections

The app uses two main Firestore collections:

1. **products**: Product catalog (auto-seeded)
   - id, name, price, category, image

2. **orders**: Customer orders
   - items, total, address, coordinates, status, createdAt

## Features

### Grokly Marketplace
- Product browsing with categories
- Real-time cart management
- Address selection with Google Maps integration
- Firebase-powered order placement
- Responsive design

### Homepage
- Hero section
- Service cards
- CalcIQ section
- Gaming arena
- About section
- Contact form
- Download section
- Footer

## Notes

- Firebase will work with fallback data if not configured
- The app shows a "🔥 Firebase Live" badge when connected to Firebase
- All services are integrated but Grokly is the only fully functional marketplace
- The design and templates remain unchanged as requested

## Build for Production

```bash
npm run build
npm start
```

## Support

For issues or questions, please refer to the project documentation or contact the development team.
