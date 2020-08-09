/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react'
import {TouchableHighlight} from 'react-native'
import PropTypes from 'prop-types'
import {Input} from 'react-native-elements'

export default class CustomInput extends Component {
  static propTypes = {
    value: PropTypes.any,
    onDataChange: PropTypes.func.isRequired,
    onPress: PropTypes.func,
  }

  getInputField = () => {
    if (
      this.props.onPress &&
      typeof this.props.onPress != 'undefined' &&
      this.props.isClickable
    ) {
      return (
        <TouchableHighlight
          activeOpacity={1.0}
          underlayColor='#dddddd'
          onPress={() => {
            if (
              this.props.onPress &&
              typeof this.props.onPress != 'undefined'
            ) {
              this.props.onPress()
            }
          }}>
          <Input
            {...this.props}
            onChangeText={text => {
              this.props.onDataChange(text)
            }}
            value={this.props.value ? this.props.value + '' : ''}
          />
        </TouchableHighlight>
      )
    } else {
      return (
        <Input
         {...this.props}
          onChangeText={text => {
            this.props.onDataChange(text)
          }}
          value={this.props.value ? this.props.value + '' : ''}
        />
      )
    }
  }

  render () {
    return this.getInputField()
  }
}
