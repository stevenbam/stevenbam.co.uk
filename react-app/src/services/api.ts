const API_BASE_URL = 'http://localhost:5138/api';

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
  createdDate: string;
  updatedDate?: string;
}

export interface Photo {
  id: number;
  caption: string;
  fileName: string;
  filePath: string;
  contentType?: string;
  fileSize: number;
  uploadedDate: string;
}

// Blog API functions
export const blogApi = {
  async getAll(): Promise<BlogPost[]> {
    const response = await fetch(`${API_BASE_URL}/blog`);
    if (!response.ok) throw new Error('Failed to fetch blog posts');
    return response.json();
  },

  async getById(id: number): Promise<BlogPost> {
    const response = await fetch(`${API_BASE_URL}/blog/${id}`);
    if (!response.ok) throw new Error('Failed to fetch blog post');
    return response.json();
  },

  async create(post: Omit<BlogPost, 'id' | 'createdDate' | 'updatedDate'>): Promise<BlogPost> {
    const response = await fetch(`${API_BASE_URL}/blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    });
    if (!response.ok) throw new Error('Failed to create blog post');
    return response.json();
  },

  async update(id: number, post: BlogPost): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    });
    if (!response.ok) throw new Error('Failed to update blog post');
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete blog post');
  }
};

// Photo API functions
export const photoApi = {
  async getAll(): Promise<Photo[]> {
    const response = await fetch(`${API_BASE_URL}/photo`);
    if (!response.ok) throw new Error('Failed to fetch photos');
    return response.json();
  },

  async getById(id: number): Promise<Photo> {
    const response = await fetch(`${API_BASE_URL}/photo/${id}`);
    if (!response.ok) throw new Error('Failed to fetch photo');
    return response.json();
  },

  async upload(file: File, caption: string): Promise<Photo> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('caption', caption);

    const response = await fetch(`${API_BASE_URL}/photo`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload photo');
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/photo/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete photo');
  },

  getImageUrl(photo: Photo): string {
    return `http://localhost:5138/${photo.filePath}`;
  }
};