import { GameState, Position, BoardId, TileId, Turn, Token } from "./types"
import { Line, LINES } from "./game"

const getPossibleMoves = (state: GameState): Position[] => {
  let moves = []
  for (let board = 0; board < 9; board++) {
    for (let tile = 0; tile < 9; tile++) {
      const move = { board, tile }
      if (state.isTilePlayable(move)) moves.push(move)
    }
  }
  return moves
}


// TODO: find a better heuristic
const evaluate = (state: GameState): number => {
  if (state.getUltimateVictor() == Token.Circle) return -Infinity
  if (state.getUltimateVictor() == Token.Cross) return +Infinity
  if (state.getUltimateVictor() == Token.Draw) return 0

  let sum = 0

  LINES.forEach(line => {
    const winners = line.map(x => state.getBoardVictor(x))
    if (!winners.includes(Token.Draw)) {
      if (winners.filter(x => x == Token.Circle).length > 1
        && !winners.includes(Token.Cross)) {
          sum -= 5
      }
      if (winners.filter(x => x == Token.Cross).length > 1
        && !winners.includes(Token.Circle)) {
          sum += 5
        }
    }
  })

  for (let board = 0; board < 9; board++) {
    LINES.forEach(line => {
      const tokens = line.map(tile => state.getToken({ board, tile }))
      if (tokens.filter(x => x == Token.Circle).length > 1
        && !tokens.includes(Token.Cross)) {
          sum -= 1
        }
      if (tokens.filter(x => x == Token.Cross).length > 1
        && !tokens.includes(Token.Circle)) {
          sum += 1
        }
    })
  }

  for (let board = 0; board < 9; board++) {
    if (state.getBoardVictor(board) == Token.Circle) sum -= 3
    if (state.getBoardVictor(board) == Token.Cross) sum += 3
  }

  return sum
}

const alphabeta = (
  state: GameState,
  depth: number,
  alpha: number,
  beta: number
): number => {
  if (state.getUltimateVictor() != Token.None || depth == 0) {
    return evaluate(state)
  }

  const moves = getPossibleMoves(state)
  const neighbours = moves.map(move => state.update(move))

  // player played last move
  if (state.turn == Turn.Computer) {
    neighbours.every(neighbour => {
      alpha = Math.max(alpha, alphabeta(neighbour, depth - 1, alpha, beta))
      return alpha < beta
    })
    return alpha
  } else {
    neighbours.every(neighbour => {
      beta = Math.min(beta, alphabeta(neighbour, depth - 1, alpha, beta))
      return beta > alpha
    })
    return beta
  }
}

export const getBestMove = (state: GameState): Position => {
  const depth = 5
  const moves = getPossibleMoves(state)

  // we don't want to wait forever...
  if (moves > 40) depth -= 1

  let bestMove = null
  let bestScore = -Infinity

  let remaining = moves.length
  moves.forEach(move => {
    const score = alphabeta(state.update(move), depth, -Infinity, +Infinity)
    if (score > bestScore) {
      bestMove = move
      bestScore = score
    }
    remaining -= 1
  })

  return bestMove
}
