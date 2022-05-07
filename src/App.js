import { atom, useRecoilState } from 'recoil'
import _ from 'lodash'
import produce from 'immer'
import styled from 'styled-components'
//reversi game

const boardstate = atom({
  key: 'boardstate',
  default: {
    board: [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    turn: 1,
    winner: 0,
    gameover: false,
    player1: {
      name: 'Player 1',
      color: '#ff0000',
    },
    player2: {
      name: 'Player 2',
      color: '#0000ff',
    },
  },
})

// component for reversi game board
// board is a table of buttons
export const Board = () => {
  const [boardState, setBoardState] = useRecoilState(boardstate)
  const { board, turn, winner, gameover } = boardState

  const handleClick = (row, col) => {
    if (gameover) {
      return
    }
    if (board[row][col] !== 0) {
      return
    }

    let newBoard = _.cloneDeep(board)
    const newTurn = turn === 1 ? 2 : 1
    let newWinner = winner
    let newGameover = gameover
    const newPlayer =
      turn === 1 ? _.cloneDeep(boardState.player1) : _.cloneDeep(boardState.player2)
    const newOpponent =
      turn === 1 ? _.cloneDeep(boardState.player2) : _.cloneDeep(boardState.player1)

    const flipped = flip(newBoard, row, col, newPlayer.color)
    if (flipped.length > 0) {
      newPlayer.score += flipped.length
      newOpponent.score -= flipped.length
      newGameover = checkGameover(newBoard, newPlayer.color)
      newWinner = newGameover ? newPlayer.name : newWinner
    }

    setBoardState(
      produce(boardState, draft => {
        draft.board = newBoard
        draft.turn = newTurn
        draft.winner = newWinner
        draft.gameover = newGameover
      }),
    )
  }

  const flip = (board, row, col, color, flipped = []) => {
    // if stone is already of the same color return empty array
    if (board[row][col] === color) {
      return []
    }

    // set current stone to color
    board[row][col] = color
    flipped.push([row, col])

    const directions = [
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1],
      [-1, -1],
      [-1, 0],
      [-1, 1],
    ]

    // recursive funcrion to check all directions
    // search for first stone of same color in given direction
    // if found, flip stones in between
    const flipIfSameColorFound = (row, col, direction) => {
      const [rowDir, colDir] = direction
      const newRow = row + rowDir
      const newCol = col + colDir

      // if stone is out of bounds, return false
      if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) return false

      // if stone color is 0, return false
      if (board[newRow][newCol] === 0) return false

      // if stone is of same color, return true
      if (board[newRow][newCol] === color) return true

      // continue search in given direction, if recursion returns true then flip current stone
      if (flipIfSameColorFound(newRow, newCol, direction)) {
        flip(board, newRow, newCol, color, flipped)
        return true
      }
      return false
    }

    // call flipIfSameColorFound for each direction
    directions.forEach(direction => {
      flipIfSameColorFound(row, col, direction)
    })
    return flipped
  }

  const checkGameover = (board) => {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (board[i][j] === 0) {
          return false
        }
      }
    }
    return true
  }

  const renderGameover = () => {
    if (gameover) {
      return <div>Game Over</div>
    }
  }
  
  const Stone = styled.button`
    background-color: ${props => props.playerColor || 'BlanchedAlmond'};
    border: 1px solid #000;
    width: 50px;
    height: 50px;
    margin: 5px;
    border-radius: 50%;
    font-size: 0px;
    %color: ${props => props.playerColor || '#fff'};
    cursor: ${props => (props.playerColor ? 'not-allowed' : 'default')};
    &:hover {
      border: 3px solid #000;
    }
  `

  const renderBoard = () => {
    const renderedBoard = []
    for (let i = 0; i < 8; i++) {
      const renderedRow = []
      for (let j = 0; j < 8; j++) {
        const stone = board[i][j]
        renderedRow.push(
          <Stone
            key={`b${i}${j}`}
            placeholder={`b${i}${j}`}
            playerColor={stone}
            onClick={() => handleClick(i, j)}>
            {stone}
          </Stone>,
        )
      }
      renderedBoard.push(<div key={i}>{renderedRow}</div>)
    }
    return renderedBoard
  }

  // BoardBackground is a div with a background color
  // it should shrink and grow with the size of its content
  const BoardBackground = styled.div`
    background-color: BlanchedAlmond;
    display: inline-block;
    border: 1px solid #000;
    border-radius: 20px;
    margin: 10px;
    padding: 10px;
  `

  return (
    <div>
      {renderGameover()}
      <BoardBackground>{renderBoard()}</BoardBackground>
    </div>
  )
}

const App = () => {
  return (
    <div>
      <Board />
    </div>
  )
}

export default App
