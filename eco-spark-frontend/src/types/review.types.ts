export interface IReview {
  id: string;
  rating: number;
  effectiveness: number;
  experience: string;
  userId: string;
  ideaId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
    image?: string;
  };
}
