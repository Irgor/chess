import { Base, cord } from "./base.model";

export class Piece {
    boardSize = 8;
    i: number;
    j: number;
    sprite: string = '';
    name: string;
    color: 'w' | 'b';
    inCheck: boolean = false;
    canPromote: boolean = false;

    constructor(i: number, j: number, name: string, sprite: string, color: 'w' | 'b') {
        this.i = i;
        this.j = j;
        this.name = name;
        this.sprite = sprite;
        this.color = color;
    }

    predictOptions(board: Base[][]): Base[][] { return [] }

    checkFixedMove(board: Base[][], origin: cord, iMove: number, jMove: number, opponent: 'w' | 'b'): Base[][] {
        if (board[origin.i - iMove]) {
            if (board[origin.i - iMove][origin.j - jMove]) {
                if (board[origin.i - iMove][origin.j - jMove].piece?.color == opponent ||
                    !board[origin.i - iMove][origin.j - jMove].piece) {
                    board[origin.i - iMove][origin.j - jMove].movable = true;
                }
            }
        }

        return board;
    }
}