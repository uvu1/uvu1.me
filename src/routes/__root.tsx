import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { siteConfig  }from '../config/site'

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
        rel: "icon",
        href: "/favicon.ico",
      },
      {
        rel: "stylesheet",
        href: appCss,
      }
    ],
  }), 
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="uvu1.me RSS Feed"
          href="/rss.xml"
        />
        <link rel="stylesheet" href="https://use.typekit.net/aie2fls.css" />
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
