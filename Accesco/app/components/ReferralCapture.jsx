'use client'

import { useEffect } from 'react'
import { captureReferralCodeFromUrl } from '../../lib/referralService'

// Renders nothing — just captures a `?ref=CODE` from the URL (if present)
// into localStorage on first load, so it's available whenever the visitor
// eventually completes phone verification, even on a different page/visit.
export default function ReferralCapture() {
  useEffect(() => {
    captureReferralCodeFromUrl()
  }, [])

  return null
}
