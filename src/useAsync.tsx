import {useCallback, useEffect, useRef, useState} from 'react'
import type {AwaitHandler} from './types'

export interface UseAsyncProps<T, I extends T | undefined, P> {
  initialData?: I
  awaitHandler?: AwaitHandler
  delay?: number
  params?: P
}

export function useAsync<T, I extends T | undefined, P>(
  asyncFunc: (params: P) => Promise<T>,
  props: UseAsyncProps<T, I, P> = {}
) {
  const {awaitHandler, delay, params, initialData} = props

  const [data, setData] = useState<T | I>(initialData as T)
  const [error, setError] = useState<any | null>(null)

  const mountedRef = useRef(true)

  const fetch = useCallback(() => {
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

  useEffect(() => {
    if (awaitHandler) {
      awaitHandler.run(fetch, delay)
    } else {
      fetch()
    }

    return () => {
      mountedRef.current = false
    }
  }, [])

  return {
    data,
    error,
    fetch,
  }
}
