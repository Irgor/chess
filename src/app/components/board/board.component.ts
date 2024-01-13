import { Component, OnInit } from '@angular/core';
import { max } from 'rxjs';
import { Base } from 'src/app/models/base.model';
import { Game } from 'src/app/models/game.model';
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
export class BoardComponent {
  game: Game;

  isTarget = false;
  idToMove = 0;
  lastPiece: Piece | null = null;
  rounds = 0;
  lastTileWasWhite = true;

  turn: 'w' | 'b' = 'w';

  constructor() {
    this.game = new Game();
  }

  move(piece: Piece | undefined | null, i: number, j: number, id: number, movable: boolean) {
    if (this.isTarget && this.lastPiece && movable) {
      const cord: cord = { i, j };
      this.game.doMove(this.lastPiece, cord);
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
    this.game.clearMovables();
    this.game.predictOptions(piece);
  }

  doMove(lastPiece: Piece, origin: cord) {
    const newPiece = new Piece(
      origin.i, origin.j, lastPiece.name, lastPiece.sprite, lastPiece.color
    )

    this.game.board[origin.i][origin.j].piece = newPiece;
    this.game.board[lastPiece.i][lastPiece.j].piece = null;
  }

  endTurn() {
    this.game.clearMovables();
    this.game.removeChecks();
    this.lastPiece = null;
    this.isTarget = false;
    this.turn = this.turn == 'w' ? 'b' : 'w';
    this.rounds++;
    this.idToMove = 0;
    this.game.isCheck();
  }

}