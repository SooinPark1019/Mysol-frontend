import type { Blog, Category, Post, User } from "@/types/blog";

const API_URL = "https://api.editorialhub.site/api/";

/**
 * 공통 API 요청 함수
 */
let isRefreshing = false; // 🔹 현재 refreshToken 요청 중인지 추적

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  authToken?: string,
  retry = true // 🔹 재시도를 허용할지 여부
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers || {}) as Record<string, string>),
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    console.warn("Access token expired. Attempting to refresh...");

    const refreshTokenStr = localStorage.getItem("refresh_token");

    if (refreshTokenStr && retry && !isRefreshing) {
      isRefreshing = true; // 🔹 Refresh 요청 중 상태로 변경
      try {
        const { access_token, refresh_token } = await refreshToken(refreshTokenStr);
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        isRefreshing = false; // 🔹 Refresh 완료 후 상태 해제

        // 🔹 새로운 토큰으로 원래 요청을 재시도 (하지만 이번엔 retry=false)
        return apiRequest<T>(endpoint, options, access_token, false);
      } catch (error) {
        console.error("Failed to refresh token:", error);
        isRefreshing = false; // 🔹 실패 시 상태 해제
        throw new Error("Session expired. Please log in again.");
      }
    } else {
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

function getAuthToken(): string {
  const authToken = localStorage.getItem("access_token");
  if (!authToken) {
    throw new Error("No access token found. Please log in.");
  }
  return authToken;
}

/**
 * 회원가입 요청
 */
export async function signUp(data: { email: string; username: string; password: string }): Promise<User> {
  return apiRequest<User>("users/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * 로그인 요청 (JWT 토큰 반환)
 */
export async function login(data: { email: string; password: string }): Promise<{ access_token: string; refresh_token: string }> {
  const response = await apiRequest<{ access_token: string; refresh_token: string }>("users/signin", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return response;
}

/**
 * 로그아웃 요청 (refresh_token 필요)
 */
export async function logout(refreshToken: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("users/logout", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
}

/**
 * 토큰 갱신 (refresh_token 필요)
 */
export async function refreshToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string }> {
  return apiRequest<{ access_token: string; refresh_token: string }>("users/refresh", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  }, undefined, false); // 🔹 Refresh 요청은 자체적으로 다시 refreshToken을 호출하지 않도록 함
}

/**
 * 현재 사용자 정보 가져오기 (JWT 토큰 필요)
 */
export async function getCurrentUser(): Promise<User> {
  return apiRequest<User>("users/me", {}, getAuthToken());
}

export async function createBlog(data: { name: string; description: string}): Promise<Blog> {
  return apiRequest<Blog>("/blogs", {
    method: "POST",
    body: JSON.stringify(data),
  }, getAuthToken());
}

export async function fetchmyBlog(): Promise<Blog> {
  return apiRequest<Blog>("blogs/my_blog", {}, getAuthToken());
}

export async function fetchBlog(blogId: string): Promise<Blog> {
  return apiRequest<Blog>(`/blogs/by_id/${blogId}`)
}

export async function updateBlog(data: { blog_name?: string; description?: string }): Promise<Blog> {
  return apiRequest<Blog>(`blogs/update`, {
    method: "PATCH",
    body: JSON.stringify(data),
  }, getAuthToken())
}

export async function createCategory(blogId: string, data: { name: string }): Promise<Category> {
  return apiRequest<Category>(`/blogs/${blogId}/categories/`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function fetchCategories(blogId: string): Promise<Category[]> {
  const response = await apiRequest<{ category_list: { id: string; category_name: string }[] }>(
    `categories/list/${blogId}`
  );

  return response.category_list.map((cat) => ({
    id: cat.id.toString(),
    name: cat.category_name,
  }));
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
    return await apiRequest<Post[]>(`/posts/${queryString}`)
  } catch (error) {
    console.error("Failed to fetch posts:", error)
    // Return mock data as fallback
    return [
      {
        id: "1",
        title: "Sample Post 1",
        content: "This is a sample post content.",
        blog_id: "1",
        category_id: "1",
        author_id: "1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Sample Post 2",
        content: "This is another sample post content.",
        blog_id: "1",
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

