import React from 'react'
import {AwaitContextProps} from './types'

export const AwaitContext = React.createContext<AwaitContextProps>({
  record: {},
  setRecord: () => {
    /**/
  },
})
