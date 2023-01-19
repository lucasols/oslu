import { css } from 'goober'
import { globalStyle } from './globalStyle'
import { createElement, createElementWithState } from './utils/createElement'
import { inline } from './utils/inline'
import { stack } from './utils/stack'
import { transition } from './utils/transition'

let container: HTMLDivElement | null = null

function addKeyboardsShortcuts(e: KeyboardEvent) {
  if (e.key === 'g') {
    container?.classList.toggle('ghost')
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

          > .var-name {
            opacity: 0.7;
          }

          > button {
            ${transition()};
            opacity: 0;
          }
        }

        &:hover .title > button {
          opacity: 0.5;
        }

        .value {
          font-size: 14px;
          white-space: pre-wrap;
          font-weight: 500;

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
  type Positions = typeof positions[number]

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
          onClick: () => {
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
}

export function watchValue(
  id: string,
  value: any,
  {
    disableAutoFormat,
    minFractionDigits,
    alignLeft: _alignLeft,
    maxFractionDigits = minFractionDigits ? undefined : 4,
    lastNValues,
    lastNDiffValues,
  }: Options = {},
) {
  createContainer()

  let newValue = value
  let alignLeft = _alignLeft

  const varElement = getVarContentElement(id)

  if (!disableAutoFormat) {
    if (typeof value === 'object' && value !== null) {
      newValue = JSON.stringify(value, null, 2)

      alignLeft = true
    }

    if (typeof value === 'number') {
      newValue = new Intl.NumberFormat('en', {
        maximumFractionDigits: maxFractionDigits,
        minimumFractionDigits: minFractionDigits,
      }).format(value)
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
    varElement.content.innerText = newValue
  }

  if (alignLeft) {
    varElement.container.classList.add('alignLeft')
  } else {
    varElement.container.classList.remove('alignLeft')
  }

  return () => {
    removeVar(id)
  }
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

  content.appendChild(newElement)

  return {
    content: valueElement,
    container: newElement,
  }
}

export function watchCount(
  id: string,
  {
    alignLeft: _alignLeft,
  }: {
    alignLeft?: boolean
  } = {},
) {
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
