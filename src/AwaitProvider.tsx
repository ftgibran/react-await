import React from 'react'
import {AwaitContext} from './AwaitContext'
import {AwaitContextOptions, AwaitContextProps, AwaitState} from './types'

export type AwaitProviderProps = AwaitContextOptions

export const AwaitProvider: React.FC<AwaitProviderProps> = (props) => {
  const {children, ...options} = props

  const [record, setRecord] = React.useState<Record<string, AwaitState>>({})

  const context: AwaitContextProps = {
    record,
    setRecord,
    ...options,
  }

  return <AwaitContext.Provider value={context} children={children} />
}
