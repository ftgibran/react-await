import React from 'react'
import {BarLoader} from 'react-spinners'
import {
  AwaitConsumer,
  AwaitProvider,
  AwaitState,
  useAsync,
  useAwait,
} from '../src'

import '../styles/effect.css'

export function ExampleConsumer() {
  const {loader: loader1, controller: controller1} = useAwait('test1')
  const {loader: loader2, controller: controller2} = useAwait()
  const {loader: handler3, controller: controller3} = useAwait()

  const runFakeSuccess = React.useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 4000))
    return 'success'
  }, [])

  const runFakeError = React.useCallback(async () => {
    await new Promise((_resolve, reject) => setTimeout(reject, 4000))
  }, [])

  const {data} = useAsync(runFakeSuccess, {
    controller: controller3,
    initialData: 'wait',
    delay: 5000,
  })

  // const [data, setData] = React.useState('wait')
  // React.useEffect(() => {
  //   const fetch = async () => {
  //     await new Promise((resolve) => setTimeout(resolve, 4000))
  //     return 'success'
  //   }
  //
  //   controller3.run(fetch).then(setData)
  //
  //   console.log('fetch')
  // }, [controller3])

  const stringifyState = () => {
    switch (loader1.state) {
      case AwaitState.LOADING:
        return 'Loading'
      case AwaitState.STANDBY:
        return 'Standby'
      case AwaitState.ERROR:
        return 'Error'
      default:
        return 'Unset'
    }
  }

  const CustomButton = () => (
    <div style={{marginBottom: 20}}>
      <button
        onClick={() => controller1.run(runFakeSuccess)}
        style={{marginBottom: 20}}
      >
        Fake Success
      </button>

      <button onClick={() => controller1.run(runFakeError)}>Fake Error</button>
    </div>
  )

  return (
    <>
      <div style={{marginBottom: 10}}>State: {stringifyState()}</div>

      <AwaitConsumer
        loader={loader1}
        style={{width: 300, backgroundColor: '#eee', marginBottom: 10}}
        errorView={
          <div>
            <CustomButton />
            Error!
          </div>
        }
      >
        <CustomButton />

        <div style={{textAlign: 'center'}}>This content will be load</div>
      </AwaitConsumer>

      <AwaitConsumer
        loader={loader2}
        style={{width: 300, backgroundColor: '#eee', marginBottom: 10}}
        loadingView={<div>custom loader...</div>}
      >
        <button onClick={() => controller2.run(runFakeSuccess)}>
          Another Fake
        </button>
      </AwaitConsumer>

      <AwaitConsumer
        loader={handler3}
        style={{width: 300, backgroundColor: '#eee'}}
      >
        <div>Loaded on start - {data}</div>
      </AwaitConsumer>
    </>
  )
}

export function ExampleProvider() {
  return (
    <AwaitProvider defaultLoadingView={<BarLoader />}>
      <ExampleConsumer />
    </AwaitProvider>
  )
}
