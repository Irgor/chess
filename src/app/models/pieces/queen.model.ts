import { Base } from "../base.model";
import { Piece } from "../piece.model";
import { Rook } from "./rook.model";
import { Bishop } from "./bishop.model";

export class Queen extends Piece {

    override predictOptions(board: Base[][]): Base[][] {
        
        board = new Rook(this.i, this.j, 'rook', '', this.color).predictOptions(board);
        board = new Bishop(this.i, this.j, 'bishop', '', this.color).predictOptions(board);

        return board
    }
}