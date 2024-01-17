import { Base, cord } from "./base.model";
import { Piece } from "./piece.model";
import { Rook, Knight, Pawn, Bishop, Queen, King } from './pieces/index'

export class Game {
    movesHistory: string[] = []
    board: Base[][] = [];
    boardSize = 8;

    winner: string = '';
    colorInCheck: 'w' | 'b' | '' = '';

    lastPiece: Piece | null = null;

    pieceOrder: typeof Piece[] = [
        Rook,
        Knight,
        Bishop,
        King,
        Queen,
        Bishop,
        Knight,
        Rook,
        Pawn
    ]

    pieceNames = [
        'rook',
        'knight',
        'bishop',
        'king',
        'queen',
        'bishop',
        'knight',
        'rook',
        'pawn'
    ]

    pieceAbbreviation = [
        'r',
        'n',
        'b',
        'k',
        'q',
        'b',
        'k',
        'r',
        ''
    ]

    horizontalMap = [
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
    ];

    lastTileWasWhite = true;

    constructor() {
        this.startBoard();
    }

    setBoard(newBoard: Base[][]) {
        this.board = newBoard;
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

    promoteTo(piece: Piece, promote: string) {
        const index = this.pieceNames.indexOf(promote);

        const newPiece = new this.pieceOrder[index](
            piece.i, piece.j, this.pieceNames[index], `../../../assets/images/${piece.color}_${this.pieceNames[index]}.png`, piece.color
        )

        this.board[piece.i][piece.j].piece = newPiece;
        this.isCheck();
    }

    hasPromotions() {
        for (let j = 0; j < this.boardSize; j++) {
            const topPiece = this.board[0][j].piece;
            const bottomPiece = this.board[this.boardSize - 1][j].piece;

            this.checkPromotion(topPiece);
            this.checkPromotion(bottomPiece);
        }
    }

    checkPromotion(piece: Piece | null | undefined) {
        if (!piece) {
            return;
        }

        if (piece) {
            const isPawn = piece.name == 'pawn';
            piece.canPromote = isPawn
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

    doMove(lastPiece: Piece, target: cord, registry = false) {
        const piece = this.board[target.i][target.j].piece

        if (piece && piece.name == 'rook' && lastPiece.name == 'king' && piece.color == lastPiece.color) {
            this.doCastle(lastPiece, piece);
            return;
        }

        const index = this.pieceNames.indexOf(lastPiece.name);
        const newPiece = new this.pieceOrder[index](
            target.i, target.j, lastPiece.name, lastPiece.sprite, lastPiece.color
        )
        newPiece.hasMoved = true;

        const wasCapture = !!this.board[target.i][target.j].piece;

        this.board[target.i][target.j].piece = newPiece;
        this.board[lastPiece.i][lastPiece.j].piece = null;

        if (registry) {
            this.regirtyMove(target.i, target.j, newPiece, wasCapture)
        }
    }

    regirtyMove(i: number, j: number, piece: Piece, wasCapture: boolean) {
        const index = this.pieceNames.indexOf(piece.name);
        const mov = this.pieceAbbreviation[index] + (wasCapture ? 'x' : '') + this.horizontalMap[j] + (i + 1);

        console.log(mov);
        this.movesHistory.push(mov);
    }

    doCastle(king: Piece, rook: Piece) {
        const kingMove = rook.j < king.j ? -2 : 3;
        const newKing = new King(
            king.i, king.j + kingMove, 'king', king.sprite, king.color
        )
        king.hasMoved = true;
        this.board[newKing.i][newKing.j].piece = newKing;
        this.board[king.i][king.j].piece = null;

        const rookMove = rook.j < king.j ? 1 : -1;
        const newRook = new Rook(
            newKing.i, newKing.j + rookMove, 'rook', rook.sprite, rook.color
        );

        this.board[newRook.i][newRook.j].piece = newRook;
        this.board[rook.i][rook.j].piece = null;

        console.log('O-O-O');
        this.movesHistory.push('O-O-O');
    }

    isCheck(checkingForMate = true) {
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                const piece = this.board[i][j].piece;
                if (piece) {
                    this.predictOptions(piece);
                    this.isKingsOnCheck(piece?.color);
                }
                this.clearMovables();
            }
        }

        if (this.hasCheck(this.colorInCheck) && checkingForMate) {
            this.isMate(this.colorInCheck);
        }
    }

    isKingsOnCheck(colorAttack: 'w' | 'b') {
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                const piece = this.board[i][j].piece;

                const name = piece?.name == 'king';
                const color = piece?.color != colorAttack;
                const movable = this.board[i][j].movable

                if (name && color && movable) {
                    this.board[i][j].piece!.inCheck = true;
                    this.colorInCheck = piece.color
                }
            }
        }
    }

    hasCheck(colorToCheck: 'w' | 'b' | ''): boolean {
        if (!colorToCheck) {
            return false;
        }

        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                const piece = this.board[i][j].piece;

                const name = piece?.name == 'king';
                const color = piece?.color == colorToCheck;

                if (name && color && piece.inCheck) {
                    return true;
                }
            }
        }

        return false;
    }

    hasMovables() {
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (this.board[i][j].movable) {
                    return true;
                }
            }
        }

        return false;
    }

    isMate(colorInCheck: 'w' | 'b' | '') {
        if (!colorInCheck) {
            return;
        }

        let lose = false;
        let saved = false;

        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                const pieceToSave = this.board[i][j].piece;
                if (pieceToSave && pieceToSave.color == colorInCheck) {

                    const simulationGame = new Game();
                    this.cloneBoard(simulationGame);
                    simulationGame.predictOptions(pieceToSave);
                    const hasMovables = simulationGame.hasMovables();

                    if (!hasMovables) {
                        continue
                    }

                    for (let i = 0; i < this.boardSize; i++) {
                        for (let j = 0; j < this.boardSize; j++) {

                            if (simulationGame.board[i][j].movable) {
                                const savingSimulation = new Game();
                                simulationGame.cloneBoard(savingSimulation);

                                savingSimulation.doMove(pieceToSave, { i, j });

                                savingSimulation.isCheck(false);
                                lose = savingSimulation.hasCheck(pieceToSave.color);

                                if (!lose) {
                                    saved = true;
                                }
                            }

                        }
                    }

                }
            }
        }

        if (lose && !saved) {
            this.winner = colorInCheck == 'w' ? 'b' : 'w';
        }
    }

    cloneBoard(simulationGame: Game) {
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                const piece = this.board[i][j].piece;
                if (piece) {
                    const index = this.pieceNames.indexOf(piece.name);

                    simulationGame.board[i][j] = new Base(
                        i, j,
                        this.board[i][j].spriteBase,
                        this.board[i][j].id,
                        new this.pieceOrder[index](
                            i, j,
                            piece.name,
                            piece.sprite,
                            piece.color,
                        )
                    )

                }
            }
        }
    }

    mapPieces() {
        const pieces: any = {};

        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                const piece = this.board[i][j].piece;

                if (piece) {

                    const index = this.pieceNames.indexOf(piece.name);
                    const pos = this.horizontalMap[j] + (i + 1);
                    const abrv = this.pieceAbbreviation[index] == '' ? 'p' : this.pieceAbbreviation[index];


                    if (piece.color == 'w') {
                        pieces[pos.toUpperCase()] = abrv.toUpperCase();
                    } else {
                        pieces[pos.toUpperCase()] = abrv;
                    }
                }
            }
        }

        return pieces;
    }

    doAIMove(from: string, target: string) {
        const horizontal = this.horizontalMap;

        const iFrom = (+from.split('')[1]) - 1;
        const jFrom = horizontal.indexOf(from.split('')[0].toLocaleLowerCase());
        const piece = this.board[iFrom][jFrom].piece;

        const iTarget = (+target.split('')[1]) - 1;
        const jTarget = horizontal.indexOf(target.split('')[0].toLocaleLowerCase());

        if (piece) {
            const index = this.pieceNames.indexOf(piece.name);
            const newPiece = new this.pieceOrder[index](
                iTarget, jTarget, piece.name, piece.sprite, piece.color
            );
            newPiece.hasMoved = true;

            this.board[iTarget][jTarget].piece = newPiece;
            this.board[iFrom][jFrom].piece = null;
        }
    }
}