'use client'

import { useEffect } from 'react'

export function WebVitalsReporter() {
  useEffect(() => {
    if (import.meta.env.DEV) return

    void import('../../lib/report-web-vitals').then(({ reportWebVitals }) => {
      reportWebVitals()
    })
  }, [])

  return null
}
