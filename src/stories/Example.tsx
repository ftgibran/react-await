import React from 'react'
import {BarLoader} from 'react-spinners'
import {AwaitConsumer, AwaitProvider, useAwait} from '..'

import '../../styles/effect.css'

export function ExampleConsumer() {
  const test = useAwait('test')

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
      State: {test.state}
      <AwaitConsumer
        name={'test'}
        animationDuration={400}
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
