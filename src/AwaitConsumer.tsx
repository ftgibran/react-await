import React from 'react'
import {CSSTransition, SwitchTransition} from 'react-transition-group'
import {AwaitContext} from './AwaitContext'
import {AwaitLoaderContainer} from './AwaitLoaderContainer'
import {AwaitState, AwaitLoader} from './types'

const defaultAnimationClassName = 'fade-blur'
const defaultAnimationDuration = 400

type HTMLProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>

export interface AwaitConsumerProps extends HTMLProps {
  loader: AwaitLoader
  animationClassName?: string
  animationDuration?: number
  onLoadingStart?: () => void
  onLoadingEnd?: () => void
  onError?: () => void
  loadingView?: React.ReactNode
  errorView?: React.ReactNode
  keepDimensions?: boolean
  mountedBeforeStandby?: boolean
}

export const AwaitConsumer: React.FC<AwaitConsumerProps> = (props) => {
  const {
    loader,
    animationClassName,
    animationDuration,
    onLoadingStart,
    onLoadingEnd,
    onError,
    children,
    loadingView,
    errorView,
    keepDimensions = true,
    mountedBeforeStandby = true,
    ...rest
  } = props

  const ref = React.useRef<React.DetailedHTMLProps<any, any>>(null)

  const [minHeight, setMinHeight] = React.useState<number>()
  const [minWidth, setMinWidth] = React.useState<number>()

  const isUnset = React.useMemo(() => loader.isUnset, [loader.isUnset])
  const isLoading = React.useMemo(() => loader.isLoading, [loader.isLoading])
  const isStandby = React.useMemo(() => loader.isStandby, [loader.isStandby])
  const isError = React.useMemo(() => loader.isError, [loader.isError])

  const isReady = React.useMemo(() => {
    return mountedBeforeStandby ? isStandby || isUnset : isStandby
  }, [isStandby, isUnset, mountedBeforeStandby])

  React.useEffect(() => {
    switch (loader.state) {
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
  }, [loader.state, onError, onLoadingEnd, onLoadingStart])

  return (
    <AwaitContext.Consumer>
      {(state) => (
        <SwitchTransition mode={'out-in'}>
          <CSSTransition
            nodeRef={ref}
            key={loader.state ?? AwaitState.STANDBY}
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
            unmountOnExit={true}
            appear={true}
          >
            <div ref={ref} {...rest}>
              {isLoading && (
                <AwaitLoaderContainer
                  children={loadingView}
                  fallback={state.defaultLoadingView}
                  useContainer={keepDimensions}
                  minWidth={minWidth}
                  minHeight={minHeight}
                />
              )}

              {isError && (errorView ?? children)}

              {isReady && children}
            </div>
          </CSSTransition>
        </SwitchTransition>
      )}
    </AwaitContext.Consumer>
  )
}
