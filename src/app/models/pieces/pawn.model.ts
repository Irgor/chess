import { cord } from "src/app/components/board/board.component";
import { Base } from "../base.model";
import { Piece } from "../piece.model";

export class Pawn extends Piece {

    override predictOptions(board: Base[][], origin: cord, isWhite: boolean): Base[][] {
        let pawnMaxIMove = isWhite ? 1 : -1;

        if (origin.i == 1 && isWhite) {
            pawnMaxIMove = 2;
        }

        if (origin.i == this.boardSize - 2 && !isWhite) {
            pawnMaxIMove = -2;
        }

        let j = origin.j;
        for (let i = 0; i < this.boardSize; i++) {

            if (isWhite) {
                if (i <= origin.i + pawnMaxIMove && i > origin.i) {
                    board[i][j].movable = !board[i][j].piece
                }
            }

            if (!isWhite) {
                if (i >= origin.i + pawnMaxIMove && i < origin.i) {
                    board[i][j].movable = !board[i][j].piece
                }
            }
        }

        // check captures
        const addI = isWhite ? 1 : -1;
        const opponent = isWhite ? 'b' : 'w';

        if (board[origin.i + addI] && board[origin.i + addI][origin.j - 1]) {
            const canTakeLeftCorner = board[origin.i + addI][origin.j - 1].piece?.color == opponent;
            if (canTakeLeftCorner) {
                board[origin.i + addI][origin.j - 1].movable = true;
            }
        }

        if (board[origin.i + addI] && board[origin.i + addI][origin.j + 1]) {
            const canTakeRightCorner = board[origin.i + addI][origin.j + 1].piece?.color == opponent;
            if (canTakeRightCorner) {
                board[origin.i + addI][origin.j + 1].movable = true;
            }
        }

        return board
    }
}