import styled, { css } from "styled-components"
import { Tile } from './Tile'
import { Turn, Token, TileId } from '../game/types'
import { useGameStateContext, LINES } from '../game/game'

const StyledBoard = styled.div<{
  winning: boolean,
  victor: Token,
  blind: boolean
}>`
display: inline-grid;
grid-template-columns: repeat(3, minmax(0, 1fr));
grid-template-rows: repeat(3, minmax(0, 1fr));
grid-gap: 0.3em;
padding: 0.1em;
border: 2px solid black;
background-color: ${({ winning, victor, opacity }) =>
    winning ? 'rgba(21, 255, 33, 0.5)' :
      victor == Token.None ? 'rgba(255, 255, 255, 0.0)' :
        victor == Token.Draw ? 'black' :
          victor == Token.Circle ? 'blue' : 'red'};
min-width: 0;
min-height: 0;
opacity: ${({ blind }) => blind ? '0.3' : '1'};
`

export const Board = ({ index, ...props }) => {
  const { gameState, play } = useGameStateContext()

  const winning =
    gameState.getUltimateVictor() != Token.Draw
    && gameState.getUltimateVictor() != Token.None
    && LINES
      .filter(line => line.includes(index))
      .some(line =>
        line.every(board =>
          gameState.getBoardVictor(board) == gameState.getUltimateVictor()
        )
      )

  const won = gameState.getUltimateVictor() != Token.Draw
    && gameState.getUltimateVictor() != Token.None
  const blind = won && !winning;

  return (
    <StyledBoard
      winning={winning}
      victor={gameState.getBoardVictor(index)}
      blind={blind}
      {...props}>
      {[...Array(9)].map((i, tile) => (
        <Tile
          key={tile}
          board={index}
          tile={tile as TileId}>
        </Tile>
      ))}
    </StyledBoard>
  )
}
