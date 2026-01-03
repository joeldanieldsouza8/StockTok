export interface Post {
  id?: string;
  username: string;
  title: string;
  description: string;
  time_created: Date;
  ticker: string;
  upvotes: number;
  downvotes: number;
  // comments: Comment[];
}

export interface PostObject {
  id?: string;
  username: string;
  title: string;
  description: string;
  time_created: string;
  ticker: string;
}

// export interface Comment {
//   id: string;
//   body: string;
//   createdAt: string;
//   authorId: string;
//   postId: string;
// }