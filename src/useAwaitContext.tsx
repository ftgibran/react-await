import {useContext, useMemo} from 'react'
import {AwaitContext} from './AwaitContext'
import {AwaitState} from './types'

export function useAwaitContext() {
  const context = useContext(AwaitContext)

  const getState = (name: string, index?: number) =>
    context.record[getFullName(name, index)]

  const getFullName = (name: string, index?: number) =>
    `${name}${index !== undefined ? `__${index}` : ''}`

  const isStateUndefined = (name: string, index?: number) =>
    getState(name, index) === undefined

  const isStateStandby = (name: string, index?: number) =>
    getState(name, index) === AwaitState.STANDBY

  const isStateLoading = (name: string, index?: number) =>
    getState(name, index) === AwaitState.LOADING

  const isStateError = (name: string, index?: number) =>
    getState(name, index) === AwaitState.ERROR

  const setRecord = (state: AwaitState, name: string, index?: number) =>
    context.setRecord({...context.record, [getFullName(name, index)]: state})

  const init = (name: string, index?: number) =>
    setRecord(AwaitState.LOADING, name, index)

  const done = (name: string, index?: number) =>
    setRecord(AwaitState.STANDBY, name, index)

  const error = (name: string, index?: number) =>
    setRecord(AwaitState.ERROR, name, index)

  async function run<T>(
    name: string,
    func: (...args: any[]) => Promise<T>,
    delay?: number,
    index?: number
  ): Promise<T> {
    try {
      init(name, index)

      if (delay) await new Promise((resolve) => setTimeout(resolve, delay))
      const result = await func()

      done(name, index)

      return result
    } catch (e) {
      error(name, index)

      throw e
    }
  }

  return useMemo(
    () => ({
      stateRecord: context.record,
      getFullName,
      isStateUndefined,
      isStateStandby,
      isStateLoading,
      isStateError,
      init,
      done,
      error,
      run,
    }),
    [context.record]
  )
}
