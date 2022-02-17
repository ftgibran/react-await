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
    ...rest
  } = props

  const ref = React.useRef<React.DetailedHTMLProps<any, any>>(null)

  const [minHeight, setMinHeight] = React.useState<number>()
  const [minWidth, setMinWidth] = React.useState<number>()

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
              {loader.isLoading && (
                <AwaitLoaderContainer
                  children={loadingView}
                  fallback={state.defaultLoadingView}
                  useContainer={keepDimensions}
                  minWidth={minWidth}
                  minHeight={minHeight}
                />
              )}

              {loader.isError && (errorView ?? children)}

              {(loader.isStandby || loader.isUnset) && children}
            </div>
          </CSSTransition>
        </SwitchTransition>
      )}
    </AwaitContext.Consumer>
  )
}
