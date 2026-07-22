import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

const COLLECTION = "feedback";

export async function addFeedback(data) {
  const feedback = {
    user: data.user?.trim() || "Anonymous",
    score: Number(data.score),
    review: data.review?.trim() || "",
    usageLikelihood: data.usageLikelihood,
    earlyAccess: data.earlyAccess,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(
    collection(db, COLLECTION),
    feedback
  );

  return docRef.id;
}