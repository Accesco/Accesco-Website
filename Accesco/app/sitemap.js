import { fetchBlogs } from '../lib/blogService';

const SITE_URL = 'https://accescoliving.com';

const STATIC_ROUTES = [
  { path: '/', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/services/grokly', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/services/swadisht', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/services/instastyle', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/services/dinex', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/services/swadisht-cafe', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/services/localmeds', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/blogs', changeFrequency: 'daily', priority: 0.8 },
  { path: '/xpense-meter', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/partner', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/press', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/faq', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/investor-relations', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/referral', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/accesco-library', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/qtcvideos', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/refund', changeFrequency: 'yearly', priority: 0.4 },
];

const HIDDEN_TITLES = ['AccesGo: Moving People, Respecting Lives\n'];

export default async function sitemap() {
  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  let blogEntries = [];
  try {
    const posts = await fetchBlogs();
    blogEntries = posts
      .filter((post) => !HIDDEN_TITLES.includes(post.title))
      .map((post) => ({
        url: `${SITE_URL}/blogs/${post.id}`,
        lastModified: post.date ? new Date(post.date) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      }));
  } catch (err) {
    console.error('Sitemap: failed to load blog posts:', err);
  }

  return [...staticEntries, ...blogEntries];
}
