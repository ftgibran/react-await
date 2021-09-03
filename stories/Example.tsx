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
  const awaitHandler1 = useAwait('test1')
  const awaitHandler2 = useAwait('test2')
  const awaitHandler3 = useAwait('test3')

  const runFakeSuccess = async () => {
    await new Promise((resolve) => setTimeout(resolve, 4000))
  }

  const runFakeError = async () => {
    await new Promise((_resolve, reject) => setTimeout(reject, 4000))
  }

  useAsync(runFakeSuccess, {
    awaitHandler: awaitHandler3,
    delay: 5000,
  })

  const stringifyState = () => {
    switch (awaitHandler1.state) {
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
        onClick={() => awaitHandler1.run(runFakeSuccess)}
        style={{marginBottom: 20}}
      >
        Fake Success
      </button>

      <button onClick={() => awaitHandler1.run(runFakeError)}>
        Fake Error
      </button>
    </div>
  )

  return (
    <>
      <div style={{marginBottom: 10}}>State: {stringifyState()}</div>

      <AwaitConsumer
        handler={awaitHandler1}
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
        handler={awaitHandler2}
        style={{width: 300, backgroundColor: '#eee', marginBottom: 10}}
        loadingView={<div>custom loader...</div>}
      >
        <button onClick={() => awaitHandler2.run(runFakeSuccess)}>
          Another Fake
        </button>
      </AwaitConsumer>

      <AwaitConsumer
        handler={awaitHandler3}
        style={{width: 300, backgroundColor: '#eee'}}
      >
        <div>Loaded on start</div>
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
