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

  const fetch = React.useCallback(() => {
    return asyncFunc(params as P)
  }, [asyncFunc, params])

  React.useEffect(() => {
    if (immediate) {
      if (controller) {
        controller.run(fetch, delay).then(setData).catch(setError)
      } else {
        fetch().then(setData).catch(setError)
      }
    }
  }, [controller, delay, fetch, immediate])

  return {
    data,
    error,
    fetch,
  }
}
