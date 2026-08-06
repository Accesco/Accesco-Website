// lib/blogService.js
import { db } from './firebase';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

const COLLECTION = 'blogs';

// Fetch all blogs from Firestore
export async function fetchBlogs() {
  try {
    const q = query(collection(db, COLLECTION));
    const snapshot = await getDocs(q);
    console.log('Total docs found:', snapshot.docs.length);

    return snapshot.docs.map(d => {
      const data = d.data();
      return {
        id:       d.id,
        title:    data.title    || data.Title    || 'Untitled',
        content:  data.Content  || data.content  || '',
        category: data.Category || data.category || 'General',
        author:   data.Author   || data.author   || 'ACCESCO Editorial Team',
        image:    data.img_url  || data.Image    || data.image  || '/images/download (2).png',
        excerpt:  data.Excerpt  || data.excerpt  || '',
        date:     data.Date?.toDate?.().toISOString().split('T')[0]
                  ?? data.date?.toDate?.().toISOString().split('T')[0]
                  ?? '',
      };
    });
  } catch (err) {
    console.error('Failed to load blogs:', err);
    return [];
  }
}

// Save a new blog post to Firestore
export async function addBlog(postData) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      title:    postData.title,
      Content:  postData.content,
      Category: postData.category,
      Author:   postData.author,
      img_url:  postData.image,
      Excerpt:  postData.excerpt,
      Date:     serverTimestamp(),
      Published: true,
    });
    return docRef.id;
  } catch (err) {
    console.error('Failed to add blog:', err);
    throw err;
  }
}

// Update an existing blog post in Firestore
export async function updateBlog(id, postData) {
  try {
    await updateDoc(doc(db, COLLECTION, id), {
      title:    postData.title,
      Content:  postData.content,
      Category: postData.category,
      Author:   postData.author,
      img_url:  postData.image,
      Excerpt:  postData.excerpt,
    });
  } catch (err) {
    console.error('Failed to update blog:', err);
    throw err;
  }
}

// Delete a blog post from Firestore
export async function deleteBlog(id) {
  try {
    await deleteDoc(doc(db, COLLECTION, id));
  } catch (err) {
    console.error('Failed to delete blog:', err);
    throw err;
  }
}