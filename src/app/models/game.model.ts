import { Base } from "./base.model";
import { Piece } from "./piece.model";
import { Rook } from "./pieces/rook.model";

export class Game {
    board: Base[][] = [];
    boardSize = 8;

    isTarget = false;
    lastPiece: Piece | null = null;
    idToMove = 0;

    rounds = 0;

    pieceOrder: Piece = [
        Rook,
        // 'knight',
        // 'bishop',
        // 'queen',
        // 'king',
        // 'bishop',
        // 'knight',
        // 'rook'
    ]

    lastTileWasWhite = true;

    turn: 'w' | 'b' = 'w';

    predictOptions(piece: Piece) {
        const origin = { i: piece.i, j: piece.j };
        const isWhite = piece.color == 'w';

        this.board = piece.predictOptions(this.board, origin, isWhite);
    }

    startBoard() {
        let lastId = 0;
        for (let i = 0; i < this.boardSize; i++) {
            this.board.push([]);

            for (let j = 0; j < this.boardSize; j++) {
                lastId += 1;
                this.board[i].push(
                    new Base(i, j, this.getTileSprite(), lastId)
                )
            }
            this.lastTileWasWhite = !this.lastTileWasWhite;
        }

        this.startPieces();
    }

    startPieces() {
        this.buildPieces('w', 'top');
        this.buildPieces('b', 'bottom');
    }

    buildPieces(color: 'w' | 'b', pos: 'top' | 'bottom') {
        const row = pos == 'top' ? 0 : this.boardSize - 1;
        const pawnRow = row == 0 ? 1 : this.boardSize - 2;

        for (let i = 0; i < this.boardSize; i++) {

            switch (this.pieceOrder[i]) {
                case 'pawn':

            }
            this.board[row][i].piece = new this.pieceOrder[i](
                row, i, this.pieceOrder[i], `../../../assets/images/${color}_${this.pieceOrder[i]}.png`, color
            )
        }

        for (let i = 0; i < this.boardSize; i++) {
            this.board[pawnRow][i].piece = new Piece(
                pawnRow, i, 'pawn', `../../../assets/images/${color}_pawn.png`, color
            )
        }
    }


    getTileSprite() {
        const currentTile = this.lastTileWasWhite ? 'light' : 'dark';
        this.lastTileWasWhite = !this.lastTileWasWhite;
        return currentTile;
    }

    clearMovables() {
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                this.board[i][j].movable = false;
            }
        }
    }

    removeChecks() {
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                const piece = this.board[i][j].piece;
                const name = piece?.name == 'king';

                if (name) {
                    this.board[i][j].piece!.inCheck = false;
                }
            }
        }
    }

}