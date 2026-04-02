export interface INewsletterSubscription {
  id: string;
  email: string;
  createdAt: string;
}

export interface ICreateNewsletterSubscriptionPayload {
  email: string;
}
