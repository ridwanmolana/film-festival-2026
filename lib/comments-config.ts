import type { Comment } from "@/types";

/**
 * Shared comment constants & types.
 * NOT a "use server" file — safe to import from both client and server.
 */
export const COMMENTS_PAGE_SIZE = 10;
export const ADMIN_COMMENTS_PAGE_SIZE = 50;

export interface ApprovedCommentsResult {
  comments: Comment[];
  total: number;
}

export interface AdminCommentsResult {
  comments: Comment[];
  total: number;
}

export interface SubmitCommentResult {
  success: boolean;
  message: string;
}
