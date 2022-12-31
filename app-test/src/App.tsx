import { useState } from 'react'
import { watchValue } from '../../lib/src/main'
import { logErrorOnScreen, logInfoOnScreen } from '../../lib/src/main'
import './App.css'

const lorenIpsum =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

function App() {
  const [count, setCount] = useState(0)

  watchValue('count', count, {
    lastNDiffValues: 5,
  })
  watchValue('fraction', count / 123)
  watchValue('fixed lenght fraction', count / 4, {
    minFractionDigits: 5,
  })
  watchValue('long number', count * 12345)
  watchValue('text', 'text')
  watchValue('long text', lorenIpsum)
  watchValue('obj', { a: 1, b: 2, c: 3 })

  return (
    <div
      className="App"
      onMouseMove={(e) => {
        watchValue('mouse x', e.clientX, {
          lastNDiffValues: 5,
        })
        watchValue('mouse y', e.clientY, {
          lastNDiffValues: 5,
        })
      }}
    >
      <h1>S Logget test</h1>
      <div className="card">
        <button
          onClick={() => {
            throw new Error('Unhandled error')
          }}
        >
          Throw unhandled error
        </button>

        <button
          onClick={() => {
            throw new Error('Ignore')
          }}
        >
          Ignore error
        </button>
        <button
          onClick={() => {
            logErrorOnScreen('Custom error', {
              timeout: false,
            })
          }}
        >
          log custom error
        </button>
        <button
          onClick={() => {
            logInfoOnScreen('information', 'Info')
          }}
        >
          log info
        </button>
        <button
          onClick={() => {
            logInfoOnScreen('👍', 'Info')
          }}
        >
          log info with custom icon
        </button>
        <button
          onClick={() => {
            logErrorOnScreen(lorenIpsum)
          }}
        >
          log long error
        </button>
        <button
          onClick={() => {
            setCount(count + 1)
          }}
        >
          Increment count
        </button>
      </div>
    </div>
  )
}

export default App
