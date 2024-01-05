import { Piece } from "./piece.model";

export class Base {
    i: number;
    j: number;
    spriteBase: string = '';
    piece?: Piece | null

    constructor(i: number, j: number, sprite: string, piece?: Piece) {
        this.i = i;
        this.j = j;
        this.spriteBase = sprite
        this.piece = piece ?? null
    }
}