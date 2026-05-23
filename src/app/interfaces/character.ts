export interface Character {

    id: number;
    name: string;
    status: 'Alive' | 'Dead' | 'unknown';
    species: string;
    type: string;
    gender: string;
    origin: {
        name: string;
    },
    image: string;
    episode: string[]

}
