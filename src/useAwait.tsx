import {useContext, useEffect, useMemo, useState} from 'react'
import {AwaitContext} from './AwaitContext'
import {AwaitState} from './types'

export function useAwait(name: string, index?: number) {
  const ctx = useContext(AwaitContext)

  const [state, setState] = useState<AwaitState>()

  useEffect(() => {
    setState(ctx.dataState?.[getFullName()])
  }, [ctx.dataState])

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
    ctx.setContextState?.((state) => {
      const data = {...state.dataState}
      data[getFullName()] = AwaitState.LOADING

      return {...state, dataState: {...data}}
    })
  }

  function done() {
    ctx.setContextState?.((state) => {
      const data = {...state.dataState}
      data[getFullName()] = AwaitState.STANDBY

      return {...state, dataState: {...data}}
    })
  }

  function error() {
    ctx.setContextState?.((state) => {
      const data = {...state.dataState}
      data[getFullName()] = AwaitState.ERROR

      return {...state, dataState: {...data}}
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
    [state]
  )
}
