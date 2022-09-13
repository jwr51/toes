import {
  createContext,
  useContext,
  useState,
  useEffect
} from "react"
import {
  Token,
  Turn,
  BoardId,
  Position,
  GameState,
  GameStateContext
} from "./types"
import {
  getBestMove
} from "./alphabeta"

type Board = [
  Token, Token, Token,
  Token, Token, Token,
  Token, Token, Token
]

type Boards = [
  Board, Board, Board,
  Board, Board, Board,
  Board, Board, Board
]

const EmptyBoard: Board = [
  Token.None, Token.None, Token.None,
  Token.None, Token.None, Token.None,
  Token.None, Token.None, Token.None
]

class InternalGameState implements GameState {
  boards: Boards = [
    EmptyBoard, EmptyBoard, EmptyBoard,
    EmptyBoard, EmptyBoard, EmptyBoard,
    EmptyBoard, EmptyBoard, EmptyBoard
  ]
  ultimateBoard: Board = EmptyBoard
  turn: Turn = Turn.Player
  lastMove: Position = undefined
  ultimateVictor: Token = Token.None

  getBoardVictor = (id: BoardId) => this.ultimateBoard[id]

  getUltimateVictor = () => this.ultimateVictor

  getToken = (pos: Position) => this.boards[pos.board][pos.tile]

  isBoardPlayable = (board: BoardId) => {
    // can't play if the game's over
    if (this.ultimateVictor !== Token.None) return false
    // can play anywhere for opening move
    if (this.lastMove === undefined) return true
    // can't play on already won boards
    if (this.getBoardVictor(board) != Token.None) return false
    // can play anywhere else if we are sent to a won board
    if (this.getBoardVictor(this.lastMove.tile as BoardId) != Token.None) return true
    // can play on the board we are sent to
    if (board === this.lastMove.tile) return true
    // anything else?
    return false
  }

  isTilePlayable = (pos: Position) => {
    return this.isBoardPlayable(pos.board) && this.getToken(pos) == Token.None
  }

  // play the position as the cyrrent player
  update = (pos: Position) => {
    const newState = makeGameState()
    newState.boards = JSON.parse(JSON.stringify(this.boards))
    newState.ultimateBoard = JSON.parse(JSON.stringify(this.ultimateBoard))
    newState.turn = this.turn == Turn.Player ? Turn.Computer : Turn.Player
    newState.lastMove = pos
    newState.boards[pos.board][pos.tile] =
      this.turn == Turn.Player ? Token.Circle : Token.Cross

    newState.ultimateBoard[pos.board] = checkBoardWinner(newState.boards[pos.board])
    newState.ultimateVictor = checkBoardWinner(newState.ultimateBoard)
    return newState
  }
}

export type Line = [TileId, TileId, TileId]
// indices of lines of 3 which win a board
export const LINES: Line[] = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // left-down diagonal
  [2, 4, 6] // right-down diagonal
]

const checkBoardWinner = (board: Board) => {
  // lines with all the same token
  const found = LINES
    .map(line => line.map(i => board[i]))
    .filter(line => line[0] == line[1] && line[1] == line[2])
    .filter(line => line[0] !== Token.None)
  if (found.length == 0) {
    // if no playable tiles remaining, it's a draw
    if (board.filter(t => t == Token.None).length == 0) return Token.Draw
    else return Token.None
  }
  return found[0][0]
}

const getNextMove = (state: GameState): Position => {
  return getBestMove(state)
}

const makeGameState = () => new InternalGameState()

const InternalContext = createContext<GameStateContext>(null)
export const useGameStateContext = () => useContext(InternalContext)

export const GameStateContextProvider = ({ children }) => {
  const [gameState, setGameState] = useState<InternalGameState>(makeGameState())

  const play = (pos: Position) => {
    if (!gameState.isTilePlayable(pos)) return

    const newGameState = gameState.update(pos)
    setGameState(newGameState)
  }

  useEffect(() => {
    const playNextMoveAsync = async (state: GameState) => {
      const nextMove = await getNextMove(state)
      play(nextMove)
    }

    if (gameState.turn == Turn.Computer
      && gameState.ultimateVictor == Token.None) {
      playNextMoveAsync(gameState).catch(console.error)
    }
  }, [gameState])

  return (
    <InternalContext.Provider value={{ gameState, play }}>
      {children}
    </InternalContext.Provider>
  )
}
