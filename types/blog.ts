export interface User {
  id: string
  username: string
  email: string
}

export interface Blog {
  id: string
  blog_name: string
  description: string
  main_image_url: string
  user_id: string
  default_category_id: string
}

export interface Category {
  id: string
  name: string
}

export interface Post {
  id: string
  title: string
  content: string
  blog_id: string
  category_id: string
  author_id: string
  created_at: string
  updated_at: string
}

