import { cord } from "src/app/components/board/board.component";
import { Base } from "../base.model";
import { Piece } from "../piece.model";

export class Rook extends Piece {

    override predictOptions(board: Base[][], origin: cord, isWhite: boolean): Base[][] {
        const opponent = isWhite ? 'b' : 'w';

        let higherI = this.boardSize;
        let lowerI = 0;

        let higherJ = this.boardSize;
        let lowerJ = 0;

        for (let i = origin.i + 1; i < this.boardSize; i++) {
            if (board[i][origin.j].piece) {
                if (board[i][origin.j].piece?.color == opponent) {
                    higherI = i;
                } else {
                    higherI = i - 1
                }

                break;
            }
        }

        for (let i = origin.i - 1; i >= 0; i--) {
            if (board[i][origin.j].piece) {
                if (board[i][origin.j].piece?.color == opponent) {
                    lowerI = i;
                } else {
                    lowerI = i + 1
                }

                break;
            }
        }

        for (let j = origin.j + 1; j < this.boardSize; j++) {
            if (board[origin.i][j].piece) {
                if (board[origin.i][j].piece?.color == opponent) {
                    higherJ = j;
                } else {
                    higherJ = j - 1;
                }

                break;
            }
        }

        for (let j = origin.j - 1; j >= 0; j--) {
            if (board[origin.i][j].piece) {
                if (board[origin.i][j].piece?.color == opponent) {
                    lowerJ = j;
                } else {
                    lowerJ = j + 1;
                }

                break;
            }
        }

        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (i == origin.i && j == origin.j) {
                    continue;
                }

                if (j == origin.j && i <= higherI && i >= lowerI) {
                    board[i][j].movable = true;
                }

                if (i == origin.i && j <= higherJ && j >= lowerJ) {
                    board[i][j].movable = true;
                }
            }
        }

        return board
    }
    
}