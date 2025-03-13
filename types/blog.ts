export interface User {
  id: number
  username: string
  email: string
}

export interface Blog {
  id: number
  blog_name: string
  description: string
  main_image_url: string
  user_id: string
  default_category_id: string
}

export interface Category {
  id: number
  name: string
}

export interface Post {
  id: number;
  title: string;
  description: string;
  content: string;
  created_at: string;
  updated_at: string;
  views: number;
  article_likes: number;
  article_comments: number;
  protected: number;
  comments_enabled: number;
  secret: number;
  problem_numbers: number[];
  blog_id: number;
  blog_name: string;
  category_id: number;
}

export interface PaginatedArticleListResponse {
  page: number;
  per_page: number;
  total_count: number;
  articles: Post[];
}

export interface Comment {
  id: number
  user_name: string
  content: string
  created_at: string
  updated_at: string
  secret: number
  user_blog_id:number
}
