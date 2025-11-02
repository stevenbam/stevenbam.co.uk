const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.stevenbam.co.uk/api' 
  : 'http://localhost:5138/api';

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

export interface Comment {
  id: number;
  authorName: string;
  content: string;
  createdDate: string;
  authorEmail?: string;
  isApproved?: boolean;
  contentTitle?: string;
}

export interface Reaction {
  [emoji: string]: number;
}

export interface UserReaction {
  contentType: 'blog' | 'photo';
  contentId: number;
  reactionType: string;
  userIdentifier: string;
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
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://api.stevenbam.co.uk' 
      : 'http://localhost:5138';
    return `${baseUrl}/${photo.filePath}`;
  }
};

// Generate user identifier for reactions (browser fingerprint)
const getUserIdentifier = (): string => {
  let identifier = localStorage.getItem('user_identifier');
  if (!identifier) {
    identifier = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('user_identifier', identifier);
  }
  return identifier;
};

// Comments API functions
export const commentsApi = {
  async getComments(contentType: 'blog' | 'photo', contentId: number): Promise<Comment[]> {
    const response = await fetch(`${API_BASE_URL}/comments/${contentType}/${contentId}`);
    if (!response.ok) throw new Error('Failed to fetch comments');
    return response.json();
  },

  async createComment(contentType: 'blog' | 'photo', contentId: number, authorName: string, content: string, authorEmail?: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contentType,
        contentId,
        authorName,
        content,
        authorEmail,
      }),
    });
    if (!response.ok) throw new Error('Failed to create comment');
  },

  async getPendingComments(): Promise<Comment[]> {
    const response = await fetch(`${API_BASE_URL}/comments/pending`);
    if (!response.ok) throw new Error('Failed to fetch pending comments');
    return response.json();
  },

  async approveComment(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/comments/${id}/approve`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to approve comment');
  },

  async deleteComment(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/comments/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete comment');
  },
};

// Reactions API functions
export const reactionsApi = {
  async getReactions(contentType: 'blog' | 'photo', contentId: number): Promise<Reaction> {
    const response = await fetch(`${API_BASE_URL}/reactions/${contentType}/${contentId}`);
    if (!response.ok) throw new Error('Failed to fetch reactions');
    return response.json();
  },

  async getUserReactions(contentType: 'blog' | 'photo', contentId: number): Promise<string[]> {
    const userIdentifier = getUserIdentifier();
    const response = await fetch(`${API_BASE_URL}/reactions/${contentType}/${contentId}/user/${encodeURIComponent(userIdentifier)}`);
    if (!response.ok) throw new Error('Failed to fetch user reactions');
    return response.json();
  },

  async toggleReaction(contentType: 'blog' | 'photo', contentId: number, reactionType: string): Promise<{action: 'added' | 'removed', reactionType: string}> {
    const userIdentifier = getUserIdentifier();
    const response = await fetch(`${API_BASE_URL}/reactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contentType,
        contentId,
        reactionType,
        userIdentifier,
      }),
    });
    if (!response.ok) throw new Error('Failed to toggle reaction');
    return response.json();
  },

  async getReactionSummary(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/reactions/summary`);
    if (!response.ok) throw new Error('Failed to fetch reaction summary');
    return response.json();
  },

  async clearReactions(contentType: 'blog' | 'photo', contentId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/reactions/${contentType}/${contentId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to clear reactions');
  },
};

// Available emoji reactions
export const AVAILABLE_REACTIONS = ['👍', '❤️', '😊', '😢', '😮', '😡', '🔥', '⭐', '🎉', '💯'];