# Firebase Setup Guide for Grokly

This guide will help you set up Firebase for the Grokly marketplace.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name (e.g., "accesco-platform")
4. Follow the setup wizard

## Step 2: Create Web App

1. In your Firebase project, click the web icon (</>) to add a web app
2. Register your app with a nickname (e.g., "Accesco Web")
3. Copy the Firebase configuration object

## Step 3: Set Up Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location closest to your users
5. Click "Enable"

### Security Rules (for production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products - read-only for clients
    match /products/{productId} {
      allow read: if true;
      allow write: if false; // Only admins should write
    }
    
    // Orders - users can create, read their own
    match /orders/{orderId} {
      allow create: if true;
      allow read: if true; // Modify based on your auth setup
    }
  }
}
```

## Step 4: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Optional: Google Maps for location feature
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...
```

## Step 5: Test the Connection

1. Run `npm install` to install Firebase SDK
2. Run `npm run dev` to start the development server
3. Navigate to `http://localhost:3000/services/grokly`
4. Look for the "🔥 Firebase Live" badge in the header
5. If connected, the badge will appear and products will be synced

## Step 6: Verify Data in Firestore

1. Go to Firebase Console → Firestore Database
2. You should see a `products` collection with 12 products
3. When you place an order, an `orders` collection will be created

## Optional: Set Up Google Maps

For the location/address feature in Grokly:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Maps JavaScript API" and "Places API"
4. Create credentials (API key)
5. Add the API key to your `.env.local`:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

## Troubleshooting

### Firebase Not Connecting

- Check if `.env.local` exists and has correct values
- Verify API key starts with "AIza"
- Make sure environment variables are prefixed with `NEXT_PUBLIC_`
- Restart the dev server after adding `.env.local`

### Products Not Loading

- Check browser console for errors
- Verify Firestore Database is enabled
- Check Firestore rules allow read access
- The app works with fallback data even without Firebase

### Orders Not Saving

- Check Firestore rules allow create on orders collection
- Verify Firebase configuration is correct
- Check browser console for Firebase errors

## Production Deployment

Before deploying to production:

1. Update Firestore security rules
2. Add your production domain to Firebase authorized domains
3. Use environment variables on your hosting platform
4. Never commit `.env.local` to version control

## Managing Products

To add/edit products in Firebase:

1. Go to Firestore Database
2. Select `products` collection
3. Add/edit documents with fields:
   - `name` (string)
   - `price` (number)
   - `category` (string): Vegetables, Fruits, Dairy and Bakery, Clothes, Snacks, Grocery
   - `image` (string): URL to product image

## Viewing Orders

Orders are stored in the `orders` collection with:
- `items` (array): Cart items with quantities
- `total` (number): Order total
- `address` (string): Delivery address
- `coordinates` (object): Lat/lng if location was used
- `status` (string): pending, confirmed, delivered
- `createdAt` (timestamp): Order timestamp

You can view all orders in Firebase Console → Firestore Database → orders
