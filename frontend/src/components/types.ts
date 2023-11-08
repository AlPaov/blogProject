export interface Comment {
    id: number
    creator_id: number;
    post_id: number;
    text: string;
    create_date: string;
    grade: number | null;
    like_or_dis: "like" | "dislike" | null;
    creator_username: string | null;
}