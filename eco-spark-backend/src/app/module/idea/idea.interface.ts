export interface ICreateIdea {
  title: string;
  problemStatement: string;
  proposedSolution: string;
  description: string;
  categoryId: string;
  isPaid?: boolean;
  price?: number;
}

export interface IUpdateIdea {
  title?: string;
  problemStatement?: string;
  proposedSolution?: string;
  description?: string;
  categoryId?: string;
  isPaid?: boolean;
  price?: number;
}

export interface IRejectIdea {
  rejectionFeedback: string;
}
