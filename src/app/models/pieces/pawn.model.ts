import { cord } from "src/app/components/board/board.component";
import { Base } from "../base.model";
import { Piece } from "../piece.model";

export class Pawn extends Piece {

    override predictOptions(board: Base[][]): Base[][] {
        const isWhite = this.color == 'w';
        let pawnMaxIMove = isWhite ? 1 : -1;

        if (this.i == 1 && isWhite) {
            pawnMaxIMove = 2;
        }

        if (this.i == this.boardSize - 2 && !isWhite) {
            pawnMaxIMove = -2;
        }

        let j = this.j;
        for (let i = 0; i < this.boardSize; i++) {

            if (isWhite) {
                if (i <= this.i + pawnMaxIMove && i > this.i) {
                    board[i][j].movable = !board[i][j].piece
                }
            }

            if (!isWhite) {
                if (i >= this.i + pawnMaxIMove && i < this.i) {
                    board[i][j].movable = !board[i][j].piece
                }
            }
        }

        // check captures
        const addI = isWhite ? 1 : -1;
        const opponent = isWhite ? 'b' : 'w';

        if (board[this.i + addI] && board[this.i + addI][this.j - 1]) {
            const canTakeLeftCorner = board[this.i + addI][this.j - 1].piece?.color == opponent;
            if (canTakeLeftCorner) {
                board[this.i + addI][this.j - 1].movable = true;
            }
        }

        if (board[this.i + addI] && board[this.i + addI][this.j + 1]) {
            const canTakeRightCorner = board[this.i + addI][this.j + 1].piece?.color == opponent;
            if (canTakeRightCorner) {
                board[this.i + addI][this.j + 1].movable = true;
            }
        }

        return board
    }
}