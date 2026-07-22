import { db } from "./firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export async function submitFeedback(data) {
  try {
    const docRef = await addDoc(collection(db, "feedback"), {
      user: data.user || "Anonymous",
      score: Number(data.score),
      review: data.review || "",
      createdAt: serverTimestamp(),
    });

    return {
      success: true,
      id: docRef.id,
    };
  } catch (error) {
    console.error("Error saving feedback:", error);

    return {
      success: false,
      message: error.message,
    };
  }
}