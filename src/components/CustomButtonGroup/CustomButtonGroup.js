/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react'
import {View} from 'react-native'
import {ButtonGroup, Text} from 'react-native-elements'
import PropTypes from 'prop-types'

export default class CustomButtonGroup extends Component {
  constructor (props) {
    super(props)
  }
  static propTypes = {
    buttons: PropTypes.array,
    value: PropTypes.any,
  }
  static defaultProps = {
    buttons: [],
    value: '0',
  }
  updateIndex = selectedIndex => {
    this.props.onDataChange(selectedIndex + '')
  }

  render () {
    return (
      <View>
        <Text {...this.props}>{this.props.label}</Text>
        <ButtonGroup
          {...this.props}
          onPress={this.updateIndex}
          selectedIndex={parseInt(this.props.value)}
          buttons={this.props.buttons}
        />
      </View>
    )
  }
}
