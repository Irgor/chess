import { Piece } from "./piece.model";

export class Base {
    i: number;
    j: number;
    spriteBase: string = '';
    piece?: Piece | null;
    id: number;
    movable: boolean = false;

    constructor(i: number, j: number, sprite: string, id: number, piece?: Piece) {
        this.i = i;
        this.j = j;
        this.spriteBase = sprite
        this.id = id;
        this.piece = piece ?? null
    }
}

export type cord = {
    i: number;
    j: number;
}