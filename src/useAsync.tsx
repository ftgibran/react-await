import React from 'react'
import {AwaitController} from './types'

export interface UseAsyncProps<T, I extends T | undefined, P> {
  initialData?: I
  params?: P
  immediate?: boolean
  controller?: AwaitController
  delay?: number
}

export function useAsync<T, I extends T | undefined, P>(
  asyncFunc: (params: P) => Promise<T>,
  props: UseAsyncProps<T, I, P> = {}
) {
  const {initialData, params, immediate = true, controller, delay} = props

  const [data, setData] = React.useState<T | I>(initialData as T)
  const [error, setError] = React.useState<any | null>(null)

  const mountedRef = React.useRef(true)

  const fetch = React.useCallback(() => {
    return asyncFunc(params as P)
      .then((response) => {
        if (!mountedRef.current) return null
        setData(response)
        setError(null)
        return response
      })
      .catch((err) => {
        if (!mountedRef.current) return null
        setError(err)
        throw err
      })
  }, [asyncFunc, params])

  React.useEffect(() => {
    if (immediate) {
      if (controller) {
        controller.run(fetch, delay).then()
      } else {
        fetch().then()
      }
    }

    return () => {
      mountedRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    data,
    error,
    fetch,
  }
}
