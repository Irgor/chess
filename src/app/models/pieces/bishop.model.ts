import { cord } from "src/app/components/board/board.component";
import { Base } from "../base.model";
import { Piece } from "../piece.model";

export class Bishop extends Piece {

    override predictOptions(board: Base[][]): Base[][] {
        const isWhite = this.color == 'w';
        const opponent = isWhite ? 'b' : 'w';

        let maxLeft = this.boardSize;
        let foundMaxLeft = false;

        let maxRight = this.boardSize;
        let foundMaxRight = false;

        let minLeft = 0;
        let foundMinLeft = false;

        let minRight = 0;
        let foundMinRight = false;

        for (let i = 0; i < this.boardSize; i++) {
            const distance = Math.max(i, this.i) - Math.min(i, this.i);

            if (i == this.i) {
                continue;
            }

            if (board[i][this.j - distance] && board[i][this.j - distance].piece) {
                if (i > this.i && !foundMaxLeft) {
                    maxLeft = i;

                    if (board[i][this.j - distance].piece?.color != opponent) {
                        maxLeft = i - 1;
                    }

                    foundMaxLeft = true;
                }

                if (i < this.i && !foundMinLeft) {
                    minLeft = i;

                    if (board[i][this.j - distance].piece?.color != opponent) {
                        minLeft = i + 1;
                    }
                }
            }

            if (board[i][this.j + distance] && board[i][this.j + distance].piece) {
                if (i > this.i && !foundMaxRight) {
                    maxRight = i;

                    if (board[i][this.j + distance].piece?.color != opponent) {
                        maxRight = i - 1;
                    }

                    foundMaxRight = true;
                }

                if (i < this.i && !foundMinRight) {
                    minRight = i;

                    if (board[i][this.j + distance].piece?.color != opponent) {
                        minRight = i + 1;
                    }
                }
            }
        }

        for (let i = 0; i < this.boardSize; i++) {
            const distance = Math.max(i, this.i) - Math.min(i, this.i);

            if (i == this.i) {
                continue;
            }

            if (board[i][this.j - distance] && i >= minLeft && i <= maxLeft) {
                board[i][this.j - distance].movable = true;
            }

            if (board[i][this.j + distance] && i >= minRight && i <= maxRight) {
                board[i][this.j + distance].movable = true;
            }
        }

        return board
    }
}