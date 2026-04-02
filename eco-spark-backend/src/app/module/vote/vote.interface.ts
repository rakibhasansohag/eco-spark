import { VoteType } from "../../../generated/prisma/index.js";

export interface ICreateVote {
  ideaId: string;
  type: VoteType;
}
