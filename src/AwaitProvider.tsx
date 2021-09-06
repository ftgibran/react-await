import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {AwaitContext} from './AwaitContext'
import {AwaitContextOptions, AwaitContextState, AwaitState} from './types'

export interface AwaitProviderProps {
  children?: React.ReactElement | React.ReactElement[]
}

export function AwaitProvider(props: AwaitProviderProps & AwaitContextOptions) {
  const {children, ...options} = props

  const [record, setRecord] = useState<Record<string, AwaitState>>({})

  const initialContextState: AwaitContextState = {
    record,
    setRecord,
    ...options,
  }

  return (
    <AwaitContext.Provider value={initialContextState}>
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
