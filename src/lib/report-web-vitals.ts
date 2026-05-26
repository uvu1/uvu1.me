import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals/attribution'
import type { Metric } from 'web-vitals'

function send(metric: Metric) {
  const body = JSON.stringify({
    metric,
    path: location.pathname,
    url: location.href,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    connectionType:
      'connection' in navigator
        ? (navigator.connection as { effectiveType?: string }).effectiveType
        : null,
  })

  const blob = new Blob([body], { type: 'application/json' })
  const sent = navigator.sendBeacon('/api/vitals', blob)
  if (sent) return

  void fetch('/api/vitals', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body,
    keepalive: true,
  })
}

export function reportWebVitals() {
  onCLS(send)
  onINP(send)
  onLCP(send)
  onFCP(send)
  onTTFB(send)
}
