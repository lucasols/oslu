import { useState } from 'react'
import {
  logErrorOnScreen,
  logInfoOnScreen,
  watchValue,
} from '../../lib/src/main'
import { watchCount } from '../../lib/src/persistentLogger'
import { logWarnOnScreen } from '../../lib/src/tempLogger'
import './App.css'

const Comp = () => {
  return <div>test</div>
}

logErrorOnScreen('Error on app start')

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
  watchValue('undefined', undefined)
  watchValue('null', null)
  watchValue('empty string', '')
  watchValue('obj', {
    a: 1,
    b: 2,
    c: 3.2,
    d: [1, 2, 3, 'test, d', 'test', true, false, null],
    nested: {
      a: 1,
      b: 2,
      c: 'multiline\ntext\ntest:',
      undefined: undefined,
      string: 'string',
      true: true,
      false: false,
      false_2: false,
      emptyArray: [],
      false_4: false,
      emptyObj: {},
      html: '<div>html</div>',
      largeArray: Array(10).fill('sdkfsdfsdf'),
    },
  })
  watchValue('with custom font size', 'test', {
    fontSize: 20,
  })
  watchValue('with auto close', 'test', {
    autoCloseInMs: 2_000,
  })

  watchValue('bug', null)

  watchValue('bug', { a: 'should not be faded out' })

  watchValue('yaml demo', {
    'key:with:colon': 1,
    '"quoted:key"': 2,
    'xss <img src=x onerror=alert(1)>': 'escaped',
    'htmlLikeKey <div>': 'ok',
    inlineArray: [1, -2, 3, ['a', 'b'], { a: 1, b: 2 }],
    scientific: -1e-3,
    hexNumber: 0x1f,
    binNumber: 0b1010,
    octNumber: 0o777,
    inf: Infinity,
    negInf: -Infinity,
    nan: Number.NaN,
    multiline: 'line 1\nline 2\nline 3',
    undef: undefined,
  })

  watchValue(
    'yaml demo (hide undefined)',
    {
      inlineArray: [1, -2, 3, ['a', 'b'], { a: 1, b: 2 }],
      scientific: -1e-3,
      hexNumber: 0x1f,
      binNumber: 0b1010,
      octNumber: 0o777,
      inf: Infinity,
      negInf: -Infinity,
      nan: Number.NaN,
      multiline: 'line 1\nline 2\nline 3',
      undef: undefined,
    },
    { objFormat: { yamlHideUndefined: true } },
  )

  watchValue(
    'very long title sdflks djflksdjflk sdlkfjlksdj lkfjsdlkjfl ksjdlkfjsdlfjlksdjf sdlfkjdsjfl',
    { a: 'title should not overflow' },
  )

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
            console.error(
              'Subst error: str=%s int=%d float=%f json=%o percent=%%',
              'abc',
              42.9,
              3.14159,
              { a: 1, b: [2, 3] },
            )
          }}
        >
          console.error with substitutions
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
            logWarnOnScreen('Warning')
          }}
        >
          log warn
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
            logErrorOnScreen(lorenIpsum + Math.random())
          }}
        >
          random log long error
        </button>

        <button
          onClick={() => {
            logErrorOnScreen({
              a: 1,
              b: 2,
            })
          }}
        >
          obj
        </button>

        <button
          onClick={() => {
            logErrorOnScreen([['a', 'b', 1, 2]])
          }}
        >
          array
        </button>

        <button
          onClick={() => {
            setCount(count + 1)
          }}
        >
          Increment count
        </button>

        <button
          onClick={() => {
            watchCount('ok')
          }}
        >
          watch count
        </button>

        <button
          onClick={() => {
            watchValue('ok')
          }}
        >
          watch value default
        </button>

        <button
          onClick={() => {
            watchValue('with auto close', 'test', {
              fontSize: 20,
              autoCloseInMs: 2_000,
            })
          }}
        >
          watch value with auto close
        </button>

        <button
          onClick={() => {
            logErrorOnScreen({
              path: 'v3/conversations/3:mark-as-read',
              payload: {
                meta_id: 'gvqpibaQTRgXrMllEWvY3',
              },
              response: {
                status: true,
                data: {
                  id_jestor_chat_users: 3,
                  id_chat: 2,
                  id_user: 1,
                  muted: false,
                  joined: true,
                  starred: true,
                  created_at: '2022-11-11T15:18:15+00:00',
                  last_message_at: '2023-02-08T02:46:06+00:00',
                  last_message_seen: 0,
                  order: null,
                  config: null,
                  chat: {
                    id_jestor_chats: 2,
                    chat_slug: 'tab_3#31',
                    chat_type: 'record',
                    _record: {
                      name: 'sdfasdasd fdsfsdxcv',
                      jestor_object_label: '75.91',
                      jestor_object_label_field:
                        '{"label":"Currency lookup table 2","type":"vlookup","key":"tesfd","item":"field","required":false,"field":"tesfd","auto_fill":"{{sdfsdf.num}}","config":{"connectedField":"sdfsdf","isAliasByField":true,"object":"sdfsdf","field":"num","type":"number","textFormat":null},"format":null}',
                      sdfsdf: {
                        id_sdfsdf: 116,
                        jestor_object_label: 'sdf',
                        jestor_object_label_field:
                          '{"label":"short text","type":"string","key":"short_text","item":"field","required":false,"field":"short_text","auto_fill":false}',
                      },
                    },
                    record: {
                      name: 'sdfasdasd fdsfsdxcv',
                      jestor_object_label: '75.91',
                      jestor_object_label_field:
                        '{"label":"Currency lookup table 2","type":"vlookup","key":"tesfd","item":"field","required":false,"field":"tesfd","auto_fill":"{{sdfsdf.num}}","config":{"connectedField":"sdfsdf","isAliasByField":true,"object":"sdfsdf","field":"num","type":"number","textFormat":null},"format":null}',
                      sdfsdf: {
                        id_sdfsdf: 116,
                        jestor_object_label: 'sdf',
                        jestor_object_label_field:
                          '{"label":"short text","type":"string","key":"short_text","item":"field","required":false,"field":"short_text","auto_fill":false}',
                      },
                    },
                  },
                  unread_count: 0,
                  mention_count: 0,
                },
                metadata: {
                  response: 'ok',
                  message: 'OK',
                  notifications: [],
                },
              },
            })
          }}
        >
          very large obj
        </button>

        <button
          onClick={() => {
            logErrorOnScreen(lorenIpsum.repeat(100))
          }}
        >
          Very very long error
        </button>
      </div>
    </div>
  )
}

export default App
