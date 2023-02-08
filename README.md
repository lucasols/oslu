# OSLU

**O**n **S**creen **L**og **U**tils

## Installation

```bash
npm install oslu
```

## Usage

In order to use OSLU, you need to initialize the temp and persistent loggers.

```ts
import { initializePersistentLogs, initializeTempLogs } from 'oslu'

initializeTempLogs({
  ignoreErrors: [
    // ignore errors that contain the following strings or match the following regexes
    'Error: Network Error',
    /Error: Request failed with status code \d+/,
  ],
  ]
})
initializePersistentLogs()
```

## `logInfoOnScreen`

`logInfoOnScreen` logs a message on the screen.

```ts
import { logInfoOnScreen } from 'oslu'

// pass a id and a message to log
logInfoOnScreen('information', 'Info')
```

## `logErrorOnScreen`

`logErrorOnScreen` logs an error on the screen.

```ts
import { logErrorOnScreen } from 'oslu'

// pass the error to log
logErrorOnScreen('error message')
```

## `watchValue`

`watchValue` persist a value in the screen and update it when the value changes.

```ts
import { watchValue } from 'oslu'

// pass a id and a value to watch
watchValue('myValue', 1)
watchValue('myValue', 2)
watchValue('myValue', 3)

// you can also pass only the value, using the default id
watchValue(1)
watchValue(2)
```

## `watchCount`

`watchCount` persist a counter in the screen and update it when the counter changes.

```ts
import { watchCount } from 'oslu'

// pass a id and each time you call watchCount with the same id, the counter will be incremented
watchCount('myCount') // logs 1
watchCount('myCount') // logs 2
watchCount('myCount') // logs 3
```
