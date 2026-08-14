import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import './blog-post.css';
import { fetchBlogs } from '../../../lib/blogService';
import { HeaderActions, ShareRow } from './PostActions';
import WaitlistCard from '../blogwaitlistcard';
import BlogsNavbar from '../blog-navabar.jsx';

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
      <div className="related-posts-header ">
        <h2 className="related-posts-title">Related Articles</h2>
        <span className="related-posts-more">View More</span>
      </div>
      <div className="related-posts-list">
        {posts.map((post) => (
          <Link key={post.id} href={`/blogs/${post.id}`} className="related-post-card">
            <div className="related-post-image">
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
              <h3 className="related-post-title">{post.title}</h3>
            </div>
          </Link>
        ))}
      </div>
      <div>
        <span className="related-articles-more">View Articles More</span>
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
      <BlogsNavbar />
      <ArticleSchema post={post} id={params.id} />
      <div className="blog-post-container">

        { /*  left content */}
        <main className="blog-post-main">
          <header className="post-header">

            <h1 className="post-title">{post.title}</h1>

          </header>

          <div
            className="post-featured-image"
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

            { /*  author info */}

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
                <div className="author-details">
                  <p className="author-name">{post.author || 'ACCESCO Editorial Team'}</p>
                  <p className="author-meta">
                    Founder & CEO, Accesco Living
                  </p>
                </div>
              </div>
            </div>

            { /*  action buttons */}
            <div className="desktop-image-actions">
              <HeaderActions post={post} />
            </div>

            { /*  category */}

            <div className="post-category-wrapper">
              <span className="post-category">{post.category}</span>
            </div>

            { /*  date */}

            <div className="post-meta-row desktop-image-date">
              <span className="post-date">
                {new Date(post.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>


          { /*  mobile */}
          <div className="mobile-post-info">
            { /*  date */}

            <div className="mobile-post-date">
              <span className="post-date">
                {new Date(post.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            { /*  action buttons mobile */}
            <div className="mobile-post-actions">
              <HeaderActions post={post} />
            </div>

          </div>

          <div className="post-content">
            {(post.content || '').split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="post-share-row">
            <WaitlistCard />
          </div>
        </main>


        { /*  right content */}

        <aside className="blog-post-sidebar">

          {/*  about author */}
          <section className="about-author">
            

            <div className="about-author-card">
              <h3 className="about-author-title">About the Author</h3>
              <p className="about-author-description">
                Accesco Living is focused on building innovative solutions that make
                everyday living simpler, smarter, and more connected.
              </p>

              <a href="/blogs" className="view-all-posts">
                View All Posts
              </a>
            </div>
          </section>

          { /*  related posts */}
          <section className="related-posts-section">
            <RelatedPosts posts={relatedPosts} />
          </section>
        </aside>
      </div>
    </article>
  );
}
