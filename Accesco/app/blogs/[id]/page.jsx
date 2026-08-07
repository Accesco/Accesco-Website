import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import './blog-post.css';
import { fetchBlogs } from '../../../lib/blogService';
import { HeaderActions, ShareRow } from './PostActions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SITE_URL = 'https://accescoliving.com';
const HIDDEN_TITLES = ['AccesGo: Moving People, Respecting Lives\n'];

function isVisible(post) {
  return post && !HIDDEN_TITLES.includes(post.title);
}

async function getPostData(id) {
  try {
    const data = await fetchBlogs();
    const visible = (Array.isArray(data) ? data : []).filter(isVisible);
    const post = visible.find((p) => p.id === id) || null;
    return { post, visible };
  } catch (e) {
    return { post: null, visible: [] };
  }
}

function getRelatedPosts(post, allPosts, limit = 3) {
  const others = allPosts.filter((p) => p.id !== post.id);
  const sameCategory = others.filter(
    (p) => p.category?.toLowerCase() === post.category?.toLowerCase()
  );
  const rest = others.filter((p) => !sameCategory.includes(p));
  return [...sameCategory, ...rest].slice(0, limit);
}

export async function generateMetadata({ params }) {
  const { post } = await getPostData(params.id);

  if (!post) {
    return { title: 'Article Not Found | Accesco Living' };
  }

  const description = post.excerpt || (post.content || '').slice(0, 160);

  return {
    title: `${post.title} | Accesco Living Blog`,
    description,
    alternates: {
      canonical: `${SITE_URL}/blogs/${params.id}`,
    },
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      url: `${SITE_URL}/blogs/${params.id}`,
      publishedTime: post.date || undefined,
      images: post.image ? [{ url: post.image }] : undefined,
    },
  };
}

function ArticleSchema({ post, id }) {
  const postUrl = `${SITE_URL}/blogs/${id}`;
  const description = post.excerpt || (post.content || '').slice(0, 160);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    headline: post.title,
    description,
    image: post.image ? [post.image] : undefined,
    author: {
      '@type': 'Organization',
      name: post.author || 'ACCESCO Editorial Team',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Accesco Living',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/ac-logo.png`,
      },
    },
    datePublished: post.date || undefined,
    dateModified: post.date || undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function RelatedPosts({ posts }) {
  if (!posts.length) return null;

  return (
    <section className="related-posts">
      <h2 className="related-posts-title">Related Stories</h2>
      <div className="related-posts-grid">
        {posts.map((post) => (
          <Link key={post.id} href={`/blogs/${post.id}`} className="related-post-card">
            <div className="related-post-visual">
              <Image
                src={post.image || '/images/download (2).png'}
                alt={post.title}
                fill
                style={{ objectFit: 'cover' }}
                unoptimized
              />
            </div>
            <div className="related-post-body">
              <span className="related-post-category">{post.category}</span>
              <h3>{post.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function BlogPostPage({ params }) {
  const { post, visible } = await getPostData(params.id);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post, visible);

  return (
    <article className="blog-post-page">
      <ArticleSchema post={post} id={params.id} />
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
  {post.title?.includes('Accesco Living Launches Public Beta') ? (
    <Image
      src="/images/blogs/founder.png"
      alt={post.author || 'Author'}
      width={40}
      height={40}
      className="author-avatar-image"
    />
  ) : (
    <i className="ri-user-fill"></i>
  )}
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

<div
  className="post-featured-image"
  style={{
    width: '100%',
    maxWidth: '1200px',
    height: '500px', // change this to whatever height you want
    margin: '0 auto',
    overflow: 'hidden',
    borderRadius: '16px',
    position: 'relative',
  }}
>
  <Image
    src={
      post.title?.includes('What a City Actually Demands of You')
        ? '/images/blogs/what-a-city-actually-demands.jpg'
      : post.title?.includes('Dark Stores')
        ? '/images/blogs/dark-stores.jpg'
      : post.title?.includes('Sunday Meal Prep')
        ? '/images/blogs/meal-prep.jpg'
      : post.title?.includes('All-in-One Smart Lifestyle Ecosystem')
        ? '/images/blogs/accesco-ecosystem.jpg'
      : post.title?.includes('Best Grocery Delivery Service')
        ? '/images/blogs/grocery-delivery.jpg'
      : post.title?.includes('Accesco Living Launches Public Beta')
        ? '/images/blogs/launch-date.png'
      : post.image || '/images/download (2).png'
    }
    alt={post.title}
    fill
    style={{ objectFit: 'cover' }}
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

        <RelatedPosts posts={relatedPosts} />
      </div>
    </article>
  );
}
