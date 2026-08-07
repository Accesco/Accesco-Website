'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import './profile.css';

const ProfileContentNoSSR = dynamic(() => import('./ProfileContent'), {
  ssr: false,
  loading: () => <div className="profile-loading">Loading your profile…</div>,
});

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="profile-loading">Loading your profile…</div>}>
      <ProfileContentNoSSR />
    </Suspense>
  );
}