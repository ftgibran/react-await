import React from 'react'

export enum AwaitState {
  LOADING,
  STANDBY,
  ERROR,
}

export interface AwaitContextData {
  record?: Record<string, AwaitState>
  setContextState?: React.Dispatch<React.SetStateAction<AwaitContextState>>
}

export interface AwaitContextOptions {
  defaultLoadingView?: React.ReactElement
  defaultAnimationClassName?: string
  defaultAnimationDuration?: number
}

export type AwaitContextState = AwaitContextData & AwaitContextOptions
