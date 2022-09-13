export enum Token {
  Cross='X',
  Circle='O',
  None='',
  Draw='-'
}

export enum Turn {
  Player="player",
  Computer="computer"
}

export type BoardId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type TileId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export interface Position {
  board: BoardId
  tile: TileId
}

export interface GameState {
  turn: Turn
  lastMove: Position
  getBoardVictor: (BoardId) => Token
  getUltimateVictor: () => Token
  getToken: (Position) => boolean
  isBoardPlayable: (BoardId) => boolean
  isTilePlayable: (Position) => boolean
  update: (Position) => GameState
}

export interface GameStateContext {
  gameState: GameState
  play: (Position) => void
}
