import {useContext, useEffect, useMemo, useState} from 'react'
import {AwaitContext} from './AwaitContext'
import {AwaitState} from './types'

export function useAwait(name: string, index?: number) {
  const context = useContext(AwaitContext)

  const [state, setState] = useState<AwaitState>()

  const getFullName = () => `${name}${index !== undefined ? `__${index}` : ''}`

  useEffect(() => {
    setState(context.record[getFullName()])
  }, [context.record[getFullName()]])

  const isStateUndefined = () => state === undefined
  const isStateStandby = () => state === AwaitState.STANDBY
  const isStateLoading = () => state === AwaitState.LOADING
  const isStateError = () => state === AwaitState.ERROR

  const setRecord = (state: AwaitState) => {
    context.setRecord((data) => ({...data, [getFullName()]: state}))
  }

  const init = () => {
    setState(AwaitState.LOADING) // set before next render
    setRecord(AwaitState.LOADING)
  }
  const done = () => setRecord(AwaitState.STANDBY)
  const error = () => setRecord(AwaitState.ERROR)

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
    [state, context.record]
  )
}
