import {useContext, useEffect, useMemo, useState} from 'react'
import {AwaitContext} from './AwaitContext'
import {AwaitState} from './types'

export function useAwait(name: string, index?: number) {
  const context = useContext(AwaitContext)

  const [state, setState] = useState<AwaitState>()

  useEffect(() => {
    setState(context.record?.[getFullName()])
  }, [context.record])

  function getFullName() {
    return `${name}${index !== undefined ? `__${index}` : ''}`
  }

  function isStateUndefined() {
    return state === undefined
  }

  function isStateStandby() {
    return state === AwaitState.STANDBY
  }

  function isStateLoading() {
    return state === AwaitState.LOADING
  }

  function isStateError() {
    return state === AwaitState.ERROR
  }

  function init() {
    context.setContextState?.((state) => {
      const data = {...state.record}
      data[getFullName()] = AwaitState.LOADING
      setState(data[getFullName()])

      return {...state, record: {...data}}
    })
  }

  function done() {
    context.setContextState?.((state) => {
      const data = {...state.record}
      data[getFullName()] = AwaitState.STANDBY
      setState(data[getFullName()])

      return {...state, record: {...data}}
    })
  }

  function error() {
    context.setContextState?.((state) => {
      const data = {...state.record}
      data[getFullName()] = AwaitState.ERROR
      setState(data[getFullName()])

      return {...state, record: {...data}}
    })
  }

  async function run<T>(
    func: (...args: any[]) => Promise<T>,
    delay?: number
  ): Promise<T> {
    try {
      init()

      if (delay) await new Promise((resolve) => setTimeout(resolve, delay))
      const result = await func()

      done()

      return result
    } catch (e) {
      error()

      throw e
    }
  }

  return useMemo(
    () => ({
      state,
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
    [state, context.record]
  )
}
