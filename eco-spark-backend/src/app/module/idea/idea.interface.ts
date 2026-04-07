export interface ICreateIdea {
  title: string;
  problemStatement: string;
  proposedSolution: string;
  description: string;
  targetAudience?: string;
  implementationStage?: "CONCEPT" | "PILOT" | "SCALING" | "IMPLEMENTED";
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

export interface IUpdateIdea {
  title?: string;
  problemStatement?: string;
  proposedSolution?: string;
  description?: string;
  targetAudience?: string;
  implementationStage?: "CONCEPT" | "PILOT" | "SCALING" | "IMPLEMENTED";
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

export interface IRejectIdea {
  rejectionFeedback: string;
}
