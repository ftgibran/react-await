import React from 'react'
import {render, cleanup, waitFor} from '@testing-library/react'
import {
  AwaitConsumer,
  AwaitConsumerProps,
  AwaitProvider,
  AwaitState,
  useAwait,
} from '../src'

type ContextProps = Omit<AwaitConsumerProps, 'loader'>

describe('AwaitContext', () => {
  afterEach(() => cleanup())

  const name = 'test'
  let index: number | undefined = undefined

  const App: React.FC<ContextProps> = (props) => {
    const {children, ...rest} = props

    return (
      <AwaitProvider
        defaultLoadingView={<div data-testid={'loading'}>Default loading</div>}
        defaultAnimationClassName={'default-test'}
        defaultAnimationDuration={11}
      >
        {children}

        <AppChild {...rest} />
      </AwaitProvider>
    )
  }

  const AppChild: React.FC<Omit<AwaitConsumerProps, 'loader'>> = (props) => {
    const {...rest} = props
    const {loader} = useAwait(name, index)

    return (
      <AwaitConsumer {...rest} loader={loader}>
        <div data-testid={'standby'}>Standby</div>
      </AwaitConsumer>
    )
  }

  it('matches initial state', async () => {
    const Hooker: React.FC = () => {
      const {loader} = useAwait(name, index)

      React.useEffect(() => {
        expect(loader.fullName).toEqual(name)
        expect(loader.state).toBeUndefined()
      }, [loader.fullName, loader.state])

      return <React.Fragment />
    }

    const {asFragment} = render(<App children={<Hooker />} />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('matches loading state', async () => {
    const Hooker = () => {
      const {loader, controller} = useAwait(name, index)
      const [mounted, setMounted] = React.useState(false)

      React.useEffect(() => {
        controller.init()
        expect(loader.fullName).toEqual(name)
        expect(loader.state).toBeUndefined()
        setMounted(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [controller])

      React.useEffect(() => {
        if (mounted) {
          expect(loader.state).toBe(AwaitState.LOADING)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [mounted])

      return <React.Fragment />
    }

    const {asFragment, getByTestId} = render(<App children={<Hooker />} />)

    await waitFor(() => getByTestId('loading'))

    expect(asFragment()).toMatchSnapshot()
  })

  it('matches standby state', async () => {
    const Hooker = () => {
      const {loader, controller} = useAwait(name, index)
      const [done, setDone] = React.useState(false)

      React.useEffect(() => {
        const run = async () => {
          expect(loader.fullName).toEqual(name)
          expect(loader.state).toBeUndefined()
          await controller.run(() => Promise.resolve(), 100)
          setDone(true)
        }

        run()
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [controller])

      React.useEffect(() => {
        if (done) {
          expect(loader.state).toBe(AwaitState.STANDBY)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [done])

      return <React.Fragment />
    }

    const {asFragment, getByTestId} = render(<App children={<Hooker />} />)

    await waitFor(() => getByTestId('loading'))
    await waitFor(() => getByTestId('standby'))

    expect(asFragment()).toMatchSnapshot()
  })

  it('matches error state', async () => {
    const Hooker = () => {
      const {loader, controller} = useAwait(name, index)
      const [done, setDone] = React.useState(false)

      React.useEffect(() => {
        const run = async () => {
          expect(loader.fullName).toEqual(name)
          expect(loader.state).toBeUndefined()
          try {
            await controller.run(() => Promise.reject(), 100)
          } catch {
            /**/
          }
          setDone(true)
        }

        run()
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [controller])

      React.useEffect(() => {
        if (done) {
          expect(loader.state).toBe(AwaitState.ERROR)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [done])

      return <React.Fragment />
    }

    const {asFragment, getByTestId} = render(
      <App
        children={<Hooker />}
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
      const {loader, controller, record} = useAwait(name, index)
      const [mounted, setMounted] = React.useState(false)

      React.useEffect(() => {
        expect(loader.fullName).toEqual(`${name}__${index}`)
        controller.init()
        setMounted(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [controller])

      React.useEffect(() => {
        if (mounted) {
          expect(record[loader.fullName]).toBe(AwaitState.LOADING)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [mounted])

      return <React.Fragment />
    }

    render(<App children={<Hooker />} />)
  })

  it('can use mountedBeforeStandby = false', async () => {
    const Hooker: React.FC = () => {
      const {controller} = useAwait(name, index)

      React.useEffect(() => {
        const run = async () => {
          await controller.run(() => Promise.resolve(), 100)
          await new Promise((resolve) => setTimeout(resolve, 100))
        }

        run()
      }, [controller])

      return <React.Fragment />
    }

    const {asFragment} = render(
      <App children={<Hooker />} mountedBeforeStandby={false} />
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('can use extra settings', async () => {
    const Hooker = () => {
      const {controller} = useAwait(name, index)
      const [done, setDone] = React.useState(false)

      React.useEffect(() => {
        const run1 = async () => {
          await controller.run(() => Promise.resolve(), 100)
          await new Promise((resolve) => setTimeout(resolve, 100))
          setDone(true)
        }

        run1()
      }, [controller])

      React.useEffect(() => {
        const run2 = async () => {
          try {
            await controller.run(() => Promise.reject(), 100)
          } catch {
            /**/
          }
        }

        if (done) {
          run2()
        }
      }, [controller, done])

      return <React.Fragment />
    }

    let loadingStartCount = 0
    let loadingEndCount = 0
    let errorCount = 0

    const {asFragment, getByTestId} = render(
      <App
        children={<Hooker />}
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
