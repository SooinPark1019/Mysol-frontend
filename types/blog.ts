export interface User {
  id: string
  username: string
  email: string
}

export interface Blog {
  id: string
  name: string
  description: string
  owner_id: string
}

export interface Category {
  id: string
  name: string
  blog_id: string
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

