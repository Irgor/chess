import { Component, OnInit } from '@angular/core';
import { max } from 'rxjs';
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

    switch (type) {
      case 'pawn':
        this.pawnPredictions(isWhite, origin);
        break;
      case 'rook':
        this.rookPredictions(isWhite, origin);
        break;
      case 'knight':
        this.knightPredictions(isWhite, origin)
        break;
      case 'bishop':
        this.bishopPredictions(isWhite, origin)
        break;
      case 'king':
        this.kingPrediction(isWhite, origin)
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

      if (isWhite) {
        if (i <= origin.i + pawnMaxIMove && i > origin.i) {
          this.board[i][j].movable = !this.board[i][j].piece
        }
      }

      if (!isWhite) {
        if (i >= origin.i + pawnMaxIMove && i < origin.i) {
          this.board[i][j].movable = !this.board[i][j].piece
        }
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
    const opponent = isWhite ? 'b' : 'w';

    let higherI = this.boardSize;
    let lowerI = 0;

    let higherJ = this.boardSize;
    let lowerJ = 0;

    for (let i = origin.i + 1; i < this.boardSize; i++) {
      if (this.board[i][origin.j].piece) {
        if (this.board[i][origin.j].piece?.color == opponent) {
          higherI = i;
        } else {
          higherI = i - 1
        }

        break;
      }
    }

    for (let i = origin.i - 1; i >= 0; i--) {
      if (this.board[i][origin.j].piece) {
        if (this.board[i][origin.j].piece?.color == opponent) {
          lowerI = i;
        } else {
          lowerI = i + 1
        }

        break;
      }
    }

    for (let j = origin.j + 1; j < this.boardSize; j++) {
      if (this.board[origin.i][j].piece) {
        if (this.board[origin.i][j].piece?.color == opponent) {
          higherJ = j;
        } else {
          higherJ = j - 1;
        }

        break;
      }
    }

    for (let j = origin.j - 1; j >= 0; j--) {
      if (this.board[origin.i][j].piece) {
        if (this.board[origin.i][j].piece?.color == opponent) {
          lowerJ = j;
        } else {
          lowerJ = j + 1;
        }

        break;
      }
    }

    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (i == origin.i && j == origin.j) {
          continue;
        }

        if (j == origin.j && i <= higherI && i >= lowerI) {
          this.board[i][j].movable = true;
        }

        if (i == origin.i && j <= higherJ && j >= lowerJ) {
          this.board[i][j].movable = true;
        }
      }
    }
  }

  knightPredictions(isWhite: boolean, origin: cord) {
    const opponent = isWhite ? 'b' : 'w';

    this.checkFixedMove(origin, 2, 1, opponent);
    this.checkFixedMove(origin, 2, -1, opponent);

    this.checkFixedMove(origin, 1, 2, opponent);
    this.checkFixedMove(origin, 1, -2, opponent);

    this.checkFixedMove(origin, -1, 2, opponent);
    this.checkFixedMove(origin, -1, -2, opponent);

    this.checkFixedMove(origin, -2, 1, opponent);
    this.checkFixedMove(origin, -2, -1, opponent);

  }

  bishopPredictions(isWhite: Boolean, origin: cord) {
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
      const distance = Math.max(i, origin.i) - Math.min(i, origin.i);

      if (i == origin.i) {
        continue;
      }

      if (this.board[i][origin.j - distance] && this.board[i][origin.j - distance].piece) {
        if (i > origin.i && !foundMaxLeft) {
          maxLeft = i;

          if (this.board[i][origin.j - distance].piece?.color != opponent) {
            maxLeft = i - 1;
          }

          foundMaxLeft = true;
        }

        if (i < origin.i && !foundMinLeft) {
          minLeft = i;

          if (this.board[i][origin.j - distance].piece?.color != opponent) {
            minLeft = i + 1;
          }
        }
      }

      if (this.board[i][origin.j + distance] && this.board[i][origin.j + distance].piece) {
        if (i > origin.i && !foundMaxRight) {
          maxRight = i;

          if (this.board[i][origin.j + distance].piece?.color != opponent) {
            maxRight = i - 1;
          }

          foundMaxRight = true;
        }

        if (i < origin.i && !foundMinRight) {
          minRight = i;

          if (this.board[i][origin.j + distance].piece?.color != opponent) {
            minRight = i + 1;
          }
        }
      }
    }

    for (let i = 0; i < this.boardSize; i++) {
      const distance = Math.max(i, origin.i) - Math.min(i, origin.i);

      if (i == origin.i) {
        continue;
      }

      if (this.board[i][origin.j - distance] && i >= minLeft && i <= maxLeft) {
        this.board[i][origin.j - distance].movable = true;
      }

      if (this.board[i][origin.j + distance] && i >= minRight && i <= maxRight) {
        this.board[i][origin.j + distance].movable = true;
      }
    }
  }

  kingPrediction(isWhite: boolean, origin: cord) {
    const opponent = isWhite ? 'b' : 'w';

    this.checkFixedMove(origin, -1, -1, opponent);
    this.checkFixedMove(origin, -1, 0, opponent);
    this.checkFixedMove(origin, -1, 1, opponent);
    this.checkFixedMove(origin, 0, -1, opponent);
    this.checkFixedMove(origin, 0, 1, opponent);
    this.checkFixedMove(origin, 1, -1, opponent);
    this.checkFixedMove(origin, 1, 0, opponent);
    this.checkFixedMove(origin, 1, 1, opponent);
  }

  checkFixedMove(origin: cord, iMove: number, jMove: number, opponent: 'w' | 'b') {
    if (this.board[origin.i - iMove]) {
      if (this.board[origin.i - iMove][origin.j - jMove]) {
        if (this.board[origin.i - iMove][origin.j - jMove].piece?.color == opponent ||
          !this.board[origin.i - iMove][origin.j - jMove].piece) {
          this.board[origin.i - iMove][origin.j - jMove].movable = true;
        }
      }
    }
  }
}
