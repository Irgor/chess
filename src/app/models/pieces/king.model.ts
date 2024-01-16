import { Base, cord } from "../base.model";
import { Piece } from "../piece.model";

export class King extends Piece {

    override predictOptions(board: Base[][]): Base[][] {
        const isWhite = this.color == 'w';
        const opponent = isWhite ? 'b' : 'w';
        const origin: cord = { i: this.i, j: this.j };

        board = this.checkFixedMove(board, origin, -1, -1, opponent);
        board = this.checkFixedMove(board, origin, -1, 0, opponent);
        board = this.checkFixedMove(board, origin, -1, 1, opponent);

        board = this.checkFixedMove(board, origin, 0, -1, opponent);
        board = this.checkFixedMove(board, origin, 0, 1, opponent);

        board = this.checkFixedMove(board, origin, 1, -1, opponent);
        board = this.checkFixedMove(board, origin, 1, 0, opponent);
        board = this.checkFixedMove(board, origin, 1, 1, opponent);

        board = this.castle(board);

        return board
    }

    castle(board: Base[][]): Base[][] {
        if (this.hasMoved) {
            return board;
        }

        let hasLeftRookMoved = true;
        let isPathToLeftClear = false;
        let leftRookCord: cord = { i: 0, j: 0 };

        let hasRightRookMoved = true;
        let isPathToRightClear = false;
        let rightRookCord: cord = { i: 0, j: 0 };

        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                const piece = board[i][j].piece;
                if (piece && piece.color == this.color) {
                    if (piece.name == 'rook' && piece.j < this.boardSize / 2) {
                        hasLeftRookMoved = piece.hasMoved
                        leftRookCord = {
                            i: piece.i,
                            j: piece.j
                        }
                    }

                    if (piece.name == 'rook' && piece.j > this.boardSize / 2) {
                        hasRightRookMoved = piece.hasMoved
                        rightRookCord = {
                            i: piece.i,
                            j: piece.j
                        }
                    }
                }
            }
        }

        if (!hasLeftRookMoved) {
            for (let j = leftRookCord.j + 1; j < this.j; j++) {
                isPathToLeftClear = !board[this.i][j].piece;
            }
        }

        if (!hasRightRookMoved) {
            for (let j = this.j + 1; j > this.j; j--) {
                isPathToRightClear = !board[this.i][j].piece;
            }
        }

        if (!hasRightRookMoved && isPathToRightClear) {
            board[rightRookCord.i][rightRookCord.j].movable = true;
        }

        if (!hasLeftRookMoved && isPathToLeftClear) {
            board[leftRookCord.i][leftRookCord.j].movable = true;
        }

        return board;
    }

}