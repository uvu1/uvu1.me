import { siteConfig } from "../config/site";

type SeoOptions = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  image?: string;
};

export function createSeo({
  title,
  description,
  path,
  type = "website",
  image,
}: SeoOptions) {
  const url = new URL(path, siteConfig.url).toString();
  const ogImage = image ?? `${siteConfig.url}/ogp.png`;

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:site_name", content: siteConfig.name },
      { property: "og:type", content: type },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: ogImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
