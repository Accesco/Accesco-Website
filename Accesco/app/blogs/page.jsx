import { fetchBlogs } from '../../lib/blogService';
import BlogsClient from './BlogsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const HIDDEN_TITLES = ['AccesGo: Moving People, Respecting Lives\n'];

export default async function BlogsPage() {
  let data = [];
  try {
    data = await fetchBlogs();
  } catch (e) {
    data = [];
  }
  const posts = (Array.isArray(data) ? data : []).filter((blog) => !HIDDEN_TITLES.includes(blog.title));

  return <BlogsClient initialPosts={posts} />;
}

