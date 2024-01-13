import { Type } from "@angular/core";
import { Base } from "./base.model";
import { Piece } from "./piece.model";
import { Rook } from "./pieces/rook.model";
import { Knight } from "./pieces/knight.model";
import { Pawn } from "./pieces/pawn.model";
import { Bishop } from "./pieces/bishop.model";
import { Queen } from "./pieces/queen.model";
import { King } from "./pieces/king.model";
import { cord } from "../components/board/board.component";

export class Game {
    board: Base[][] = [];
    boardSize = 8;

    isTarget = false;
    lastPiece: Piece | null = null;
    idToMove = 0;

    rounds = 0;

    pieceOrder: typeof Piece[] = [
        Rook,
        Knight,
        Bishop,
        Queen,
        King,
        Bishop,
        Knight,
        Rook,
        Pawn
    ]

    pieceNames = [
        'rook',
        'knight',
        'bishop',
        'queen',
        'king',
        'bishop',
        'knight',
        'rook',
        'pawn'
    ]

    lastTileWasWhite = true;

    turn: 'w' | 'b' = 'w';

    constructor() {
        this.startBoard();
    }

    predictOptions(piece: Piece) {
        this.board = piece.predictOptions(this.board);
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
            this.board[row][i].piece = new this.pieceOrder[i](
                row, i, this.pieceNames[i], `../../../assets/images/${color}_${this.pieceNames[i]}.png`, color
            )
        }

        for (let i = 0; i < this.boardSize; i++) {
            this.board[pawnRow][i].piece = new Pawn(
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

    doMove(lastPiece: Piece, origin: cord) {
        const index = this.pieceNames.indexOf(lastPiece.name);

        const newPiece = new this.pieceOrder[index](
            origin.i, origin.j, lastPiece.name, lastPiece.sprite, lastPiece.color
        )

        this.board[origin.i][origin.j].piece = newPiece;
        this.board[lastPiece.i][lastPiece.j].piece = null;
    }

    isCheck() {
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                const piece = this.board[i][j].piece;
                if (piece) {
                    this.predictOptions(piece);
                    this.checkKings(piece?.color);
                }
                this.clearMovables();
            }
        }
    }

    checkKings(colorAttack: 'w' | 'b') {
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                const piece = this.board[i][j].piece;

                const name = piece?.name == 'king';
                const color = piece?.color != colorAttack;
                const movable = this.board[i][j].movable

                if (name && color && movable) {
                    this.board[i][j].piece!.inCheck = true;
                }
            }
        }
    }

}