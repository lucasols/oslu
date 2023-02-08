import { initializePersistentLogs } from '../../lib/src/persistentLogger'
import { initializeTempLogs } from '../../lib/src/tempLogger'

initializeTempLogs({
  ignoreErrors: ['Ignore'],
})
initializePersistentLogs()
