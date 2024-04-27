import { yamlStringify } from '@lucasols/utils/yamlStringify'
import { css } from 'goober'
import { globalStyle } from './globalStyle'
import { createElement, createElementWithState } from './utils/createElement'
import { inline } from './utils/inline'
import { stack } from './utils/stack'
import { transition } from './utils/transition'

let container: HTMLDivElement | null = null
let enabled = false
let _logTraces = false

export function initializePersistentLogs({
  logTraces = false,
}: {
  logTraces?: boolean
} = {}) {
  enabled = true
  _logTraces = logTraces
}

function addKeyboardsShortcuts(e: KeyboardEvent) {
  if (e.key === 'g') {
    container?.classList.toggle('ghost')
  }

  if (!enabled && e.key === 'e') {
    enabled = true
    alert('Persistent logs enabled, press "e" to disable')
  }

  if (e.key === 'Escape') {
    removeContainer()
  }
}

function createContainer() {
  if (container) return

  const containerStyle = css`
    --margin: 10px;

    position: fixed;
    background: #111827;
    color: #fff;
    font-family: 'Fira Code', monospace;
    font-size: 14px;
    border-radius: 4px;
    ${stack()};
    ${transition()};
    max-width: 500px;
    max-height: calc(100% - var(--margin));

    &.ghost {
      pointer-events: none;
      opacity: 0.8;
    }

    &.top-right {
      top: var(--margin);
      right: var(--margin);
    }

    &.bottom-right {
      bottom: var(--margin);
      right: var(--margin);
    }

    &.bottom-left {
      bottom: var(--margin);
      left: var(--margin);
    }

    &.top-left {
      top: var(--margin);
      left: var(--margin);
    }

    > .content {
      ${stack({ gap: 6 })};
      padding: 4px;
      overflow-y: auto;
      flex-shrink: 1;

      .var {
        background: rgba(255, 255, 255, 0.04);
        ${stack({ gap: 4 })};
        padding: 2px 6px;
        text-align: right;

        &.alignLeft {
          text-align: left;

          .title > button {
            order: 1;
          }
        }

        .title {
          ${inline({ gap: 6, justify: 'spaceBetween' })};
          font-size: 11px;
          position: relative;
          z-index: 1;

          > .var-name {
            opacity: 0.7;
          }

          > button {
            ${transition()};
            opacity: 0;
            padding: 10px;
            margin: -10px;
            z-index: 1;
            line-height: 11px;
            font-size: 14px;
          }
        }

        &:hover .title > button {
          opacity: 0.5;
        }

        > .value {
          font-size: 13px;
          white-space: pre-wrap;
          font-weight: 400;

          &.long {
            font-size: 12px;
          }

          &.null-or-undefined {
            opacity: 0.4;
          }

          .sub-value {
            position: relative;
            padding-left: 4px;

            &:first-child::before {
              content: 'L';
              position: absolute;
              left: 0;
              font-size: 10px;
              opacity: 0.5;
            }
          }

          &.yaml {
            > .indent {
              position: relative;

              &::before {
                content: '';
                position: absolute;
                left: 0;
                top: -3px;
                bottom: 0;
                width: 1px;
                background: rgba(255, 255, 255, 0.1);
              }
            }
          }

          > .key {
            font-weight: 500;
            color: #a5d6ff;

            &.array {
              color: #79c0ff;
            }
          }

          > .value {
            color: #fff;
          }

          .empty-value {
            opacity: 0.5;
          }

          .string {
            white-space: pre-wrap;
            color: #fef9c3;
          }

          .true {
            color: #7ee787;
          }

          .false {
            color: #f9b97f;
          }

          .number {
            color: #79c0ff;
          }

          .syntax {
            opacity: 0.4;
            color: #a5d6ff;
          }
        }
      }
    }

    > .footer {
      margin-top: 4px;
      padding-bottom: 4px;
      padding-inline: 4px;
      ${inline({ justify: 'spaceBetween', gap: 4 })};

      > .close {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 2px;
        padding: 2px 6px;
        font-size: 10px;
      }

      > .move {
        font-size: 12px;
        padding: 0px 6px;
        opacity: 0.5;

        &:hover {
          opacity: 1;
        }
      }
    }
  `
  const positions = [
    'top-right',
    'bottom-right',
    'bottom-left',
    'top-left',
  ] as const
  type Positions = (typeof positions)[number]

  const containerComp = createElementWithState<Positions>({
    initialState: 'top-right',
    class: (state) => [containerStyle, globalStyle, state],
    id: 's-logger-persistent',
    children: [createElement({ class: 'content' })],
  })

  containerComp.element.appendChild(
    createElement({
      class: 'footer',
      children: [
        createElementWithState<Positions, 'button'>({
          initialState: containerComp.state,
          syncState: containerComp.onStateChange,
          tag: 'button',
          class: 'move',
          innerText: (state) => {
            switch (state) {
              case 'top-right':
                return '↓'

              case 'bottom-right':
                return '←'

              case 'bottom-left':
                return '↑'

              case 'top-left':
                return '→'
            }
          },
          onClick: () => {
            containerComp.setState((current) => {
              switch (current) {
                case 'top-right':
                  return 'bottom-right'

                case 'bottom-right':
                  return 'bottom-left'

                case 'bottom-left':
                  return 'top-left'

                case 'top-left':
                  return 'top-right'
              }
            })
          },
        }).element,
        createElement({
          tag: 'button',
          class: 'close',
          innerText: 'close',
          title: 'Alt + click to disable, Esc to close',
          onClick: (e) => {
            if (e.altKey) {
              enabled = false
              alert(
                'Persistent logs disabled, refresh page or press "e" to enable again',
              )
            }

            removeContainer()
          },
        }),
      ],
    }),
  )

  window.addEventListener('keydown', addKeyboardsShortcuts)

  container = containerComp.element

  document.body.appendChild(containerComp.element)
}

function removeContainer() {
  if (!container) return

  document.body.removeChild(container)
  window.removeEventListener('keydown', addKeyboardsShortcuts)
  container = null
}

type Options = {
  disableAutoFormat?: boolean
  maxFractionDigits?: number
  minFractionDigits?: number
  alignLeft?: boolean
  lastNValues?: number
  lastNDiffValues?: number
  fontSize?: number
  autoCloseInMs?: number
  objFormat?: {
    yamlMaxLineLength?: number
    useJSON?: boolean
    yamlHideUndefined?: boolean
  }
}

const yamlKeyValueRegex =
  /^(.+): ((null|true|false|undefined|\|-|\||\>|\>-|\[|'|"|[0-9]|\{).*)$/

export function watchValue<T>(value: T): T
export function watchValue<T>(id: string, value: T, options?: Options): T
export function watchValue(
  ...args: [value: any] | [id: string, value: any, options?: Options]
): unknown {
  const id = args.length === 1 ? '.' : args[0]
  const value = args.length === 1 ? args[0] : args[1]
  const options: Options = (args.length === 1 ? {} : args[2]) || {}

  if (_logTraces) {
    console.trace(`watchValue ${id}`, value)
  }

  const {
    disableAutoFormat,
    minFractionDigits,
    alignLeft: _alignLeft,
    maxFractionDigits = minFractionDigits ? undefined : 4,
    lastNValues,
    lastNDiffValues,
    objFormat,
    fontSize,
    autoCloseInMs,
  } = options

  if (!enabled) return

  createContainer()

  let newValue = value
  let alignLeft = _alignLeft

  const varElement = getVarContentElement(id)

  let isYaml = false

  if (!disableAutoFormat) {
    if (typeof value === 'object' && value !== null) {
      varElement.content.ondblclick = () => {
        navigator.clipboard.writeText(JSON.stringify(value, null, 2))
        alert('Copied as JSON to clipboard')
      }

      if (objFormat?.useJSON) {
        newValue = JSON.stringify(value, null, 2)

        varElement.content.onclick = (e) => {
          if (e.shiftKey) {
            watchValue(id, value, { objFormat: { useJSON: false } })
            return
          }
        }

        varElement.content.title = 'Shift+click to view as YAML'
      } else {
        newValue = yamlStringify(value, {
          maxLineLength: objFormat?.yamlMaxLineLength,
          showUndefined: true,
        })
        isYaml = true
      }

      alignLeft = true
    } else if (typeof value === 'number') {
      newValue = new Intl.NumberFormat('en', {
        maximumFractionDigits: maxFractionDigits,
        minimumFractionDigits: minFractionDigits,
      }).format(value)
    } else if (value === null) {
      newValue = 'null'
    } else if (value === '') {
      newValue = 'empty string'
    }
  }

  if (lastNValues || lastNDiffValues) {
    const maxValues = lastNValues || lastNDiffValues || 0

    const values = [
      ...varElement.container.querySelectorAll<HTMLDivElement>('.sub-value'),
    ]

    if (lastNDiffValues) {
      const lastValue = values[0]?.innerText

      if (lastValue === newValue) {
        return
      }
    }

    if (values.length === 0) {
      varElement.content.innerText = ''
    }

    if (values.length >= maxValues) {
      values.at(-1)?.remove()
    }

    const valueElement = createElement({
      class: 'sub-value',
      innerText: newValue,
    })

    varElement.content.prepend(valueElement)
  } else {
    if (isYaml) {
      let yamlValue = ''

      varElement.content.classList.add('yaml')

      const valueLines = String(newValue).split('\n')

      let isMultilineText = false
      let multilineTextIndent = 0

      for (const valueLine of valueLines) {
        const valueLineTrimmed = valueLine.trimStart()

        const startIndent = valueLine.length - valueLineTrimmed.length

        if (isMultilineText) {
          if (startIndent < multilineTextIndent) {
            isMultilineText = false
          }
        }

        let afterIndent = valueLineTrimmed

        const match = yamlKeyValueRegex.exec(valueLineTrimmed)

        if (isMultilineText) {
          afterIndent = `<span class="value string">${getYamlValueHtml(valueLineTrimmed)}</span>`
        } else {
          if (match) {
            const key = match[1]!
            const itemValue = match[2]!

            afterIndent = `<span class="key">${key}</span>: <span class="value ${getYamlValueClass(
              itemValue,
            )}">${getYamlValueHtml(itemValue)}</span>`
          } else if (afterIndent.endsWith(':')) {
            afterIndent = `<span class="key">${afterIndent.slice(0, -1)}</span>:`
          } else if (afterIndent.startsWith('- ')) {
            const arrVal = valueLineTrimmed.slice(2)

            afterIndent = `<span class="key array">- </span><span class="value ${getYamlValueClass(
              arrVal,
            )}">${getYamlValueHtml(arrVal)}</span>`
          } else {
            afterIndent = `<span class="value">${getYamlValueHtml(valueLineTrimmed)}</span>`
          }
        }

        yamlValue += `${'<span class="indent">  </span>'.repeat(startIndent / 2)}${afterIndent}\n`

        if (valueLine.endsWith(': |') || valueLine.endsWith(': |-')) {
          isMultilineText = true
          multilineTextIndent = startIndent + 2
        }
      }

      if (yamlValue.endsWith('\n')) {
        yamlValue = yamlValue.slice(0, -1)
      }

      varElement.content.onclick = (e) => {
        if (e.shiftKey) {
          watchValue(id, value, { objFormat: { useJSON: true } })
          return
        }
      }

      varElement.content.title =
        'Double click to copy as JSON\nShift+click to view as JSON'

      varElement.content.innerHTML = yamlValue
    } else {
      varElement.content.innerText = newValue
    }

    const stringValue = String(newValue)

    if (value === undefined || value === null || value === '') {
      varElement.content.classList.add('null-or-undefined')
    }

    if (stringValue.length > 100 || stringValue.split('\n').length > 1) {
      varElement.content.classList.add('long')
    }
  }

  if (fontSize) {
    varElement.content.style.fontSize = `${fontSize}px`
  }

  if (alignLeft) {
    varElement.container.classList.add('alignLeft')
  } else {
    varElement.container.classList.remove('alignLeft')
  }

  if (autoCloseInMs) {
    const autoCloseTimeoutId = window.setTimeout(() => {
      removeVar(id)
    }, autoCloseInMs)

    varElement.content.onmouseenter = () => {
      clearTimeout(autoCloseTimeoutId)
    }
  }

  return value
}

export function removeVar(id: string) {
  if (!container) return

  const varElement = container.querySelector<HTMLDivElement>(
    `[data-id="${id}"]`,
  )

  if (!varElement) return

  varElement.remove()

  if (!container.querySelector('.var')) {
    removeContainer()
  }
}

function getVarContentElement(id: string): {
  content: HTMLDivElement
  container: HTMLDivElement
} {
  if (!container) throw new Error('Container not found')

  const content = container.querySelector<HTMLDivElement>('.content')!

  const currentElement = content.querySelector<HTMLDivElement>(
    `[data-id="${id}"]`,
  )

  if (currentElement)
    return {
      content: currentElement.querySelector<HTMLDivElement>('.value')!,
      container: currentElement,
    }

  const valueElement = createElement({ class: 'value' })

  const newElement = createElement({
    class: 'var',
    dataset: { id },
    children: [
      createElement({
        class: 'title',
        children: [
          createElement({
            tag: 'button',
            innerText: '⨯',
            onClick: () => {
              removeVar(id)
            },
          }),
          createElement({ class: 'var-name', innerText: id }),
        ],
      }),
      valueElement,
    ],
  })

  content.prepend(newElement)

  return {
    content: valueElement,
    container: newElement,
  }
}

export function watchCount(
  id = 'count',
  {
    alignLeft: _alignLeft,
  }: {
    alignLeft?: boolean
  } = {},
) {
  if (!enabled) return

  createContainer()

  const alignLeft = _alignLeft

  const varElement = getVarContentElement(id)

  const currentCount = Number(varElement.content.innerText)

  varElement.content.innerText = String(currentCount + 1)

  if (alignLeft) {
    varElement.container.classList.add('alignLeft')
  } else {
    varElement.container.classList.remove('alignLeft')
  }

  return () => {
    removeVar(id)
  }
}

const escapeRegex = /[&<>"']/g

const escapeMap: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

function htmlToText(htmlString: string) {
  const escapedText = htmlString.replace(
    escapeRegex,
    (match) => escapeMap[match] || '',
  )

  const text = document.createElement('div')
  text.innerText = escapedText

  return text.textContent || ''
}

const isNumberRegex = /^-?\d+(\.\d+)?$/

function getYamlValueClass(value: string): string {
  if (value.startsWith('"') && value.endsWith('"')) {
    return 'string'
  }

  if (value.startsWith("'") && value.endsWith("'")) {
    return 'string'
  }

  if (value === 'true') {
    return 'true'
  }

  if (value === 'false') {
    return 'false'
  }

  if (isNumberRegex.test(value)) {
    return 'number'
  }

  if (
    value === '[]' ||
    value === '{}' ||
    value === 'null' ||
    value === 'undefined'
  ) {
    return 'empty-value'
  }

  return ''
}

function getYamlValueHtml(value: string): string {
  let newValue = value

  if (newValue.startsWith('[') && newValue.endsWith(']')) {
    let valueContent = ''

    for (const item of newValue
      .slice(1, -1)
      .split(/, (?=[0-9'"]|true|false|null|undefined)/)) {
      if (valueContent.length > 0) {
        valueContent += '</span><span class="syntax">, </span>'
      }

      valueContent += `<span class="array-item ${getYamlValueClass(item)}">${htmlToText(item)}</span>`
    }

    newValue = `<span class="syntax">[</span>${valueContent}<span class="syntax">]</span>`

    return newValue
  }

  return htmlToText(value)
}
