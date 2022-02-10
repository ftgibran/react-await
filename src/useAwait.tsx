import React from 'react'
import {AwaitController, AwaitLoader, AwaitState} from './types'
import {useAwaitContext} from './useAwaitContext'

export function useAwait(name: string, index?: number) {
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

  const fullName = React.useMemo(() => getFullName(name, index), [
    getFullName,
    name,
    index,
  ])

  const state = React.useMemo(() => getStateFromRecord(name, index), [
    getStateFromRecord,
    name,
    index,
  ])

  const setState = React.useCallback(
    (state: AwaitState) => setStateFromRecord(state, name, index),
    [setStateFromRecord, name, index]
  )

  const isUnset = React.useMemo(() => isUnsetFromRecord(name, index), [
    isUnsetFromRecord,
    name,
    index,
  ])

  const isStandby = React.useMemo(() => isStandbyFromRecord(name, index), [
    isStandbyFromRecord,
    name,
    index,
  ])

  const isLoading = React.useMemo(() => isLoadingFromRecord(name, index), [
    isLoadingFromRecord,
    name,
    index,
  ])

  const isError = React.useMemo(() => isErrorFromRecord(name, index), [
    isErrorFromRecord,
    name,
    index,
  ])

  const init = React.useCallback(() => initFromRecord(name, index), [
    initFromRecord,
    name,
    index,
  ])

  const done = React.useCallback(() => doneFromRecord(name, index), [
    doneFromRecord,
    name,
    index,
  ])

  const error = React.useCallback(() => errorFromRecord(name, index), [
    errorFromRecord,
    name,
    index,
  ])

  const run = React.useCallback(
    <T,>(callback: () => Promise<T>, delay?: number) =>
      runFromRecord(name, callback, delay, index),
    [runFromRecord, name, index]
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
