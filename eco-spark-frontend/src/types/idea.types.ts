export type IdeaStatus = "DRAFT" | "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";

export interface IIdea {
  id: string;
  title: string;
  problemStatement: string;
  proposedSolution: string | null;
  description: string | null;
  status: IdeaStatus;
  isPaid: boolean;
  price: string | null;
  rejectionFeedback: string | null;
  authorId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateIdeaPayload {
  title: string;
  problemStatement: string;
  proposedSolution: string;
  description: string;
  categoryId: string;
  isPaid?: boolean;
  price?: number;
}

export interface IUpdateIdeaPayload {
  title?: string;
  problemStatement?: string;
  proposedSolution?: string;
  description?: string;
  categoryId?: string;
  isPaid?: boolean;
  price?: number;
}
