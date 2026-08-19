export interface Comment {
  id: string;
  productId: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface CommentPayload {
  productId: string;
  text: string;
}
