import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { siteConfig }from '../config/site'
import { NotFoundPage }from "../components/error/NotFoundPage"
import { ThemeScript } from '../components/theme/ThemeScript'

import appCss from '../styles/app.css?url'

export const Route = createRootRoute({
   head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },

      { title: siteConfig.title },
      {
        name: "description",
        content: siteConfig.description,
      },

      { property: "og:site_name", content: siteConfig.name },
      { property: "og:title", content: siteConfig.title },
      {
        property: "og:description",
        content: siteConfig.description,
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: siteConfig.url },
      {
        property: "og:image",
        content: `${siteConfig.url}/ogp.png`,
      },

      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: siteConfig.title },
      {
        name: "twitter:description",
        content: siteConfig.description,
      },
      {
        name: "twitter:image",
        content: `${siteConfig.url}/ogp.png`,
      },
    ],
    links: [
      {
        rel: "canonical",
        href: siteConfig.url,
      },
      {
        rel: "alternate",
        type: "application/rss+xml",
        title: `${siteConfig.name} RSS Feed`,
        href: "/rss.xml",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "stylesheet",
        href: "https://use.typekit.net/aie2fls.css",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicons/favicon-32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        href: "/favicons/favicon-192.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/favicons/apple-touch-icon.png",
      },
      {
        rel: "alternate",
        type: "application/rss+xml",
        title: `${siteConfig.name} RSS Feed`,
        href: "/rss.xml",
      }
    ],
  }), 
  notFoundComponent: NotFoundPage,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <ThemeScript />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
