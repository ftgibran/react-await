import React from 'react'

export interface AwaitLoaderContainerProps {
  fallback?: React.ReactNode
  useContainer?: boolean
  minWidth?: number
  minHeight?: number
}

export const AwaitLoaderContainer: React.FC<AwaitLoaderContainerProps> = (
  props
) => {
  const {children, fallback, useContainer, minWidth, minHeight} = props

  const value = React.useMemo(
    () => children ?? fallback ?? <div>Loading...</div>,
    [children, fallback]
  )

  if (useContainer) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight,
          minWidth,
        }}
      >
        {value}
      </div>
    )
  }

  return <React.Fragment children={value} />
}
