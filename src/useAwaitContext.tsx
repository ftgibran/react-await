import React from 'react'
import {AwaitContext} from './AwaitContext'
import {AwaitState} from './types'

export function useAwaitContext() {
  const {record, setRecord, ...rest} = React.useContext(AwaitContext)

  const getFullName = React.useCallback(
    (name: string, index?: number) =>
      `${name}${index !== undefined ? `__${index}` : ''}`,
    []
  )

  const getState = React.useCallback(
    (name: string, index?: number) => record[getFullName(name, index)],
    [getFullName, record]
  )

  const setState = React.useCallback(
    (state: AwaitState, name: string, index?: number) => {
      setRecord((data) => ({...data, [getFullName(name, index)]: state}))
    },
    [getFullName, setRecord]
  )

  const isUnset = React.useCallback(
    (name: string, index?: number) => getState(name, index) === undefined,
    [getState]
  )

  const isStandby = React.useCallback(
    (name: string, index?: number) =>
      getState(name, index) === AwaitState.STANDBY,
    [getState]
  )

  const isLoading = React.useCallback(
    (name: string, index?: number) =>
      getState(name, index) === AwaitState.LOADING,
    [getState]
  )

  const isError = React.useCallback(
    (name: string, index?: number) =>
      getState(name, index) === AwaitState.ERROR,
    [getState]
  )

  const init = React.useCallback(
    (name: string, index?: number) => {
      setState(AwaitState.LOADING, name, index)
    },
    [setState]
  )

  const done = React.useCallback(
    (name: string, index?: number) => {
      setState(AwaitState.STANDBY, name, index)
    },
    [setState]
  )

  const error = React.useCallback(
    (name: string, index?: number) => {
      setState(AwaitState.ERROR, name, index)
    },
    [setState]
  )

  const run = React.useCallback(
    async <T,>(
      name: string,
      callback: () => Promise<T>,
      delay?: number,
      index?: number
    ) => {
      try {
        init(name, index)

        if (delay) {
          await new Promise((resolve) => setTimeout(resolve, delay))
        }

        const result = await callback()

        done(name, index)

        return result
      } catch (e) {
        error(name, index)
        throw e
      }
    },
    [done, error, init]
  )

  return {
    getFullName,
    getState,
    setState,
    isUnset,
    isStandby,
    isLoading,
    isError,
    init,
    done,
    error,
    run,
    record,
    setRecord,
    ...rest,
  }
}
