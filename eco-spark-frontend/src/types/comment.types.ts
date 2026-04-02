export interface IComment {
  id: string;
  content: string;
  authorId: string;
  ideaId: string;
  parentId: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  replies: IComment[];
}

export interface ICreateCommentPayload {
  content: string;
  ideaId: string;
  parentId?: string;
}

export interface IUpdateCommentPayload {
  content?: string;
}
