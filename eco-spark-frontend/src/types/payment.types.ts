export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface IPayment {
  id: string;
  userId: string;
  ideaId: string;
  amount: string;
  status: PaymentStatus;
  transactionId: string | null;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

export interface IInitiatePaymentPayload {
  ideaId: string;
}

export interface IMyIdeaSale {
  id: string;
  amount: string;
  status: PaymentStatus;
  transactionId: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  idea: {
    id: string;
    title: string;
  };
}
