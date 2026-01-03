export interface Post {
    id: string;          
    title: string;
    body: string;        
    ticker: string;
    createdAt: string;   
    authorId: string;
    // comments: Comment[]; 
}

export interface CreatePostDto {
    title: string;
    body: string;
    ticker: string;
}

export interface UpdatePostDto {
    title: string;
    body: string;
}