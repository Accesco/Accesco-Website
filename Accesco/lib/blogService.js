// lib/blogService.js
import { db } from './firebase';
import { collection, getDocs, query } from 'firebase/firestore';

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
        localArea:   data.localArea   || '',
        backlinkUrl: data.backlinkUrl || '',
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

// Writes (add/update/delete) go through /api/blog-admin/blogs, gated behind the
// marketing admin password — see app/admin/blogs. There is no client-side write
// path into this collection.