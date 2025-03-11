export interface User {
  id: string
  username: string
  avatar_url: string
}

export interface Category {
  id: string
  name: string
}

export interface Post {
  id: string
  title: string
  content: string
  excerpt?: string
  problem_number?: number
  author: User
  categories: Category[]
  created_at: string
  updated_at: string
  likes_count: number
  views_count: number
  comments_count: number
}

