import cp = require('child_process')
import Promise = require('bluebird')
import {NotInstalledError} from '../types'

const execAsync = Promise.promisify(cp.exec)

const notInstalledErr = (name: string) => {
  const err: NotInstalledError = new Error(`Browser not installed: ${name}`) as NotInstalledError
  err.notInstalled = true
  throw err
}

export const linuxBrowser = {
  get: (binary: string, re: RegExp): Promise<any> => {
    return execAsync(`${binary} --version`)
      .call('trim')
      .then (stdout => {
        const m = re.exec(stdout)
        if (m) {
          return {
            path: binary,
            version: m[1]
          }
        } else {
          return notInstalledErr(binary)
        }
      })
      .catch(() => notInstalledErr(binary))
  }
}