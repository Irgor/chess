import { Base, cord } from "../base.model";
import { Piece } from "../piece.model";
import { King } from "./king.model";

export class Rook extends Piece {

    override predictOptions(board: Base[][]): Base[][] {
        const opponent = this.color == 'w' ? 'b' : 'w';

        let higherI = this.boardSize;
        let lowerI = 0;

        let higherJ = this.boardSize;
        let lowerJ = 0;

        for (let i = this.i + 1; i < this.boardSize; i++) {
            if (board[i][this.j].piece) {
                if (board[i][this.j].piece?.color == opponent) {
                    higherI = i;
                } else {
                    higherI = i - 1
                }

                break;
            }
        }

        for (let i = this.i - 1; i >= 0; i--) {
            if (board[i][this.j].piece) {
                if (board[i][this.j].piece?.color == opponent) {
                    lowerI = i;
                } else {
                    lowerI = i + 1
                }

                break;
            }
        }

        for (let j = this.j + 1; j < this.boardSize; j++) {
            if (board[this.i][j].piece) {
                if (board[this.i][j].piece?.color == opponent) {
                    higherJ = j;
                } else {
                    higherJ = j - 1;
                }

                break;
            }
        }

        for (let j = this.j - 1; j >= 0; j--) {
            if (board[this.i][j].piece) {
                if (board[this.i][j].piece?.color == opponent) {
                    lowerJ = j;
                } else {
                    lowerJ = j + 1;
                }

                break;
            }
        }

        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (i == this.i && j == this.j) {
                    continue;
                }

                if (j == this.j && i <= higherI && i >= lowerI) {
                    board[i][j].movable = true;
                }

                if (i == this.i && j <= higherJ && j >= lowerJ) {
                    board[i][j].movable = true;
                }
            }
        }

        return board
    }

}