import { CandidateGenerator } from './CandidateGenerator.js';
import { RankingEngine } from './RankingEngine.js';
import { db } from '../../firebase.js'; // FIX: Direct import path pointing to `/lib/firebase.js`
import { doc, getDoc } from 'firebase/firestore';
import { SWIPE_CONFIG } from './config.js';

export class RecommendationService {
  static async generateSwipeDeck(userId, origin) {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.exists() ? userDoc.data() : null;
    
    const profile = (userData && userData.styleProfile) || {
      categoryAffinity: {},
      brandAffinity: {},
      tagAffinity: {},
      materialAffinity: {},
      colorAffinity: {},
    };

    const candidates = await CandidateGenerator.getCandidates(userId, SWIPE_CONFIG.DECK_SIZE, origin);
    const rankedDeck = RankingEngine.rankProducts(candidates, profile);

    return rankedDeck.slice(0, SWIPE_CONFIG.DECK_SIZE);
  }
}