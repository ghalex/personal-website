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

export type BlogPost = {
  title: string;
  date: string;
  href: string;
};
