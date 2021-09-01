import PropTypes from 'prop-types'
import React, {useEffect, useRef, useState} from 'react'
import {CSSTransition, SwitchTransition} from 'react-transition-group'
import {useAwait} from './useAwait'
import {AwaitContext} from './AwaitContext'
import {AwaitHandler, AwaitState} from './types'

export interface AwaitConsumerProps {
  name?: string
  index?: number
  handler?: AwaitHandler
  animationClassName?: string
  animationDuration?: number
  onLoadingStart?: () => void
  onLoadingEnd?: () => void
  onError?: () => void
  children?: React.ReactElement | React.ReactElement[]
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
    handler,
    animationClassName,
    animationDuration,
    onLoadingStart,
    onLoadingEnd,
    onError,
    children,
    loadingView,
    errorView,
    ...htmlProps
  } = props

  const controller: AwaitHandler | undefined = handler
    ? handler
    : name
    ? useAwait(name, index)
    : undefined

  const ref = useRef<React.DetailedHTMLProps<any, any>>(null)

  const [minHeight, setMinHeight] = useState<number>()
  const [minWidth, setMinWidth] = useState<number>()

  useEffect(() => {
    switch (controller?.state) {
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
  }, [controller?.state])

  return (
    <AwaitContext.Consumer>
      {(state) => (
        <SwitchTransition mode={'out-in'}>
          <CSSTransition
            key={controller?.state ?? AwaitState.STANDBY}
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
              {controller?.isStateLoading() && (
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

              {controller?.isStateError() &&
                (errorView ?? (children as React.ReactElement) ?? <div />)}

              {((controller?.isStateStandby() ||
                controller?.isStateUndefined()) &&
                (children as React.ReactElement)) ?? <div />}
            </div>
          </CSSTransition>
        </SwitchTransition>
      )}
    </AwaitContext.Consumer>
  )
}

AwaitConsumer.propTypes = {
  name: PropTypes.string,
  index: PropTypes.number,
  handler: PropTypes.object,
  animationClassName: PropTypes.string,
  animationDuration: PropTypes.number,
  onLoadingStart: PropTypes.func,
  onLoadingEnd: PropTypes.func,
  onError: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element.isRequired),
  ]),
  loadingView: PropTypes.element,
  errorView: PropTypes.element,
}
