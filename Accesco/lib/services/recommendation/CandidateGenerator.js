import { db } from '../../firebase.js'; // FIX: Direct import path pointing to `/lib/firebase.js`
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { SWIPE_CONFIG } from './config.js';

export class CandidateGenerator {
  static async getCandidates(userId, limitCount, origin) {
    const swipedIds = await this.getSwipedProductIds(userId);

    const response = await fetch(`${origin}/api/instastyle/products`, {
      method: 'GET',
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error(`Failed to retrieve product catalog from API: ${response.status}`);
    }

    const data = await response.json();
    const products = data.products || [];

    const candidates = [];
    for (const product of products) {
      if (!swipedIds.has(product.id) && Number(product.stockCount) > 0 && product.isActive) {
        candidates.push({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          imageUrl: product.imageUrl,
          styleTags: product.styleTags || product.tags || [],
          category: product.category,
          brand: product.brand,
          material: product.material,
          color: product.color,
          stockCount: Number(product.stockCount),
          isActive: Boolean(product.isActive),
          createdAt: product.createdAt
        });
      }
      if (candidates.length >= limitCount * 3) {
        break;
      }
    }

    return candidates;
  }

  static async getSwipedProductIds(userId) {
    const swipedSet = new Set();
    const cutoffTime = Date.now() - SWIPE_CONFIG.MAX_INTERACTION_AGE_DAYS * 24 * 60 * 60 * 1000;

    const interactionsRef = collection(db, 'users', userId, 'interactions');
    const q = query(
      interactionsRef,
      where('timestamp', '>=', cutoffTime),
      orderBy('timestamp', 'desc'),
      limit(1000)
    );

    const snapshot = await getDocs(q);
    snapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      if (data.productId) {
        swipedSet.add(data.productId);
      }
    });

    return swipedSet;
  }
}