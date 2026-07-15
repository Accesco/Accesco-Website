import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import './blog-post.css';
import { fetchBlogs } from '../../../lib/blogService';
import { HeaderActions, ShareRow } from './PostActions';

export const revalidate = 60;

const HIDDEN_TITLES = ['AccesGo: Moving People, Respecting Lives\n'];

async function getPost(id) {
  const data = await fetchBlogs();
  const post = data.find((p) => p.id === id);
  if (!post || HIDDEN_TITLES.includes(post.title)) return null;
  return post;
}

export async function generateMetadata({ params }) {
  const post = await getPost(params.id);

  if (!post) {
    return { title: 'Article Not Found | Accesco Living' };
  }

  const description = post.excerpt || (post.content || '').slice(0, 160);

  return {
    title: `${post.title} | Accesco Living Blog`,
    description,
    alternates: {
      canonical: `https://accescoliving.com/blogs/${params.id}`,
    },
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.date || undefined,
      images: post.image ? [{ url: post.image }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  return (
    <article className="blog-post-page">
      <div className="blog-post-container">
        <header className="post-header">
          <Link href="/blogs" className="back-button">
            <i className="ri-arrow-left-line"></i>
            <span>Back to Stories</span>
          </Link>

          <div className="post-meta-row">
            <span className="post-category">{post.category}</span>
            <span className="post-date">
              {new Date(post.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          <h1 className="post-title">{post.title}</h1>

          <div className="post-author-row">
            <div className="author-info">
              <div className="author-avatar">
                <i className="ri-user-fill"></i>
              </div>
              <div>
                <p className="author-name">{post.author || 'ACCESCO Editorial Team'}</p>
                <p className="author-meta">
                  5 min read •{' '}
                  {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>

            <HeaderActions post={post} />
          </div>
        </header>

        <div className="post-featured-image">
          <Image
            src={post.image || '/images/download (2).png'}
            alt={post.title}
            width={1200}
            height={675}
            unoptimized
            priority
          />
        </div>

        <div className="post-content">
          {(post.content || '').split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <footer className="post-footer">
          <div className="post-tags">
            <span className="tag-item">{post.category}</span>
            <span className="tag-item">Featured</span>
            <span className="tag-item">Editor's Pick</span>
          </div>

          <ShareRow post={post} />
        </footer>
      </div>
    </article>
  );
}
