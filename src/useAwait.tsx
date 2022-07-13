import React from 'react'
import {AwaitController, AwaitLoader, AwaitState} from './types'
import {useAwaitContext} from './useAwaitContext'

export function useAwait(name?: string, index?: number) {
  const {
    getFullName,
    getState: getStateFromRecord,
    setState: setStateFromRecord,
    isUnset: isUnsetFromRecord,
    isStandby: isStandbyFromRecord,
    isLoading: isLoadingFromRecord,
    isError: isErrorFromRecord,
    init: initFromRecord,
    done: doneFromRecord,
    error: errorFromRecord,
    run: runFromRecord,
    ...rest
  } = useAwaitContext()

  const id = React.useId()

  const params = React.useMemo<[string, number | undefined]>(() => {
    if (name !== undefined) {
      return [name, index]
    }

    return [id, undefined]
  }, [id, index, name])

  const fullName = React.useMemo(
    () => getFullName(...params),
    [getFullName, params]
  )

  const state = React.useMemo(
    () => getStateFromRecord(...params),
    [getStateFromRecord, params]
  )

  const setState = React.useCallback(
    (state: AwaitState) => setStateFromRecord(state, ...params),
    [setStateFromRecord, params]
  )

  const isUnset = React.useMemo(
    () => isUnsetFromRecord(...params),
    [isUnsetFromRecord, params]
  )

  const isStandby = React.useMemo(
    () => isStandbyFromRecord(...params),
    [isStandbyFromRecord, params]
  )

  const isLoading = React.useMemo(
    () => isLoadingFromRecord(...params),
    [isLoadingFromRecord, params]
  )

  const isError = React.useMemo(
    () => isErrorFromRecord(...params),
    [isErrorFromRecord, params]
  )

  const init = React.useCallback(
    () => initFromRecord(...params),
    [initFromRecord, params]
  )

  const done = React.useCallback(
    () => doneFromRecord(...params),
    [doneFromRecord, params]
  )

  const error = React.useCallback(
    () => errorFromRecord(...params),
    [errorFromRecord, params]
  )

  const run = React.useCallback(
    <T,>(callback: () => Promise<T>, delay?: number) =>
      runFromRecord(params[0], callback, delay, params[1]),
    [runFromRecord, params]
  )

  const loader: AwaitLoader = React.useMemo(
    () => ({
      fullName,
      state,
      setState,
      isUnset,
      isStandby,
      isLoading,
      isError,
    }),
    [fullName, state, setState, isUnset, isStandby, isLoading, isError]
  )

  const controller: AwaitController = React.useMemo(
    () => ({init, done, error, run}),
    [init, done, error, run]
  )

  return {
    loader,
    controller,
    ...rest,
  }
}
