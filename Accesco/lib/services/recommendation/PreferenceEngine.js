import { db } from '../../firebase.js'; // FIX: Direct import path pointing to `/lib/firebase.js`
import { doc, getDoc, collection, writeBatch } from 'firebase/firestore';
import { SWIPE_CONFIG } from './config.js';

export class PreferenceEngine {
  static async processInteractionBatch(userId, interactions) {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) return;

    const userData = userDoc.data() || {};
    const profile = userData.styleProfile || {
      categoryAffinity: {},
      brandAffinity: {},
      tagAffinity: {},
      materialAffinity: {},
      colorAffinity: {},
    };

    const productIds = [...new Set(interactions.map((swipe) => swipe.productId))];
    const productDocs = await Promise.all(
      productIds.map((id) => getDoc(doc(db, 'products', id)))
    );

    const productCacheMap = {};
    productDocs.forEach((docSnapshot) => {
      if (docSnapshot.exists()) {
        productCacheMap[docSnapshot.id] = docSnapshot.data();
      }
    });

    const batch = writeBatch(db);

    for (const swipe of interactions) {
      const interactionRef = doc(collection(db, 'users', userId, 'interactions'));
      batch.set(interactionRef, {
        productId: swipe.productId,
        action: swipe.action,
        timestamp: swipe.timestamp,
      });

      const productData = productCacheMap[swipe.productId];
      if (productData) {
        const tags = productData.styleTags || productData.tags || [];
        const category = productData.category;
        const brand = productData.brand;
        const color = productData.color;
        const material = productData.material;

        const actionMultiplier = SWIPE_CONFIG.MULTIPLIERS[swipe.action.toUpperCase()] || 0;

        tags.forEach((tag) => {
          profile.tagAffinity[tag] = this.calculateNewWeight(profile.tagAffinity[tag] || 0, actionMultiplier);
        });

        if (category) {
          profile.categoryAffinity[category] = this.calculateNewWeight(profile.categoryAffinity[category] || 0, actionMultiplier);
        }

        if (brand) {
          profile.brandAffinity[brand] = this.calculateNewWeight(profile.brandAffinity[brand] || 0, actionMultiplier);
        }

        if (color) {
          profile.colorAffinity[color] = this.calculateNewWeight(profile.colorAffinity[color] || 0, actionMultiplier);
        }

        if (material) {
          profile.materialAffinity[material] = this.calculateNewWeight(profile.materialAffinity[material] || 0, actionMultiplier);
        }
      }
    }

    this.applyPassiveDecay(profile);

    batch.update(userRef, { styleProfile: profile });
    await batch.commit();
  }

  static calculateNewWeight(oldWeight, actionMultiplier) {
    const eta = SWIPE_CONFIG.LEARNING_RATE;
    const sign = Math.sign(actionMultiplier);
    const delta = eta * actionMultiplier * (1 - sign * oldWeight);
    const newWeight = oldWeight + delta;
    return Math.max(-1, Math.min(1, newWeight));
  }

  static applyPassiveDecay(profile) {
    const lambda = SWIPE_CONFIG.DECAY_RATE;
    const decay = (affinities) => {
      Object.keys(affinities).forEach((key) => {
        affinities[key] = affinities[key] * (1 - lambda);
      });
    };

    decay(profile.tagAffinity); 
    decay(profile.categoryAffinity);
    decay(profile.brandAffinity);
    decay(profile.colorAffinity);
    decay(profile.materialAffinity);
  }
}