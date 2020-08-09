/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react'
import {View} from 'react-native'
import PropTypes from 'prop-types'
import * as Animatable from 'react-native-animatable'
import isEqual from 'lodash/isEqual'

import ButtonGroupPicker from './components/CustomButtonGroup/CustomButtonGroup'
import Input from './components/Input/Input'
import FullPhoneNumber from './components/FullPhoneNumber/FullPhoneNumber'

export default class UInput extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    component: PropTypes.string.isRequired,
    value: PropTypes.any,
    componentOptions: PropTypes.any.isRequired,
    onDataChange: PropTypes.func.isRequired,
  }

  shouldComponentUpdate (nextProps) {
    if (!isEqual(this.props, nextProps)) {
      return true
    }
    return false
  }

  getInputField = () => {
    if (this.props.hide) {
      return <View></View>
    } else {
      return (
        <Input
          navigation={this.props.navigation}
          {...this.props.componentOptions}
          value={this.props.value}
          onDataChange={item => {
            this.props.onDataChange(item)
          }}
          name={this.props.name}
        />
      )
    }
  }

  getUnitCategories = () => {
    if (this.props.hide) {
      return <View></View>
    } else {
      return (
        <ButtonGroupPicker
          navigation={this.props.navigation}
          {...this.props.componentOptions}
          value={this.props.value}
          onDataChange={item => {
            this.props.onDataChange(item)
          }}
          name={this.props.name}
        />
      )
    }
  }

  getFullPhoneNumberField = () => {
    if (this.props.hide) {
      return <View></View>
    } else {
      return (
        <FullPhoneNumber
          // navigation={this.props.navigation}
          {...this.props.componentOptions}
          value={this.props.value}
          onDataChange={item => {
            this.props.onDataChange(item)
          }}
          name={this.props.name}
        />
      )
    }
  }

  getField = () => {
    switch (this.props.component) {
      case 'input':
        return this.getInputField()
      case 'fullPhoneNumber':
        return this.getFullPhoneNumberField()
      case 'buttonGroup':
        return this.getUnitCategories()
      default:
        return <View></View>
    }
  }

  render () {
    return (
      <Animatable.View ref={this.props.animate && this.props.animate}>
        {this.getField()}
      </Animatable.View>
    )
  }
}
