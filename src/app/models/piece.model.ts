export class Piece {
    i: number;
    j: number;
    sprite: string = '';
    name: string;
    color: 'w' | 'b';
    inCheck: boolean = false;

    constructor(i: number, j: number, name: string, sprite: string, color: 'w' | 'b') {
        this.i = i;
        this.j = j;
        this.name = name;
        this.sprite = sprite;
        this.color = color;
    }
}