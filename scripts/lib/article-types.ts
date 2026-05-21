export type TocItem = {
  id: string;
  text: string;
  depth: 1;
};

export type GeneratedArticle = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  pin: boolean;
  thumbnail: string;
  body: string;
  html: string;
  toc: TocItem[];
  readingTime: number;
};
