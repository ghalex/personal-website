export type Project = {
  name: string;
  url: string;
  role: string;
  meta: string;
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

export type BlogPost = {
  slug: string;
  title: string;
  description?: string;
  /** ISO date (yyyy-mm-dd); absent while the post is a draft */
  date?: string;
  readingTime?: number;
  tags?: string[];
  /** Markdown body; absent while the post is a draft */
  content?: string;
};

export type PublishedPost = BlogPost &
  Required<Pick<BlogPost, "description" | "date" | "readingTime" | "tags" | "content">>;
