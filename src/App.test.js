import { render, screen } from '@testing-library/react'
import App, { Board } from './App'

import { RecoilRoot } from 'recoil'

it('renders without crashing', () => {
  render(
    <RecoilRoot>
      <App />
    </RecoilRoot>,
  )
})

it('can be flipped', async () => {
  render(
    <RecoilRoot>
      <Board />
    </RecoilRoot>,
  )
  // press the first button
  screen.getByPlaceholderText('b00').click()
  // wait for render to finish
  await screen.findAllByText(/#ff0000/)
  expect(screen.getByPlaceholderText('b00').textContent).toBe('#ff0000')

  // press the second button
  screen.getByPlaceholderText('b01').click()
  await screen.findAllByText(/#ff0000/)
  expect(screen.getByPlaceholderText('b00').textContent).toBe('#ff0000')
  expect(screen.getByPlaceholderText('b01').textContent).toBe('#0000ff')

  // press the third button
  screen.getByPlaceholderText('b02').click()
  await screen.findAllByText(/#ff0000/)
  expect(screen.getByPlaceholderText('b00').textContent).toBe('#ff0000')
  expect(screen.getByPlaceholderText('b01').textContent).toBe('#ff0000')
  expect(screen.getByPlaceholderText('b02').textContent).toBe('#ff0000')
})

it('can be played until the end', async () => {
  render(
    <RecoilRoot>
      {' '}
      <Board />
    </RecoilRoot>,
  )
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const button = screen.getByPlaceholderText(`b${i}${j}`)
      button.click()
      await screen.findAllByText(/#ff0000/)
    }
  }

  const gameover = await screen.findAllByText(/Game Over/)
  expect(gameover.length).toBe(1)
  // handle gameover button press
  {
    const button = screen.getByPlaceholderText('b00')
    button.click()
  }
})

it('can handle multiple clicks on same button', async () => {
  render(
    <RecoilRoot>
      {' '}
      <Board />
    </RecoilRoot>,
  )
  {
    screen.getByPlaceholderText('b00').click()
    await screen.findAllByText(/#ff0000/)
    screen.getByPlaceholderText('b00').click()
  }
})
