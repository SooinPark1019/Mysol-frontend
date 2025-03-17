import type { Blog, Category, Post, User, PaginatedArticleListResponse } from "@/types/blog";

const API_URL = "https://api.editorialhub.site/api/";

let isRefreshing = false; 

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  authToken?: string,
  retry = true 
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
    console.warn("Access token expired or unauthorized. Attempting to refresh...");

    const refreshTokenStr = localStorage.getItem("refresh_token");

    if (refreshTokenStr && retry && !isRefreshing) {
      isRefreshing = true;
      try {
        const { access_token, refresh_token } = await refreshToken(refreshTokenStr);
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        isRefreshing = false;

        return apiRequest<T>(endpoint, options, access_token, false);

      } catch (error) {
        console.error("Failed to refresh token:", error);
        isRefreshing = false;

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        throw new Error("Session expired. Please log in again.");
      }
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API request failed: ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    // No Content
    return null as T;
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

export async function signUp(data: { email: string; username: string; password: string }): Promise<User> {
  return apiRequest<User>("users/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function login(data: { email: string; password: string }): Promise<{ access_token: string; refresh_token: string }> {
  const response = await apiRequest<{ access_token: string; refresh_token: string }>("users/signin", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return response;
}

export async function logout(refreshToken: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("users/logout", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
}

export async function refreshToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string }> {
  return apiRequest<{ access_token: string; refresh_token: string }>("users/refresh", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  }, undefined, false); 
}

export async function updateUser(data: {username: string}): Promise<User> {
  return apiRequest<User>("users/me",
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }, getAuthToken());
}

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

export async function createCategory(data: { categoryname: string }): Promise<Category> {
  const requestData = {
    ...data,
    categoryLevel: 1,
  };

  return apiRequest<Category>("categories/create", {
    method: "POST",
    body: JSON.stringify(requestData),
  }, getAuthToken());
}

export async function fetchCategories(blogId: number): Promise<Category[]> {
  const response = await apiRequest<{ category_list: { id: number; category_name: string }[] }>(
    `categories/list/${blogId}`
  );

  return response.category_list.map((cat) => ({
    id: cat.id,
    name: cat.category_name,
  }));
}


export async function updateCategory(categoryId: number, data: { categoryname: string }): Promise<Category> {
  return apiRequest<Category>(`categories/${categoryId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  }, getAuthToken())
}

export async function deleteCategory(categoryId: number): Promise<void> {
  return apiRequest(`categories/${categoryId}`, {
    method: "DELETE",
  }, getAuthToken())
}

export async function createPost(
  data: {
    title: string;
    content: string;
    description: string;
    main_image_url?: string;
    category_id: string;
    secret: 0 | 1;
    protected: 0 | 1;
    password?: string;
    comments_enabled: 0 | 1;
    images?: string[]
    problem_numbers: number[];
  }
): Promise<Post> {
  return apiRequest<Post>(
    `articles/create`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    getAuthToken()
  );
}

export async function fetchPostsByKeywords(
  params: {
    searching_words: string;
    page?: number;
    per_page?: number;
    sort_by?: "latest" | "likes" | "views";
  }
): Promise<PaginatedArticleListResponse> {
  const { searching_words, page = 1, per_page = 2, sort_by = "latest" } = params;
  const queryParams = new URLSearchParams();
  queryParams.set("page", page.toString());
  queryParams.set("per_page", per_page.toString());
  queryParams.set("sort_by", sort_by);
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
  
  try {
    return await apiRequest<PaginatedArticleListResponse>(`articles/search/${searching_words}${queryString}`);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    throw error;
  }
}

export async function fetchPostsByProblemNumber(
  params: {
    problem_number: number;
    page?: number;
    per_page?: number;
    sort_by?: "latest" | "likes" | "views";
  }
): Promise<PaginatedArticleListResponse> {
  const { problem_number, page = 1, per_page = 10, sort_by = "latest" } = params;
  const queryParams = new URLSearchParams();
  queryParams.set("page", page.toString());
  queryParams.set("per_page", per_page.toString());
  queryParams.set("sort_by", sort_by);
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
  
  try {
    return await apiRequest<PaginatedArticleListResponse>(`articles/problems/${problem_number}${queryString}`);
  } catch (error) {
    console.error("Failed to fetch posts by problem number:", error);
    throw error;
  }
}

export async function fetchPost(postId: number): Promise<Post> {
  return apiRequest<Post>(`articles/get/${postId}`)
}

export async function fetchPostFromBlog(
  blogId: number,
  page: number = 1
): Promise<PaginatedArticleListResponse> {
  const queryParams = new URLSearchParams();
  queryParams.set("page", page.toString());
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

  try {
    return await apiRequest<PaginatedArticleListResponse>(`articles/blogs/${blogId}${queryString}`, {}, getAuthToken());
  } catch (error) {
    console.error("Failed to fetch posts from blog:", error);
    throw error;
  }
}

export async function fetchPostsInCategory(
  blogId: number,
  categoryId: number,
  page: number = 1
): Promise<PaginatedArticleListResponse> {
  const queryParams = new URLSearchParams();
  queryParams.set("page", page.toString());
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
  
  try {
    return await apiRequest<PaginatedArticleListResponse>(
      `articles/blogs/${blogId}/categories/${categoryId}${queryString}`,
      {},
      getAuthToken()
    );
  } catch (error) {
    console.error("Failed to fetch posts in category:", error);
    throw error;
  }
}

export async function deletePost(articleId: number): Promise<void> {
  try {
    await apiRequest<void>(`articles/delete/${articleId}`, {
      method: "DELETE",
    }, getAuthToken());
  } catch (error) {
    console.error(`Failed to delete post (ID: ${articleId}):`, error);
    throw error;
  }
}

export async function updatePost(
  postId: number,
  data: {
    title?: string;
    content?: string;
    description?: string;
    category_id?: number;
    secret?: 0 | 1;
    protected?: 0 | 1;
    password?: string;
    comments_enabled?: 0 | 1;
    problem_numbers?: number[];
  }
): Promise<Post> {
  try {
    // protected가 0이면 password를 null로 설정
    if (data.protected === 0) {
      delete data.password;
    }

    return await apiRequest<Post>(`articles/update/${postId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }, getAuthToken());
  } catch (error) {
    console.error(`Failed to update post (ID: ${postId}):`, error);
    throw error;
  }
}


export async function likePost(data: {
  article_id: number
},): Promise<void> {
  return apiRequest(`likes/create`, {
    method: "POST",
    body: JSON.stringify(data),
  }, getAuthToken())
}

export async function unlikePost(postId: number): Promise<void> {
  return apiRequest(`likes/${postId}`, {
    method: "DELETE",
  }, getAuthToken())
}

export async function getLike(postId: number): Promise<boolean>{
  return apiRequest(`likes/blog/press_like/${postId}`, {
    method: "GET"
  }, getAuthToken())
}

