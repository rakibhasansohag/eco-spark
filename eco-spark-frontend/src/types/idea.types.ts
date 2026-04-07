export type IdeaStatus = "DRAFT" | "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
export type IdeaStage = "CONCEPT" | "PILOT" | "SCALING" | "IMPLEMENTED";

export interface IIdea {
  id: string;
  title: string;
  problemStatement: string;
  proposedSolution: string | null;
  description: string | null;
  targetAudience?: string | null;
  implementationStage?: IdeaStage | null;
  estimatedBudgetMin?: string | null;
  estimatedBudgetMax?: string | null;
  timelineWeeks?: number | null;
  locationScope?: string | null;
  expectedImpact?: string | null;
  risksAndMitigation?: string | null;
  externalLinks?: string[];
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
  targetAudience?: string;
  implementationStage?: IdeaStage;
  estimatedBudgetMin?: number;
  estimatedBudgetMax?: number;
  timelineWeeks?: number;
  locationScope?: string;
  expectedImpact?: string;
  risksAndMitigation?: string;
  externalLinks?: string[];
  categoryId: string;
  isPaid?: boolean;
  price?: number;
}

export interface IUpdateIdeaPayload {
  title?: string;
  problemStatement?: string;
  proposedSolution?: string;
  description?: string;
  targetAudience?: string;
  implementationStage?: IdeaStage;
  estimatedBudgetMin?: number;
  estimatedBudgetMax?: number;
  timelineWeeks?: number;
  locationScope?: string;
  expectedImpact?: string;
  risksAndMitigation?: string;
  externalLinks?: string[];
  categoryId?: string;
  isPaid?: boolean;
  price?: number;
}
