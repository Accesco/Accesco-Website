import { fetchBlogs } from '../../lib/blogService';
import BlogsClient from './BlogsClient';

export const revalidate = 60;

const HIDDEN_TITLES = ['AccesGo: Moving People, Respecting Lives\n'];

export default async function BlogsPage() {
  const data = await fetchBlogs();
  const posts = data.filter((blog) => !HIDDEN_TITLES.includes(blog.title));

  return <BlogsClient initialPosts={posts} />;
}
