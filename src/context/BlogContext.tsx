import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from "react";
import { defaultBlogPosts } from "@/data/blog-posts";
import { BlogPost, BlogPostInput } from "@/types/blog";

interface BlogContextValue {
  posts: BlogPost[];
  publishedPosts: BlogPost[];
  categories: string[];
  createPost: (input: BlogPostInput) => BlogPost;
  updatePost: (slug: string, updates: BlogPostInput) => BlogPost | undefined;
  deletePost: (slug: string) => void;
  togglePublished: (slug: string) => void;
  getPostBySlug: (slug: string) => BlogPost | undefined;
}

const BLOG_STORAGE_KEY = "ks_blog_posts_v1";

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const ensureUniqueSlug = (slug: string, taken: string[]): string => {
  if (!taken.includes(slug)) {
    return slug;
  }
  let attempt = 2;
  let next = `${slug}-${attempt}`;
  while (taken.includes(next)) {
    attempt += 1;
    next = `${slug}-${attempt}`;
  }
  return next;
};

const readStoredPosts = (): BlogPost[] => {
  if (typeof window === "undefined") {
    return defaultBlogPosts;
  }
  try {
    const raw = window.localStorage.getItem(BLOG_STORAGE_KEY);
    if (!raw) {
      return defaultBlogPosts;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return defaultBlogPosts;
    }
    return parsed as BlogPost[];
  } catch (error) {
    console.error("Failed to parse stored blog posts", error);
    return defaultBlogPosts;
  }
};

const BlogContext = createContext<BlogContextValue | undefined>(undefined);

const normaliseTags = (tags: string[]): string[] =>
  tags
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => tag.toLowerCase());

const generateId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `blog-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    const stored = readStoredPosts();
    if (stored.length === 0) {
      return defaultBlogPosts;
    }
    return stored;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
    } catch (error) {
      console.error("Failed to persist blog posts", error);
    }
  }, [posts]);

  const createPost = useCallback((input: BlogPostInput): BlogPost => {
    const now = new Date().toISOString();
    const safeTags = normaliseTags(input.tags);
    const existingSlugs = posts.map((post) => post.slug);
    const baseSlug = slugify(input.slug || input.title);
    const slug = ensureUniqueSlug(baseSlug || generateId(), existingSlugs);
    const newPost: BlogPost = {
      id: generateId(),
      slug,
      title: input.title,
      excerpt: input.excerpt,
      author: input.author,
      category: input.category,
      tags: safeTags,
      coverImage: input.coverImage,
      content: input.content,
      published: input.published ?? false,
      readTime: input.readTime,
      metaTitle: input.metaTitle,
      metaDescription: input.metaDescription,
      createdAt: now,
      updatedAt: now,
    };

    setPosts((prev) => {
      const next = [...prev, newPost];
      return next;
    });

    return newPost;
  }, [posts]);

  const updatePost = useCallback((slug: string, updates: BlogPostInput): BlogPost | undefined => {
    let updatedPost: BlogPost | undefined;
    setPosts((prev) => {
      const existing = prev.find((post) => post.slug === slug);
      if (!existing) {
        return prev;
      }
      const now = new Date().toISOString();
      const safeTags = normaliseTags(updates.tags);
      const otherSlugs = prev.filter((post) => post.slug !== slug).map((post) => post.slug);
      const baseSlug = slugify(updates.slug || updates.title);
      const nextSlug = ensureUniqueSlug(baseSlug || existing.slug, otherSlugs);

      updatedPost = {
        ...existing,
        ...updates,
        tags: safeTags,
        slug: nextSlug,
        published: updates.published ?? existing.published,
        updatedAt: now,
      };

      return prev.map((post) => (post.slug === slug ? updatedPost as BlogPost : post));
    });
    return updatedPost;
  }, []);

  const deletePost = useCallback((slug: string) => {
    setPosts((prev) => prev.filter((post) => post.slug !== slug));
  }, []);

  const togglePublished = useCallback((slug: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.slug === slug
          ? { ...post, published: !post.published, updatedAt: new Date().toISOString() }
          : post,
      ),
    );
  }, []);

  const getPostBySlug = useCallback((slug: string): BlogPost | undefined => {
    return posts.find((post) => post.slug === slug);
  }, [posts]);

  const sortedPosts = useMemo(
    () =>
      [...posts].sort((a, b) => {
        const aDate = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const bDate = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return bDate - aDate;
      }),
    [posts],
  );

  const publishedPosts = useMemo(() => sortedPosts.filter((post) => post.published), [sortedPosts]);

  const categories = useMemo(() => {
    return Array.from(new Set(posts.map((post) => post.category))).sort();
  }, [posts]);

  const value = useMemo<BlogContextValue>(
    () => ({
      posts: sortedPosts,
      publishedPosts,
      categories,
      createPost,
      updatePost,
      deletePost,
      togglePublished,
      getPostBySlug,
    }),
    [sortedPosts, publishedPosts, categories, createPost, updatePost, deletePost, togglePublished, getPostBySlug],
  );

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};

export const useBlogContext = (): BlogContextValue => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlogContext must be used within a BlogProvider");
  }
  return context;
};
