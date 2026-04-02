export type VoteType = "UPVOTE" | "DOWNVOTE";

export interface ICreateVotePayload {
  ideaId: string;
  type: VoteType;
}

export interface IVoteCounts {
  upvotes: number;
  downvotes: number;
  userVote: VoteType | null;
}
