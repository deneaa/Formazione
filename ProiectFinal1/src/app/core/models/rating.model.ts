export interface Rating {
  id: string;
  userId: string;
  value: number;
  createdAt: string;
}

export interface RatingPayload {
  value: number;
}
