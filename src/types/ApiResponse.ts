import { Message } from "@/models/user.model";

export interface ApiResponse {
  success: boolean;
  message: string;

  // optional values
  isAcceptingMessages?: boolean;
  messages?: Message[]
};