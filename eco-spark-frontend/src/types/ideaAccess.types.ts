export interface IIdeaAccess {
  id: string;
  userId: string;
  ideaId: string;
  paymentId: string;
  createdAt: string;
}

export interface IIdeaAccessCheck {
  hasAccess: boolean;
}
