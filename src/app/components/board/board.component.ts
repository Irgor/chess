import { Component, OnInit } from '@angular/core';
import { Base } from 'src/app/models/base.model';
import { Piece } from 'src/app/models/piece.model';

export type cord = {
  i: number,
  j: number
}

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
  idToMove = 0;

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

  move(piece: Piece | undefined | null, i: number, j: number, id: number, movable: boolean) {
    if (this.isTarget && this.lastPiece && movable) {
      const cord: cord = { i, j };
      this.doMove(this.lastPiece, cord);
      this.endTurn();
      return;
    }

    if (piece) {
      this.setMove(piece, id);
      return;
    }
  }

  setMove(piece: Piece, id: number) {
    if (piece.color != this.turn) {
      return;
    }

    this.idToMove = id;
    this.lastPiece = piece;
    this.isTarget = true;
    this.clearMovables();
    this.predictOptions(piece);
  }

  predictOptions(piece: Piece) {
    const type = piece.name;
    const origin = { i: piece.i, j: piece.j };
    const isWhite = piece.color == 'w';

    console.log(type);

    switch (type) {
      case 'pawn':
        this.pawnPredictions(isWhite, origin);
        break;
      case 'rook':
        this.rookPredictions(isWhite, origin);
        break;
    }
  }

  doMove(lastPiece: Piece, origin: cord) {
    const newPiece = new Piece(
      origin.i, origin.j, lastPiece.name, lastPiece.sprite, lastPiece.color
    )

    this.board[origin.i][origin.j].piece = newPiece;
    this.board[lastPiece.i][lastPiece.j].piece = null;
  }

  endTurn() {
    this.lastPiece = null;
    this.isTarget = false;
    this.turn = this.turn == 'w' ? 'b' : 'w';
    this.rounds++;
    this.idToMove = 0;
    this.clearMovables();
  }

  clearMovables() {
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        this.board[i][j].movable = false;
      }
    }
  }

  // EACH PIECE MOVE PREDICT //

  pawnPredictions(isWhite: boolean, origin: cord) {
    let pawnMaxIMove = isWhite ? 1 : -1;

    if (origin.i == 1 && isWhite) {
      pawnMaxIMove = 2;
    }

    if (origin.i == this.boardSize - 2 && !isWhite) {
      pawnMaxIMove = -2;
    }

    let j = origin.j;
    for (let i = 0; i < this.boardSize; i++) {
      let canIMove = false;

      if (isWhite) {
        canIMove = i <= origin.i + pawnMaxIMove && i > origin.i;

        for (let h = origin.i + 1; h <= origin.i + pawnMaxIMove; h++) {
          if (this.board[h][j].piece) {
            canIMove = false;
          }
        }
      }

      if (!isWhite) {
        canIMove = i >= origin.i + pawnMaxIMove && i < origin.i;

        for (let h = origin.i - 1; h >= origin.i + pawnMaxIMove; h--) {
          if (!!this.board[h][j].piece) {
            canIMove = false;
          }
        }
      }

      if (canIMove) {
        this.board[i][j].movable = true;
      }
    }

    // check captures
    const addI = isWhite ? 1 : -1;
    const opponent = isWhite ? 'b' : 'w';

    if (this.board[origin.i + addI] && this.board[origin.i + addI][origin.j - 1]) {
      const canTakeLeftCorner = this.board[origin.i + addI][origin.j - 1].piece?.color == opponent;
      if (canTakeLeftCorner) {
        this.board[origin.i + addI][origin.j - 1].movable = true;
      }
    }

    if (this.board[origin.i + addI] && this.board[origin.i + addI][origin.j + 1]) {
      const canTakeRightCorner = this.board[origin.i + addI][origin.j + 1].piece?.color == opponent;
      if (canTakeRightCorner) {
        this.board[origin.i + addI][origin.j + 1].movable = true;
      }
    }
  }

  rookPredictions(isWhite: boolean, origin: cord) {
    let maxI = this.boardSize, maxJ = this.boardSize;
    let minI = 0, minJ = 0;
    const opponent = isWhite ? 'b' : 'w';
    const sub = isWhite ? 1 : -1;

    for (let i = origin.i + 1; i < this.boardSize; i++) {
      if (this.board[i][origin.j].piece) {
        if (this.board[i][origin.j].piece?.color == opponent) {
          maxI = i;
        } else {
          maxI = i - sub;
        }

        break;
      }
    }


    for (let i = origin.i - 1; i >= 0; i--) {
      if (this.board[i][origin.j].piece) {
        if (this.board[i][origin.j].piece?.color == opponent) {
          minI = i;
        } else {
          minI = i - sub;
        }

        break;
      }
    }

    console.log(maxI, minI)

    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {

        if (i == origin.i && j == origin.j) {
          continue;
        }

        if (maxI && i <= maxI && j == origin.j) {
          this.board[i][j].movable = true;
        }

        if (minI && i >= minI && j == origin.j) {
          this.board[i][j].movable = true;
        }

      }
    }

  }
}