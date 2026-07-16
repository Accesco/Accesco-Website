import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Load and parse .env.local manually to avoid external dependencies
function loadEnv() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  let envPath = path.resolve(__dirname, '../.env.local');
  if (!fs.existsSync(envPath)) {
    envPath = path.resolve(__dirname, '../.env');
  }
  if (!fs.existsSync(envPath)) {
    console.error('Error: Neither .env.local nor .env file was found at project root.');
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const [key, ...valueParts] = trimmed.split('=');
    env[key.trim()] = valueParts.join('=').trim();
  });
  return env;
}

const env = loadEnv();

const firebaseConfig = {
  apiKey:            env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function showDatabase() {
  console.log('Fetching database collections...');
  
  try {
    const waitlistSnapshot = await getDocs(collection(db, 'waitlistUsers'));
    console.log(`\n📄 waitlistUsers Collection (${waitlistSnapshot.size} documents):`);
    console.log('===========================================================');
    if (waitlistSnapshot.size === 0) {
      console.log(' (No documents found in waitlistUsers)');
    } else {
      waitlistSnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`ID: ${doc.id}`);
        console.log(`  Name:  ${data.name || 'N/A'}`);
        console.log(`  Email: ${data.email}`);
        console.log(`  Phone: ${data.phone}`);
        console.log(`  Phone Verified: ${data.phoneVerified}`);
        console.log(`  Created At: ${data.createdAt?.toDate ? data.createdAt.toDate().toLocaleString() : 'N/A'}`);
        console.log('-----------------------------------------------------------');
      });
    }
  } catch (error) {
    console.error('Error fetching waitlistUsers:', error.message);
  }
}

showDatabase().catch(console.error);
