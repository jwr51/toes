import styled from "styled-components"
import { Board } from './Board'
import { BoardId } from '../game/types.ts'

const StyledBoard = styled.div`
  display: inline-grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-rows: repeat(3, minmax(0, 11fr));
  grid-gap: 0.6em;
  width: 100%;
  height: 100%;
  min-height: 0;
  min-width: 0;
`;

const StyledContainer = styled.div`
  background-colour: rgba(255, 255, 255, 0.7);
  height: 100vmin;
  width: 100vmin;
  border-radius: 0.5em;
`;

export const UltimateBoard = ({ ...props }) => {
  return (
    <StyledContainer {...props}>
      <StyledBoard {...props}>
        {[...Array(9)].map((i, board) => (
          <Board key={board} index={board as BoardId}></Board>
        ))}
      </StyledBoard>
    </StyledContainer>
  );
};
