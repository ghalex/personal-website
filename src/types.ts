export type Project = {
  name: string;
  url: string;
  role: string;
  meta: string;
  period: string;
  active: boolean;
  bullets: string[];
  tags: string[];
  logoSrc?: string;
};

export type StackGroup = {
  num: string;
  name: string;
  items: string[];
};

export type PostInline =
  | string
  | { text: string; href: string }
  | { text: string; em: true }
  | { text: string; strong: true };

export type PostBlock =
  | { type: "p"; content: PostInline[] }
  | { type: "h2"; text: string }
  | { type: "steps"; items: PostInline[][] };

export type BlogPost = {
  slug: string;
  title: string;
  description?: string;
  /** ISO date (yyyy-mm-dd); absent while the post is a draft */
  date?: string;
  readingTime?: number;
  tags?: string[];
  body?: PostBlock[];
};

export type PublishedPost = BlogPost &
  Required<Pick<BlogPost, "description" | "date" | "readingTime" | "tags" | "body">>;
