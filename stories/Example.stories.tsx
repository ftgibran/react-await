import React from 'react'
import {ExampleProvider} from './Example'

export default {
  title: 'Example',
  component: ExampleProvider,
  argTypes: {},
}

const Template = () => <ExampleProvider />

export const Default = Template.bind({})
Default.args = {}
