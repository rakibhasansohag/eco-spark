export interface IAdminDashboardStats {
  totalMembers: number;
  totalIdeas: number;
  ideasByStatus: {
    approved: number;
    pending: number;
    underReview: number;
    rejected: number;
  };
}

export interface IMemberDashboardStats {
  totalIdeas: number;
  ideasByStatus: {
    approved: number;
    pending: number;
    rejected: number;
  };
  totalVotesReceived: number;
  totalCommentsReceived: number;
}
