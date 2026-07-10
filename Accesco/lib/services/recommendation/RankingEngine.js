import { SWIPE_CONFIG } from './config.js';

export class RankingEngine {
  static rankProducts(products, profile) {
    const scoredProducts = products.map((product) => {
      const score = this.calculateProductScore(product, profile);
      return { product, score };
    });

    // Sort descending by calculated score
    scoredProducts.sort((a, b) => b.score - a.score);

    const sortedProducts = scoredProducts.map((sp) => sp.product);
    return this.applyDiversification(sortedProducts);
  }

  static calculateProductScore(product, profile) {
    const w = SWIPE_CONFIG.WEIGHTS;

    let tagScore = 0;
    const tags = product.styleTags;
    if (tags && tags.length > 0) {
      let totalTagWeight = 0;
      tags.forEach((tag) => {
        totalTagWeight += profile.tagAffinity[tag] || 0;
      });
      tagScore = totalTagWeight / tags.length;
    }

    const categoryScore = profile.categoryAffinity[product.category] || 0;
    const brandScore = profile.brandAffinity[product.brand] || 0;
    const colorScore = product.color ? (profile.colorAffinity[product.color] || 0) : 0;
    const materialScore = product.material ? (profile.materialAffinity[product.material] || 0) : 0;

    let priceScore = 1.0;
    if (profile.preferredPriceMin !== undefined && profile.preferredPriceMax !== undefined) {
      const price = product.price;
      if (price < profile.preferredPriceMin) {
        const diff = profile.preferredPriceMin - price;
        priceScore = Math.max(0, 1 - diff / profile.preferredPriceMin);
      } else if (price > profile.preferredPriceMax) {
        const diff = price - profile.preferredPriceMax;
        priceScore = Math.max(0, 1 - diff / profile.preferredPriceMax);
      }
    }

    let freshnessScore = 0;
    if (product.createdAt) {
      const createdTime = typeof product.createdAt.toMillis === 'function'
        ? product.createdAt.toMillis()
        : new Date(product.createdAt).getTime();

      if (!isNaN(createdTime)) {
        const diffDays = Math.max(0, (Date.now() - createdTime) / (1000 * 60 * 60 * 24));
        freshnessScore = Math.exp(-SWIPE_CONFIG.FRESHNESS_DECAY * diffDays);
      }
    } else {
      freshnessScore = 0;
    }

    const finalScore =
      w.TAG * tagScore +
      w.CATEGORY * categoryScore +
      w.BRAND * brandScore +
      w.COLOR * colorScore +
      w.MATERIAL * materialScore +
      w.PRICE * priceScore +
      w.FRESHNESS * freshnessScore;

    return finalScore;
  }

  static applyDiversification(products) {
    const result = [];
    const categoryCounts = {};

    for (const product of products) {
      const count = categoryCounts[product.category] || 0;
      if (count >= 2) {
        continue;
      }
      result.push(product);
      categoryCounts[product.category] = count + 1;
      if (result.length >= SWIPE_CONFIG.DECK_SIZE) {
        break;
      }
    }

    if (result.length < SWIPE_CONFIG.DECK_SIZE) {
      for (const product of products) {
        if (!result.some((p) => p.id === product.id)) {
          result.push(product);
        }
        if (result.length >= SWIPE_CONFIG.DECK_SIZE) {
          break;
        }
      }
    }

    return result;
  }
}