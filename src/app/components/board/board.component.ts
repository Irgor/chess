import { Component, OnInit } from '@angular/core';
import { Base } from 'src/app/models/base.model';
import { Piece } from 'src/app/models/piece.model';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  boardSize = 8;
  board: Base[][] = [];

  isTarget = false;
  lastPiece: Piece | null = null;

  rounds = 0;

  pieceOrder = [
    'rook',
    'knight',
    'bishop',
    'queen',
    'king',
    'bishop',
    'knight',
    'rook'
  ]

  lastTileWasWhite = true;

  turn: 'w' | 'b' = 'w';

  ngOnInit(): void {
    this.startBoard();
  }

  startBoard() {
    for (let i = 0; i < this.boardSize; i++) {
      this.board.push([]);

      for (let j = 0; j < this.boardSize; j++) {
        this.board[i].push(
          new Base(i, j, this.getTileSprite())
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
      this.board[row][i].piece = new Piece(
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

  isWhiteTile(base: Base): boolean {
    return base.spriteBase.includes('light');
  }

  move(piece: Piece | undefined | null, i: number, j: number) {
    console.log(this.board);

    if (this.isTarget && this.lastPiece) {
      const canMove = this.checkMove(this.lastPiece.name, this.lastPiece.color, { i, j }, { i: this.lastPiece.i, j: this.lastPiece.j });

      if (canMove) {
        this.doMove(this.lastPiece, i, j);
        this.endTurn();
      }
      return;
    }

    if (piece) {
      this.setMove(piece);
      return;
    }
  }

  setMove(piece: Piece) {
    if (piece.color != this.turn) {
      return;
    }

    this.lastPiece = piece;
    this.isTarget = true;
  }

  doMove(lastPiece: Piece, i: number, j: number) {
    const newPiece = new Piece(
      i, j, lastPiece.name, lastPiece.sprite, lastPiece.color
    )

    this.board[i][j].piece = newPiece;
    this.board[lastPiece.i][lastPiece.j].piece = null;
  }

  endTurn() {
    this.lastPiece = null;
    this.isTarget = false;
    this.turn = this.turn == 'w' ? 'b' : 'w';
    this.rounds++;
  }

  checkMove(type: string, color: 'w' | 'b', destination: { i: number, j: number }, origin: { i: number, j: number }): boolean {
    let canMove = false;

    switch (type) {
      case 'pawn':
        let pawnMaxIMove = 1;

        if (origin.i == 1 && color == 'w') {
          pawnMaxIMove = 2;
        }

        if (origin.i == this.boardSize - 2 && color == 'b') {
          pawnMaxIMove = -2;
        }

        let canIMove = origin.i + pawnMaxIMove == destination.i || origin.i + (color == 'w' ? 1 : -1) == destination.i;
        canMove = canIMove && destination.j == origin.j;
        break;
    }

    return canMove;
  }

}
