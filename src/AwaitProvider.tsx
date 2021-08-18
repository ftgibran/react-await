import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {AwaitContext} from './AwaitContext'
import {AwaitContextOptions, AwaitContextState} from './types'

export interface AwaitProviderProps {
  children?: React.ReactElement | React.ReactElement[]
}

export function AwaitProvider(props: AwaitProviderProps & AwaitContextOptions) {
  const {children, ...options} = props

  const initialContextState: AwaitContextState = {
    dataState: {},
    ...options,
  }

  const [contextState, setContextState] = useState(initialContextState)

  return (
    <AwaitContext.Provider value={{...contextState, setContextState}}>
      {children}
    </AwaitContext.Provider>
  )
}

AwaitProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element.isRequired),
  ]),
  defaultLoadingView: PropTypes.element,
}

AwaitProvider.defaultProps = {
  children: undefined,
  defaultLoadingView: undefined,
}
