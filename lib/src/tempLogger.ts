import { css } from 'goober'
import { centerContent } from './utils/centerContent'
import { inline } from './utils/inline'
import { stack } from './utils/stack'
import { globalStyle } from './globalStyle'
import { transition } from './utils/transition'
import { createElement } from './utils/createElement'
import { jsonFormatter } from './utils/jsonFormatter'

let container: HTMLDivElement | null = null

const defaultErrorLogger = console.error
let ignoreErrorPatterns: (RegExp | string)[] = []

export function initializeTempLogs({
  ignoreErrors,
}: {
  ignoreErrors: (RegExp | string)[]
}) {
  ignoreErrorPatterns = ignoreErrors

  const style = css`
    position: fixed;
    pointer-events: none;
    bottom: 16px;
    left: 16px;
    display: flex;
    flex-direction: column;
    align-items: left;
    gap: 8px;

    --icon-size: 42px;

    .log {
      pointer-events: auto;
      ${transition()};
      height: var(--icon-size);
      width: var(--icon-size);
      position: relative;

      &.hidden {
        opacity: 0;
        height: 0;
        width: 0;
      }

      &.error {
        .icon {
          color: #e53558;
        }

        .content {
          .item {
            background-color: rgba(229, 53, 88, 0.16);
          }
        }
      }
    }

    .log-content-container {
      pointer-events: auto;
      background: #111827;
      display: grid;
      position: absolute;
      left: 0;
      bottom: 0;
      height: var(--icon-size);
      width: var(--icon-size);
      overflow: hidden;
      border-radius: 25px;
      ${inline({ align: 'bottom' })};
      ${transition()};
      color: #fff;

      &:hover {
        border-radius: 20px;
        border-bottom-right-radius: 10px;
        border-top-right-radius: 10px;

        height: max(var(--content-height), var(--icon-size));
        width: calc(var(--content-width) + var(--icon-size));
      }

      .icon {
        width: var(--icon-size);
        height: var(--icon-size);
        ${centerContent};

        svg {
          width: 24px;
          height: 24px;
        }
      }

      .content {
        padding-right: 6px;
        padding-block: 6px;
        max-width: 1200px;
        min-height: var(--icon-size);
        ${stack({ align: 'left', gap: 6 })};
        user-select: text;
        overflow-y: auto;
        max-height: 400px;

        .item {
          border-radius: 4px;
          padding: 3px 6px;
          max-width: 100%;
          flex-grow: 1;
          white-space: pre-wrap;
          font-family: 'Fira Code', monospace;
          font-size: 12px;
          background: rgba(255, 255, 255, 0.1);
          font-weight: 500;
        }
      }
    }
  `

  container = createElement({
    class: [style, globalStyle],
    id: 's-logger-temp',
  })

  document.body.appendChild(container)

  addErrorsListeners()
}

function addErrorsListeners() {
  window.onerror = (message) => {
    logOnScreen('error', message, {
      timeout: false,
      disableConsoleLog: true,
    })
  }

  window.onunhandledrejection = (event) => {
    logOnScreen('error', String(event.reason), {
      timeout: false,
      disableConsoleLog: true,
    })
  }

  console.error = (...args: any[]) => {
    logOnScreen('error', args, {
      timeout: 15_000,
      disableConsoleLog: true,
    })

    defaultErrorLogger(...args)
  }
}

const errorIcon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ic" width="32" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"></path></svg>`

interface LogOnScreenOptions {
  /** timeout of the log in ms */
  timeout?: number | false
  disableConsoleLog?: boolean
  disableDebounceOfDuplicatedErrors?: boolean
  iconChar?: string
}

const errorsLoggedInLast10Seconds = new Map<string, { timeout: number }>()

const logsAutohideTimeouts = new Map<
  HTMLDivElement,
  { startTimer: () => void; getTimeoutId: () => number }
>()

function logOnScreen(
  type: 'error' | 'info',
  message: any,
  {
    timeout = 10_000,
    iconChar,
    disableConsoleLog,
    disableDebounceOfDuplicatedErrors,
  }: LogOnScreenOptions = {},
) {
  if (!container) return

  const messageString = JSON.stringify(message)

  if (
    type === 'error' &&
    ignoreErrorPatterns.some((pattern) =>
      typeof pattern === 'string'
        ? messageString.includes(pattern)
        : messageString.match(pattern),
    )
  ) {
    return
  }

  if (type === 'error' && !disableConsoleLog) {
    defaultErrorLogger(message)
    console.trace()
  } else if (!disableConsoleLog) {
    console.log('[oslu]', message)
  }

  if (type === 'error' && !disableDebounceOfDuplicatedErrors) {
    const errorInLast10Sec = errorsLoggedInLast10Seconds.get(messageString)

    if (errorInLast10Sec) {
      clearTimeout(errorInLast10Sec.timeout)
    }

    const timeoutId = window.setTimeout(() => {
      errorsLoggedInLast10Seconds.delete(messageString)
    }, 10_000)

    errorsLoggedInLast10Seconds.set(messageString, { timeout: timeoutId })

    if (errorInLast10Sec) return
  }

  const icon = iconChar
    ? `<div class="icon-letter">${iconChar.slice(0, 4).toLowerCase()}</div>`
    : type === 'error'
    ? errorIcon
    : 'ℹ︎'

  const logContentContainer = createElement({
    class: `log-content-container`,
    innerHTML: `<div class="icon">${icon}</div>`,
    title: `Click to close, or shift+click to close all`,
    dataset: {
      messageId:
        type === 'error' && !disableDebounceOfDuplicatedErrors && messageString,
    },
  })

  const notification = createElement({
    class: `log ${type} hidden`,
    children: [logContentContainer],
  })

  const messageItems = Array.isArray(message) ? message : [message]

  const content = createElement({
    class: 'content',
    innerHTML: messageItems
      .map((item) => {
        let itemContent = ''

        if (typeof item === 'string' || typeof item === 'number') {
          itemContent = String(item)
        }
        itemContent = jsonFormatter(item)

        return `<div class="item">${itemContent}</div>`
      })
      .join(''),
  })

  logContentContainer.appendChild(content)

  container.appendChild(notification)

  const contentRect = content.getBoundingClientRect()

  notification.style.setProperty('--content-width', `${contentRect.width}px`)
  notification.style.setProperty('--content-height', `${contentRect.height}px`)

  setTimeout(() => {
    notification.classList.remove('hidden')
  }, 5)

  let timeoutId = -1

  if (timeout) {
    const startTimer = () => {
      timeoutId = window.setTimeout(() => {
        hideNotification(notification)
      }, timeout)
    }

    logsAutohideTimeouts.set(notification, {
      startTimer,
      getTimeoutId: () => timeoutId,
    })

    addElementEvent(notification, 'mouseenter', () => {
      stopAllLogsAutoHide()
    })

    addElementEvent(notification, 'mouseleave', () => {
      resumeAllLogsAutoHide()
    })

    startTimer()
  }

  addElementEvent(notification, 'click', (e: MouseEvent) => {
    window.clearTimeout(timeoutId)
    hideNotification(notification)

    if (e.shiftKey) {
      hideAllNotifications()
    }
  })

  removeExtraNotifications()
}

function stopAllLogsAutoHide() {
  logsAutohideTimeouts.forEach((timeout) => {
    clearTimeout(timeout.getTimeoutId())
  })
}

function resumeAllLogsAutoHide() {
  logsAutohideTimeouts.forEach((timeout) => {
    timeout.startTimer()
  })
}

export function logErrorOnScreen(message: any, options?: LogOnScreenOptions) {
  logOnScreen('error', message, options)
}

export function logInfoOnScreen(
  icon: string,
  message: any,
  options?: LogOnScreenOptions,
) {
  logOnScreen('info', message, { ...options, iconChar: icon })
}

function hideNotification(notification: HTMLDivElement) {
  notification.classList.add('hidden')
  logsAutohideTimeouts.delete(notification)

  addElementEvent(notification, 'transitionend', () => {
    removeAllElementEvents(notification)
    notification.remove()
  })

  const messageId = notification.getAttribute('data-message-id')

  if (messageId) {
    const errorInLast10Sec = errorsLoggedInLast10Seconds.get(messageId)
    clearTimeout(errorInLast10Sec?.timeout)
    errorsLoggedInLast10Seconds.delete(messageId)
  }
}

function removeExtraNotifications() {
  if (!container) return

  const notifications = [
    ...container.querySelectorAll<HTMLDivElement>('.log:not(.hidden)'),
  ]

  if (notifications.length > 10) {
    hideNotification(notifications.at(0)!)
  }
}

export function hideAllNotifications() {
  if (!container) return

  const notifications =
    container.querySelectorAll<HTMLDivElement>('.log:not(.hidden)')

  for (const notification of notifications) {
    hideNotification(notification)
  }
}

const elementsEvents = new WeakMap<
  HTMLDivElement,
  { event: string; cb: (e: any) => void }[]
>()

function addElementEvent(
  element: HTMLDivElement,
  event: keyof HTMLElementEventMap,
  cb: (e: any) => void,
) {
  element.addEventListener(event, cb)

  const events = elementsEvents.get(element)

  if (!events) {
    elementsEvents.set(element, [{ event, cb }])
  } else {
    events.push({ event, cb })
  }
}

function removeAllElementEvents(element: HTMLDivElement) {
  const events = elementsEvents.get(element)

  if (!events) return

  events.forEach((item) => {
    element.removeEventListener(item.event, item.cb)
  })

  elementsEvents.delete(element)
}
