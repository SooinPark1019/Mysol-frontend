import type { Blog, Category, Post, User } from "@/types/blog"

const API_URL = "https://api.editorialhub.site/api/"

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || `API request failed: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function signUp(data: { email: string; username: string; password: string }): Promise<User> {
  return apiRequest<User>("users/signup", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function login(data: { email: string; password: string }): Promise<{ message: string; username: string }> {
  return apiRequest<{ message: string; username: string }>("users/signin", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// logout 함수를 수정합니다
export async function logout(): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("users/logout", {
    method: "POST",
  })
}

// refreshToken 함수를 수정합니다
export async function refreshToken(): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("users/refresh", {
    method: "POST",
  })
}

// getCurrentUser 함수를 수정합니다
export async function getCurrentUser(): Promise<User> {
  return apiRequest<User>("users/me")
}

export async function createBlog(data: { name: string; description: string }): Promise<Blog> {
  return apiRequest<Blog>("/blogs/", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function fetchBlogs(): Promise<Blog[]> {
  return apiRequest<Blog[]>("/blogs/")
}

export async function fetchBlog(blogId: string): Promise<Blog> {
  return apiRequest<Blog>(`/blogs/${blogId}`)
}

export async function updateBlog(blogId: string, data: { name?: string; description?: string }): Promise<Blog> {
  return apiRequest<Blog>(`/blogs/${blogId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deleteBlog(blogId: string): Promise<void> {
  return apiRequest(`/blogs/${blogId}`, {
    method: "DELETE",
  })
}

export async function createCategory(blogId: string, data: { name: string }): Promise<Category> {
  return apiRequest<Category>(`/blogs/${blogId}/categories/`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function fetchCategories(blogId: string): Promise<Category[]> {
  return apiRequest<Category[]>(`/blogs/${blogId}/categories/`)
}

export async function updateCategory(blogId: string, categoryId: string, data: { name: string }): Promise<Category> {
  return apiRequest<Category>(`/blogs/${blogId}/categories/${categoryId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deleteCategory(blogId: string, categoryId: string): Promise<void> {
  return apiRequest(`/blogs/${blogId}/categories/${categoryId}`, {
    method: "DELETE",
  })
}

export async function createPost(
  blogId: string,
  data: {
    title: string
    content: string
    category_id: string
  },
): Promise<Post> {
  return apiRequest<Post>(`/blogs/${blogId}/posts/`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function fetchPosts(
  blogId: string,
  params: {
    skip?: number
    limit?: number
    search?: string
    category_id?: string
    sort_by?: string
    order?: "asc" | "desc"
  } = {},
): Promise<Post[]> {
  const queryParams = new URLSearchParams()

  if (params.skip !== undefined) queryParams.set("skip", params.skip.toString())
  if (params.limit !== undefined) queryParams.set("limit", params.limit.toString())
  if (params.search) queryParams.set("search", params.search)
  if (params.category_id) queryParams.set("category_id", params.category_id)
  if (params.sort_by) queryParams.set("sort_by", params.sort_by)
  if (params.order) queryParams.set("order", params.order)

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ""

  try {
    return await apiRequest<Post[]>(`/blogs/${blogId}/posts/${queryString}`)
  } catch (error) {
    console.error("Failed to fetch posts:", error)
    // Return mock data as fallback
    return [
      {
        id: "1",
        title: "Sample Post 1",
        content: "This is a sample post content.",
        blog_id: blogId,
        category_id: "1",
        author_id: "1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Sample Post 2",
        content: "This is another sample post content.",
        blog_id: blogId,
        category_id: "2",
        author_id: "1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]
  }
}

export async function fetchPost(blogId: string, postId: string): Promise<Post> {
  return apiRequest<Post>(`/blogs/${blogId}/posts/${postId}`)
}

export async function updatePost(
  blogId: string,
  postId: string,
  data: {
    title?: string
    content?: string
    category_id?: string
  },
): Promise<Post> {
  return apiRequest<Post>(`/blogs/${blogId}/posts/${postId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deletePost(blogId: string, postId: string): Promise<void> {
  return apiRequest(`/blogs/${blogId}/posts/${postId}`, {
    method: "DELETE",
  })
}

export async function likePost(blogId: string, postId: string): Promise<void> {
  return apiRequest(`/blogs/${blogId}/posts/${postId}/like`, {
    method: "POST",
  })
}

export async function unlikePost(blogId: string, postId: string): Promise<void> {
  return apiRequest(`/blogs/${blogId}/posts/${postId}/unlike`, {
    method: "POST",
  })
}

