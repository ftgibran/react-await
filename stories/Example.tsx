import React from 'react'
import {BarLoader} from 'react-spinners'
import {AwaitConsumer, AwaitProvider, AwaitState, useAwait} from '../src'

import '../styles/effect.css'

export function ExampleConsumer() {
  const test = useAwait('test')

  const stringifyState = () => {
    switch (test.state) {
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

  const runFakeSuccess = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }

  const runFakeError = async () => {
    await new Promise((_resolve, reject) => setTimeout(reject, 2000))
  }

  const renderButtons = () => (
    <div style={{marginBottom: 20}}>
      <button
        onClick={() => test.run(runFakeSuccess)}
        style={{marginBottom: 20}}
      >
        Fake Success
      </button>

      <button onClick={() => test.run(runFakeError)}>Fake Error</button>
    </div>
  )

  return (
    <>
      <div style={{marginBottom: 10}}>State: {stringifyState()}</div>

      <AwaitConsumer
        name={'test'}
        style={{width: 300, backgroundColor: '#eee'}}
        errorView={<div>{renderButtons()}Error!</div>}
      >
        {renderButtons()}

        <div style={{textAlign: 'center'}}>This content will be load</div>
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
