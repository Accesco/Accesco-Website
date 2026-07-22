'use client';

/**
 * Swadishtt Layout Client
 * @description Client wrapper for Swadishtt provider
 */

import { SwadishttProvider } from './contexts/SwadishttContext';

export default function SwadishttLayoutClient({ children }) {
  return <SwadishttProvider>{children}</SwadishttProvider>;
}
