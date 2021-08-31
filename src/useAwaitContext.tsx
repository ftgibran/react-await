import {useContext, useMemo} from 'react'
import {AwaitContext} from './AwaitContext'
import {AwaitState} from './types'

export function useAwaitContext() {
  const context = useContext(AwaitContext)

  function getState(name: string, index?: number) {
    return context.record?.[getFullName(name, index)]
  }

  function getFullName(name: string, index?: number) {
    return `${name}${index !== undefined ? `__${index}` : ''}`
  }

  function isStateUndefined(name: string, index?: number) {
    return getState(name, index) === undefined
  }

  function isStateStandby(name: string, index?: number) {
    return getState(name, index) === AwaitState.STANDBY
  }

  function isStateLoading(name: string, index?: number) {
    return getState(name, index) === AwaitState.LOADING
  }

  function isStateError(name: string, index?: number) {
    return getState(name, index) === AwaitState.ERROR
  }

  function init(name: string, index?: number) {
    context.setContextState?.((state) => {
      const data = {...state.record}
      data[getFullName(name, index)] = AwaitState.LOADING

      return {...state, record: {...data}}
    })
  }

  function done(name: string, index?: number) {
    context.setContextState?.((state) => {
      const data = {...state.record}
      data[getFullName(name, index)] = AwaitState.STANDBY

      return {...state, record: {...data}}
    })
  }

  function error(name: string, index?: number) {
    context.setContextState?.((state) => {
      const data = {...state.record}
      data[getFullName(name, index)] = AwaitState.ERROR

      return {...state, record: {...data}}
    })
  }

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
      stateRecord: context.record ?? {},
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
