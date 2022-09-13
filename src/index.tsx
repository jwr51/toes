import React from 'react'
import ReactDOM from 'react-dom'
import { UltimateBoard } from './components/UltimateBoard'
import { GameStateContextProvider } from './game/game.tsx'
import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <GameStateContextProvider>
      <UltimateBoard />
    </GameStateContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
