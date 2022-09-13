import styled, { css } from "styled-components"
import { useGameStateContext } from "../game/game"
import { Turn, Token } from "../game/types"
import "./tile.css"

const StyledTile = styled.button<{
  last: boolean
}>`
  flex: 1;
  justify-content: center;
  align-items: center;
  border: 2px solid ${({ last }) => last ? 'purple' : 'black'};
  font-size: 3vw;
  text-align: center;
  min-width: 0;
  min-height: 0;
  list-style-type: none;
  margin: 0;
  display: inline-block;
`;

export const Tile = ({ board, tile, ...props }) => {
  const { gameState, play } = useGameStateContext()

  const victor = gameState.getBoardVictor(board)
  const token = gameState.getToken({ board, tile })
  const playable = gameState.isTilePlayable({ board, tile })

  const classes = []
  if (token != Token.None) classes.push('tile-' + token.toLowerCase())
  if (victor != Token.None && victor != Token.Draw)
    classes.push('victor-' + victor.toLowerCase())
  if (playable) classes.push('playable-' + gameState.turn.toLowerCase())
  else if (token == Token.None) classes.push('unplayable')

  const last = gameState.lastMove
  const isLastMove = last !== undefined
    && last.board == board && last.tile == tile

  return (
    <StyledTile
      className={classes.join(' ')}
      last={isLastMove}
      onClick={() => {
        if (gameState.turn == Turn.Player) play({ board, tile })
      }}
      {...props}>
      {token}
    </StyledTile>
  );
}
