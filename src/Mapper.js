/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react'
import {View, ScrollView, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import UInput from './UInput'
import cloneDeep from 'lodash/cloneDeep'
export function isVertical (name) {
  return isNaN(name.split('h')[1] ? name.split('h')[1] : name)
}

export function validateFields (fields) {
  let fs = cloneDeep(fields)
  for (let [rKey, rValue] of Object.entries(fields)) {
    if (isVertical(rKey)) {
      if (typeof rValue.hide == 'undefined' || !rValue.hide) {
        if (fs[rKey].validate && fs[rKey].validate != null) {
          fs[rKey] = fs[rKey].validate(fs[rKey])
        }
      }
    } else {
      for (let [cKey, cValue] of Object.entries(rValue)) {
        if (typeof cValue.hide == 'undefined' || !cValue.hide) {
          if (fs[rKey][cKey].validate && fs[rKey][cKey].validate != null) {
            fs[rKey][cKey] = fs[rKey][cKey].validate(fs[rKey][cKey])
          }
        }
      }
    }
  }
  return fs
}

export function getValuesAfterValidation (fields) {
  let errors = []
  let values = {}
  let fs = cloneDeep(fields)
  for (let [rKey, rValue] of Object.entries(fields)) {
    if (isVertical(rKey)) {
      if (typeof rValue.hide == 'undefined' || !rValue.hide) {
        if (fs[rKey].validate && fs[rKey].validate != null) {
          fs[rKey] = fs[rKey].validate(fs[rKey])
          if (
            typeof fs[rKey].componentOptions.errorMessage != 'undefined' &&
            fs[rKey].componentOptions.errorMessage != null
          ) {
            errors.push(fs[rKey].componentOptions.errorMessage)
          }
        }

        if (rValue.useValue != null) {
          values[rKey] = rValue.useValue(rValue.value)
        } else {
          values[rKey] = rValue.value
        }
      }
    } else {
      for (let [cKey, cValue] of Object.entries(rValue)) {
        if (typeof cValue.hide == 'undefined' || !cValue.hide) {
          if (fs[rKey][cKey].validate && fs[rKey][cKey].validate != null) {
            fs[rKey][cKey] = fs[rKey][cKey].validate(fs[rKey][cKey])
            if (
              typeof fs[rKey][cKey].componentOptions.errorMessage !=
                'undefined' &&
              fs[rKey][cKey].componentOptions.errorMessage != null
            ) {
              errors.push(fs[rKey][cKey].componentOptions.errorMessage)
            }
          }

          if (cValue.useValue != null) {
            values[cKey] = cValue.useValue(cValue.value)
          } else {
            values[cKey] = cValue.value
          }
        }
      }
    }
  }

  if (errors.length == 0) {
    return values
  } else {
    console.log(errors)
    return null
  }
}

export default class FM extends Component {
  constructor (props) {
    super(props)
    this.state = {
      fields: this.props.fieldsMap,
    }
  }
  static propTypes = {
    fieldsMap: PropTypes.any.isRequired,
    onDataChange: PropTypes.func.isRequired,
  }

  resultChangeFields = fields => {
    this.setState(
      {
        fields: fields,
      },
      () => this.props.onDataChange(this.state, this.enableButton(fields)),
    )
  }

  getValue = field => {
    if (
      typeof field.showValue != 'undefined' &&
      typeof field.showValue === 'function'
    ) {
      return field.showValue(field.value)
    } else {
      return field.value + ''
    }
  }

  enableButton = stateFields => {
    let enable = 0
    for (let [rName, rValue] of Object.entries(stateFields)) {
      if (isVertical(rName) && stateFields[rName]) {
        if (
          typeof rValue != 'undefined' &&
          typeof rValue.required != 'undefined' &&
          rValue.required
        ) {
          if (!rValue.value) {
            enable++
          }
        }
      } else {
        for (let [cName, cValue] of Object.entries(rValue)) {
          if (
            typeof cValue != 'undefined' &&
            typeof cValue.required != 'undefined' &&
            cValue.required
          ) {
            if (!cValue.value) {
              enable++
            }
          }
        }
      }
    }
    if (enable == 0) {
      return true
    } else {
      return false
    }
  }

  performLinkComponent = (stateFields, link) => {
    if (link.name == '*') {
      Object.keys(stateFields).forEach(rName => {
        if (stateFields[rName] && isVertical(rName)) {
          for (let [k, v] of Object.entries(link.execute)) {
            if (k != 'linkComponent') {
              if (k == 'animate' || k == 'hide') {
                stateFields[rName][k] = v
              } else {
                stateFields[rName].componentOptions[k] = v
              }
            }
          }
        } else {
          Object.keys(stateFields[rName]).forEach(cName => {
            for (let [k, v] of Object.entries(link.execute)) {
              if (k != 'linkComponent') {
                if (k == 'animate' || k == 'hide') {
                  stateFields[rName][cName][k] = v
                } else {
                  stateFields[rName][cName].componentOptions[k] = v
                }
              }
            }
          })
        }
      })
    } else if (link.name != '*' && stateFields[link.name]) {
      for (let [k, v] of Object.entries(link.execute)) {
        if (k != 'linkComponent') {
          if (k == 'animate' || k == 'hide') {
            stateFields[link.name][k] = v
          } else {
            stateFields[link.name].componentOptions[k] = v
          }
        }
      }
    } else {
      for (let [k, v] of Object.entries(link.execute)) {
        if (k != 'linkComponent') {
          if (k == 'animate' || k == 'hide') {
            let horizontal = link.name.split(':')
            stateFields[horizontal[0]][horizontal[1]][k] = v
          } else {
            let horizontal = link.name.split(':')
            stateFields[horizontal[0]][horizontal[1]].componentOptions[k] = v
          }
        }
      }
    }
    this.scrollViewRef.scrollToEnd({animated: true, duration: 1000})
    return stateFields
  }

  componentDidMount () {
    let stateFields = this.state.fields
    for (let [rKey, rValue] of Object.entries(stateFields)) {
      if (isVertical(rKey) && rValue != null) {
        if (
          rValue.componentOptions &&
          rValue.linkComponent &&
          rValue.linkComponent.length > 0
        ) {
          rValue.linkComponent.filter(link => {
            if (link.condition(rValue)) {
              stateFields = this.performLinkComponent(stateFields, link)
            }
          })
        }
      } else {
        for (let [cKey, cValue] of Object.entries(rValue)) {
          if (
            cValue.componentOptions &&
            cValue.linkComponent &&
            cValue.linkComponent.length > 0
          ) {
            cValue.linkComponent.filter(link => {
              if (link.condition(cValue)) {
                stateFields = this.performLinkComponent(stateFields, link)
              }
            })
          }
        }
      }
    }
    this.resultChangeFields(stateFields)
  }

  mapper = fieldsMap => {
    let rows = []
    for (let [rKey, rValue] of Object.entries(fieldsMap)) {
      if (isVertical(rKey)) {
        rows.push(
          <UInput
            key={rKey}
            name={rKey}
            value={this.getValue(rValue)}
            component={rValue.component}
            type={rValue.type}
            animate={
              this.props.disableAnimations
                ? null
                : rValue.animate
                ? rValue.animate
                : null
            }
            hide={rValue.hide ? rValue.hide : false}
            componentOptions={{
              ...rValue.componentOptions,
              ...{
                onPress: () => {
                  let stateFields = this.state.fields
                  if (
                    rValue.componentOptions &&
                    rValue.componentOptions.onPress &&
                    rValue.componentOptions.onPress != null &&
                    typeof rValue.componentOptions.onPress != 'undefined'
                  ) {
                    stateFields[rKey] = rValue.componentOptions.onPress(
                      stateFields[rKey],
                    )
                  }

                  this.resultChangeFields(stateFields)
                },
                onBackPress: () => {
                  let stateFields = this.state.fields
                  stateFields[rKey] = rValue.componentOptions.onBackPress(
                    stateFields[rKey],
                  )
                  this.resultChangeFields(stateFields)
                },
              },
            }}
            onDataChange={text => {
              let stateFields = this.state.fields
              if (rValue.onDataChange) {
                stateFields = rValue.onDataChange(stateFields, text)
              }
              if (rValue.validate) {
                rValue = rValue.validate(rValue)
              }
              if (rValue.linkComponent && rValue.linkComponent.length > 0) {
                rValue.linkComponent.filter(link => {
                  if (link.condition(rValue)) {
                    stateFields = this.performLinkComponent(stateFields, link)
                  }
                })
              }
              this.resultChangeFields(stateFields)
            }}
          />,
        )
      } else {
        let columns = []
        for (let [cKey, cValue] of Object.entries(rValue)) {
          columns.push(
            <UInput
              key={cKey}
              name={cKey}
              value={this.getValue(cValue)}
              component={cValue.component}
              type={cValue.type}
              animate={
                this.props.disableAnimations
                  ? null
                  : cValue.animate
                  ? cValue.animate
                  : null
              }
              hide={cValue.hide ? cValue.hide : false}
              componentOptions={{
                ...cValue.componentOptions,
                ...{
                  onPress: () => {
                    let stateFields = this.state.fields
                    if (
                      cValue.componentOptions &&
                      cValue.componentOptions.onPress &&
                      cValue.componentOptions.onPress != null &&
                      typeof cValue.componentOptions.onPress != 'undefined'
                    ) {
                      stateFields[rKey][cKey] = cValue.componentOptions.onPress(
                        stateFields[rKey][cKey],
                      )
                    }
                    this.resultChangeFields(stateFields)
                  },
                  onBackPress: () => {
                    let stateFields = this.state.fields
                    stateFields[rKey][
                      cKey
                    ] = cValue.componentOptions.onBackPress(
                      stateFields[rKey][cKey],
                    )
                    this.resultChangeFields(stateFields)
                  },
                },
              }}
              onDataChange={text => {
                let stateFields = this.state.fields
                if (cValue.onDataChange) {
                  stateFields = cValue.onDataChange(stateFields, text)
                }
                if (cValue.validate) {
                  cValue = cValue.validate(cValue)
                }
                if (cValue.linkComponent && cValue.linkComponent.length > 0) {
                  cValue.linkComponent.filter(link => {
                    if (link.condition(cValue)) {
                      stateFields = this.performLinkComponent(stateFields, link)
                    }
                  })
                }
                this.resultChangeFields(stateFields)
              }}
            />,
          )
        }
        rows.push(
          <View
            key={rKey}
            style={{
              flexDirection: 'row',
              justifyContent: this.props.center ? 'center' : 'flex-start',
            }}>
            {columns}
          </View>,
        )
      }
    }

    return rows
  }

  loadFields = () => {
    return this.mapper(this.props.fieldsMap)
  }
  setScrollViewRef = element => {
    this.scrollViewRef = element
  }
  render () {
    return (
      <ScrollView
        ref={this.setScrollViewRef}
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{
          alignItems: this.props.center ? 'center' : 'flex-start',
        }}>
        {this.loadFields()}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({})
