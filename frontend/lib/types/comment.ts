export interface Comment {
    id: string;
    body: string;
    createdAt: string;
    
    // Foreign Keys
    authorId: string;
    postId: string;
}

export interface CreateCommentDto {
    body: string;
    
    // Foreign Key
    postId: string;
}