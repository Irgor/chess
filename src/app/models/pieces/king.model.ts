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

        return board
    }

}