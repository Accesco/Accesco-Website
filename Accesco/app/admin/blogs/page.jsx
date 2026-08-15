import AdminBlogsClient from './AdminBlogsClient';

export const metadata = {
  title: 'Blog Admin | Accesco Living',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function AdminBlogsPage() {
  return <AdminBlogsClient />;
}
