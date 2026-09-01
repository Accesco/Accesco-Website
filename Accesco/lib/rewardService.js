import { doc, getDoc, increment, setDoc } from 'firebase/firestore';
import {db} from './firebase';

const COLLECTION = 'rewards';

export function calculatedReward(orderTotal){
    return Math.floor(Number(orderTotal)/100);
}

export async function getRewardBalance(userId){
    if(!userId) return 0;

    const rewardRef = doc(db, COLLECTION, userId);
    const snapshot = await getDoc(rewardRef);

    if(!snapshot.exists()) return 0;
    return snapshot.data().balance || 0;


}

export async function addRewards(userId, amount){
    if(!userId || !amount || amount <= 0) return 0;


    const rewardRef = doc(db, COLLECTION, userId);

    await setDoc(
        rewardRef,
        {
            balance: increment(amount),
            updatedAt: new Date().toISOString(),
        },
        {merge : true}
    );

    const snapshot = await getDoc(rewardRef);

    return snapshot.data()?.balance || 0;
}

