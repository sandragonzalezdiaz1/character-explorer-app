import { Character } from "./character";

export interface CharacterApiResponse {

    info: {
        count: number;
        pages: number;
        next: string | null;
        prev: string | null;
    };
    results: Character[];
    
}
