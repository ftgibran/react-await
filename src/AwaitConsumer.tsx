import PropTypes from 'prop-types'
import React, {useEffect, useRef, useState} from 'react'
import {CSSTransition, SwitchTransition} from 'react-transition-group'
import {useAwait} from './useAwait'
import {AwaitContext} from './AwaitContext'
import {AwaitState} from './types'

export interface AwaitConsumerProps {
  name: string
  index?: number
  animationClassName?: string
  animationDuration?: number
  onLoadingStart?: () => void
  onLoadingEnd?: () => void
  onError?: () => void
  children?: React.ReactElement | React.ReactElement[]
  defaultView?: React.ReactElement
  loadingView?: React.ReactElement
  errorView?: React.ReactElement
}

type HTMLProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>

const defaultAnimationClassName = 'fade-blur'
const defaultAnimationDuration = 400

export function AwaitConsumer(props: AwaitConsumerProps & HTMLProps) {
  const {
    name,
    index,
    animationClassName,
    animationDuration,
    onLoadingStart,
    onLoadingEnd,
    onError,
    children,
    defaultView,
    loadingView,
    errorView,
    ...htmlProps
  } = props

  const hooker = useAwait(name, index)
  const ref = useRef<React.DetailedHTMLProps<any, any>>(null)

  const [minHeight, setMinHeight] = useState<number>()
  const [minWidth, setMinWidth] = useState<number>()

  useEffect(() => {
    switch (hooker.state) {
      case AwaitState.LOADING:
        onLoadingStart?.()
        break
      case AwaitState.STANDBY:
        onLoadingEnd?.()
        break
      case AwaitState.ERROR:
        onError?.()
        break
    }

    if (ref.current) {
      setMinHeight(ref.current.clientHeight)
      setMinWidth(ref.current.clientWidth)
    }
  }, [hooker.state])

  return (
    <AwaitContext.Consumer>
      {(state) => (
        <SwitchTransition mode={'out-in'}>
          <CSSTransition
            key={hooker.state ?? AwaitState.STANDBY}
            classNames={
              animationClassName ??
              state.defaultAnimationClassName ??
              defaultAnimationClassName
            }
            timeout={
              animationDuration ??
              state.defaultAnimationDuration ??
              defaultAnimationDuration
            }
            unmountOnExit
            appear
          >
            <div ref={ref} {...htmlProps}>
              {hooker.isStateLoading() && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight,
                    minWidth,
                  }}
                >
                  {loadingView ?? state.defaultLoadingView ?? (
                    <div>Loading...</div>
                  )}
                </div>
              )}

              {hooker.isStateError() &&
                (errorView ??
                  defaultView ??
                  (children as React.ReactElement) ?? <div />)}

              {(hooker.isStateStandby() || hooker.isStateUndefined()) &&
                (defaultView ?? (children as React.ReactElement) ?? <div />)}
            </div>
          </CSSTransition>
        </SwitchTransition>
      )}
    </AwaitContext.Consumer>
  )
}

AwaitConsumer.propTypes = {
  name: PropTypes.string.isRequired,
  animationClassName: PropTypes.string,
  animationDuration: PropTypes.number,
  onLoadingStart: PropTypes.func,
  onLoadingEnd: PropTypes.func,
  onError: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element.isRequired),
  ]),
  defaultView: PropTypes.element,
  loadingView: PropTypes.element,
  errorView: PropTypes.element,
}
