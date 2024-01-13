import { cord } from "src/app/components/board/board.component";
import { Base } from "../base.model";
import { Piece } from "../piece.model";

export class Knight extends Piece {

    override predictOptions(board: Base[][]): Base[][] {
        const isWhite = this.color == 'w';
        const origin: cord = { i: this.i, j: this.j };
        const opponent = isWhite ? 'b' : 'w';

        board = this.checkFixedMove(board, origin, 2, 1, opponent);
        board = this.checkFixedMove(board, origin, 2, -1, opponent);

        board = this.checkFixedMove(board, origin, 1, 2, opponent);
        board = this.checkFixedMove(board, origin, 1, -2, opponent);

        board = this.checkFixedMove(board, origin, -1, 2, opponent);
        board = this.checkFixedMove(board, origin, -1, -2, opponent);

        board = this.checkFixedMove(board, origin, -2, 1, opponent);
        board = this.checkFixedMove(board, origin, -2, -1, opponent);

        return board
    }

}