# React Await

A loading indicator react component based on Promises.

The structure uses Context and Hookers in order to use it in different parts of code.

## Features

- Good functionality with hookers and consumer components
- Fade effects preset
- Customizable fade effects
- Customizable loaders
- Handling error scenarios
- Full typescript integration

## Getting Started

```shell
npm i @dev-plus-plus/react-await react react-dom react-transition-group prop-types
```

or simply

```shell
npm i @dev-plus-plus/react-await
```

Optionally, you may include the custom fade effects

```js
import '@dev-plus-plus/react-await/styles/effect.css'
```

## Basic Usage

First, you need to include `<AwaitProvider>` to state a context.
Everything inside can be triggered by `useAwait` hooker.
The visual effect is affected by `<AwaitConsumer>`

Normally, `<AwaitProvider>` stay in the App file:

```tsx
import '@dev-plus-plus/react-await/styles/effect.css'

import {AwaitProvider, AwaitConsumer, useAwait} from '@dev-plus-plus/react-await'

function App() {
  //...

  return (
    <AwaitProvider>
      <AnyOtherComponent />
    </AwaitProvider>
  )
}

function AnyOtherComponent() {
  const fakeAwait = useAwait('fake') // set the name of consumer

  const runFakeSuccess = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }

  const runFakeError = async () => {
    await new Promise((_resolve, reject) => setTimeout(reject, 2000))
  }

  const renderButtons = () => (
    <div>
      <button onClick={() => fakeAwait.run(runFakeSuccess)}>Fake Success</button>
      <button onClick={() => fakeAwait.run(runFakeError)}>Fake Error</button>
    </div>
  )

  return (
    <>
      State: {fakeAwait.state}

      <AwaitConsumer
        name={'fake'} // required
        animationClassName={'fade'} // default fade-blur
        animationDuration={400} // default 400
        onLoadingStart={() => alert('Triggered event - loading start')}
        onLoadingEnd={() => alert('Triggered event - loading end')}
        onError={() => alert('Triggered event - error')}
        loadingView={<div>Now loading...</div>}
        errorView={<div>{renderButtons()}Error!</div>}
        style={{width: 300, backgroundColor: '#eee'}}
      >
        {renderButtons()}

        <div>This content will be load</div>
      </AwaitConsumer>
    </>
  )
}
```

## Set a default loader and fade effects

This library doesn't include loaders, but I strongly recommended to use `react-spinners`.

You may also determine the default fade effects presets or use your own.
The available effects are: `fade`, `fade-blur`, `fade-up`, `fade-down`, `fade-left`, `fade-right`.
Default is `fade-blur`.

The duration of effects can be also changed, but you have to change both in effect css file and `defaultAnimationDuration` prop.
Default is `400`.

Here is an example of a customization:

```tsx
import '@dev-plus-plus/react-await/styles/effect.css'

import {AwaitProvider, AwaitConsumer, useAwait} from '@dev-plus-plus/react-await'
import {BarLoader} from 'react-spinners'

function App() {
  //...

  return (
    <AwaitProvider
      defaultLoadingView={<BarLoader />}
      defaultAnimationClassName={'fade'}
      defaultAnimationDuration={400}
    >
      ...
    </AwaitProvider>
  )
}
```

## useAwait methods and properties

### Usage

```tsx
useAwait(name, index)
```

| name | index (optional) |
|---|---|
| The name of consumer | The index of consumer in case the consumer is inside a list |

### The state property
Returns the current state of loader represented by enum.
The available states are: `LOADING`, `STANDBY`, `ERROR`.
If the state is undefined that means the consumer never started.

### The stateRecord property
Returns a dictionary of all states registered.
The key is the name of the consumer and the value is the current state.

### getFullName method
Returns the full name of consumer.
Normally, the full name is the real name.
The exception is when the index is set.

### isStateUndefined method
Returns true if the state is undefined

### isStateStandby method
Returns true if the state is Standby

### isStateLoading method
Returns true if the state is Loading

### isStateError method
Returns true if the state is Error

### init method
Starts to load.

Example:
```tsx
// ...
const testAwait = useAwait('test')

useEffect(() => {
  testAwait.init() // start to load when the component mounts
}, [])
// ...
```

### done method
Finish the loading.

Example:
```tsx
// ...
const testAwait = useAwait('test')

useEffect(() => {
  run()
}, [])

async function run() {
  testAwait.init()
  await new Promise((resolve) => setTimeout(resolve, 1000))
  testAwait.done() // end to load after 1 second
}
// ...
```

### error method
Finish the loading with error.

Example:
```tsx
// ...
const testAwait = useAwait('test')

useEffect(() => {
  run()
}, [])

async function run() {
  testAwait.init()
  await new Promise((resolve) => setTimeout(resolve, 1000))
  testAwait.error() // end to load with after 1 second
}
// ...
```

### run method
Starts to load, then finish the loading with success or error state.

Example:
```tsx
// ...
const testAwait = useAwait('test')

useEffect(() => {
  testAwait.run(() => Promise.resolve(), delay = 1000)
}, [])
// ...
```
