import React, {useEffect, useState} from 'react'
import {render, cleanup, waitFor} from '@testing-library/react'
import {
  AwaitConsumer,
  AwaitConsumerProps,
  AwaitProvider,
  AwaitState,
  useAwait,
} from '../src'

interface ContextProps {
  hooker: React.ReactElement
}

describe('AwaitContext', () => {
  afterEach(() => cleanup())

  const name = 'test'
  let index: number | undefined = undefined

  const Context = (
    props: ContextProps & Omit<AwaitConsumerProps, 'name' | 'index'>
  ) => {
    const {hooker, ...awaitConsumerProps} = props

    return (
      <AwaitProvider
        defaultLoadingView={<div data-testid={'loading'}>Default loading</div>}
        defaultAnimationClassName={'default-test'}
        defaultAnimationDuration={11}
      >
        {hooker}
        <AwaitConsumer name={name} index={index} {...awaitConsumerProps}>
          <div data-testid={'standby'}>Standby</div>
        </AwaitConsumer>
      </AwaitProvider>
    )
  }

  it('matches initial state', async () => {
    const Hooker = () => {
      const testAwait = useAwait(name, index)

      useEffect(() => {
        expect(testAwait.getFullName()).toEqual(name)
        expect(testAwait.state).toBeUndefined()
      }, [])

      return <React.Fragment />
    }

    const {asFragment} = render(<Context hooker={<Hooker />} />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('matches loading state', async () => {
    const Hooker = () => {
      const testAwait = useAwait(name, index)
      const [mounted, setMounted] = useState(false)

      useEffect(() => {
        testAwait.init()
        expect(testAwait.getFullName()).toEqual(name)
        setMounted(true)
      }, [])

      useEffect(() => {
        if (mounted) {
          expect(testAwait.state).toBe(AwaitState.LOADING)
        }
      }, [mounted])

      return <React.Fragment />
    }

    const {asFragment, getByTestId} = render(<Context hooker={<Hooker />} />)

    await waitFor(() => getByTestId('loading'))

    expect(asFragment()).toMatchSnapshot()
  })

  it('matches standby state', async () => {
    const Hooker = () => {
      const testAwait = useAwait(name, index)
      const [done, setDone] = useState(false)

      const run = async () => {
        expect(testAwait.getFullName()).toEqual(name)
        expect(testAwait.state).toBeUndefined()
        await testAwait.run(() => Promise.resolve(), 100)
        setDone(true)
      }

      useEffect(() => {
        run()
      }, [])

      useEffect(() => {
        if (done) {
          expect(testAwait.state).toBe(AwaitState.STANDBY)
        }
      }, [done])

      return <React.Fragment />
    }

    const {asFragment, getByTestId} = render(<Context hooker={<Hooker />} />)

    await waitFor(() => getByTestId('loading'))
    await waitFor(() => getByTestId('standby'))

    expect(asFragment()).toMatchSnapshot()
  })

  it('matches error state', async () => {
    const Hooker = () => {
      const testAwait = useAwait(name, index)
      const [done, setDone] = useState(false)

      const run = async () => {
        expect(testAwait.getFullName()).toEqual(name)
        expect(testAwait.state).toBeUndefined()
        try {
          await testAwait.run(() => Promise.reject(), 100)
        } catch {
          /**/
        }
        setDone(true)
      }

      useEffect(() => {
        run()
      }, [])

      useEffect(() => {
        if (done) {
          expect(testAwait.state).toBe(AwaitState.ERROR)
        }
      }, [done])

      return <React.Fragment />
    }

    const {asFragment, getByTestId} = render(
      <Context
        hooker={<Hooker />}
        errorView={<div data-testid={'error'}>Error</div>}
      />
    )

    await waitFor(() => getByTestId('loading'))
    await waitFor(() => getByTestId('error'))

    expect(asFragment()).toMatchSnapshot()
  })

  it('can use index', async () => {
    index = 0

    const Hooker = () => {
      const testAwait = useAwait(name, index)
      const [mounted, setMounted] = useState(false)

      useEffect(() => {
        expect(testAwait.getFullName()).toEqual(`${name}__${index}`)
        testAwait.init()
        setMounted(true)
      }, [])

      useEffect(() => {
        if (mounted) {
          expect(testAwait.stateRecord[testAwait.getFullName()]).toBe(
            AwaitState.LOADING
          )
        }
      }, [mounted])

      return <React.Fragment />
    }

    render(<Context hooker={<Hooker />} />)
  })

  it('can use extra settings', async () => {
    const Hooker = () => {
      const testAwait = useAwait(name, index)
      const [done, setDone] = useState(false)

      useEffect(() => {
        run1()
      }, [])

      useEffect(() => {
        if (done) {
          run2()
        }
      }, [done])

      const run1 = async () => {
        await testAwait.run(() => Promise.resolve(), 100)
        await new Promise((resolve) => setTimeout(resolve, 100))
        setDone(true)
      }

      const run2 = async () => {
        try {
          await testAwait.run(() => Promise.reject(), 100)
        } catch {
          /**/
        }
      }

      return <React.Fragment />
    }

    let loadingStartCount = 0
    let loadingEndCount = 0
    let errorCount = 0

    const {asFragment, getByTestId} = render(
      <Context
        hooker={<Hooker />}
        loadingView={
          <div data-testid={'forced-loading'}>Forced loading view</div>
        }
        errorView={<div data-testid={'error'}>Error</div>}
        animationClassName={'test'}
        animationDuration={22}
        onLoadingStart={() => loadingStartCount++}
        onLoadingEnd={() => loadingEndCount++}
        onError={() => errorCount++}
      />
    )

    await waitFor(() => getByTestId('forced-loading'))

    expect(asFragment()).toMatchSnapshot()

    await waitFor(() => getByTestId('standby'))
    await waitFor(() => getByTestId('forced-loading'))
    await waitFor(() => getByTestId('error'))

    expect(loadingStartCount).toEqual(2)
    expect(loadingStartCount).toEqual(2)
    expect(loadingEndCount).toEqual(1)
  })
})
