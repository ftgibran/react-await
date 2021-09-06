import React from 'react'
import {AwaitContextState} from './types'

export const AwaitContext = React.createContext<AwaitContextState>({
  record: {},
  setRecord: () => {
    /**/
  },
})
