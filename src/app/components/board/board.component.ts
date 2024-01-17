import { Component } from '@angular/core';
import { cord } from 'src/app/models/base.model';
import { Game } from 'src/app/models/game.model';
import { Piece } from 'src/app/models/piece.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  game: Game;

  fullMove = 1;
  stoped = false;

  idToMove = 0;
  lastPiece: Piece | null = null;

  turn: 'w' | 'b' = 'w';

  constructor(private api: ApiService) {
    this.game = new Game();
  }

  move(piece: Piece | undefined | null, i: number, j: number, id: number, movable: boolean) {
    if (this.stoped) {
      return;
    }

    if (this.lastPiece && movable) {
      const target: cord = { i, j };
      this.game.doMove(this.lastPiece, target, true);
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
    this.game.clearMovables();
    this.game.predictOptions(piece);
  }

  async endTurn() {
    this.game.clearMovables();
    this.game.removeChecks();
    this.game.hasPromotions();
    this.lastPiece = null;
    this.turn = this.turn == 'w' ? 'b' : 'w';
    this.idToMove = 0;
    this.game.isCheck();

    await this.delay(200);

    if (this.game.winner != '') {
      alert(`As ${this.game.winner == 'w' ? 'Brancas' : 'Pretas'} ganharam!!!`);
      this.stoped = true;
    }

    if (this.turn == 'b') {
      await this.delay(400);
      this.botTurn();
    }
  }

  botTurn() {
    this.stoped = true;

    const mapPieces = this.game.mapPieces();

    const request = {
      turn: 'black',
      pieces: mapPieces,
      isFinished: false,
      checkMate: false,
      fullMove: this.fullMove
    }

    this.api.getMove(request).subscribe(res => {
      const origin = Object.keys(res)[0];
      this.game.doAIMove(origin, res[origin]);
      this.endTurn();
      this.stoped = false;
      this.fullMove++;
    })
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}