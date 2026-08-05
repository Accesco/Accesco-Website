'use client'

import { useEffect } from 'react'
import { captureReferralCodeFromUrl } from '../../lib/referralService'

// Renders nothing — just records a `?ref=CODE` from the URL (if present) into
// Firestore on first load, keyed by an anonymous Firebase Auth uid, so it's
// available whenever the visitor eventually completes phone verification, even
// on a different page or a later visit. Nothing is written to browser storage.
export default function ReferralCapture() {
  useEffect(() => {
    // Fire-and-forget: captureReferralCodeFromUrl swallows its own errors.
    captureReferralCodeFromUrl()
  }, [])

  return null
}
