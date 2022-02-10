import React from 'react'
import type {useAwait} from './useAwait'
import type {useAwaitContext} from './useAwaitContext'

export enum AwaitState {
  LOADING,
  STANDBY,
  ERROR,
}

export interface AwaitContextData {
  record: Record<string, AwaitState>
  setRecord: React.Dispatch<React.SetStateAction<Record<string, AwaitState>>>
}

export interface AwaitContextOptions {
  defaultLoadingView?: React.ReactElement
  defaultAnimationClassName?: string
  defaultAnimationDuration?: number
}

export type AwaitContextProps = AwaitContextData & AwaitContextOptions

export type AwaitLoader = {
  fullName: string
  state: AwaitState
  setState: (state: AwaitState) => void
  isUnset: boolean
  isStandby: boolean
  isLoading: boolean
  isError: boolean
}

export type AwaitController = {
  init: () => void
  done: () => void
  error: () => void
  run: <T>(cb: () => Promise<T>, delay?: number) => Promise<T>
}

export type UseAwaitReturn = ReturnType<typeof useAwait>
export type UseAwaitContextReturn = ReturnType<typeof useAwaitContext>
