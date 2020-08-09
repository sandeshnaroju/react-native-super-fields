/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react'
import {View, StyleSheet, FlatList} from 'react-native'
import PropTypes from 'prop-types'
import {
  Input,
  Button,
  Overlay,
  ListItem,
  SearchBar,
  Icon,
} from 'react-native-elements'
export default class FullPhoneNumber extends Component {
  static propTypes = {
    value: PropTypes.any,
    onDataChange: PropTypes.func.isRequired,
  }
  static defaultProps = {
    errorMessage: '',
    placeholder: 'Phone number',
  }

  con = []
  list = []
  phoneUtil = null

  constructor (props) {
    super(props)
    this.state = {
      isVisible: false,
      search: '',
      emoji: '🇮🇳',
      code: '+91',
    }
  }
  componentDidMount () {
    const countries = require('./countries/countries.json')
    this.con = countries['countries']
    this.list = this.con
  }
  selectCountry () {
    this.setState({
      isVisible: true,
    })
  }
  closeOverlay = () => this.setState({isVisible: false})

  selectedCountry (item) {
    this.setState({
      isVisible: false,
      emoji: item.emoji,
      code: item.phone,
    })
  }

  keyExtractor = (item, index) => index.toString()
  renderItem = ({item}) => (
    <ListItem
      title={item.name}
      subtitle={item.phone}
      leftAvatar={{title: item.emoji}}
      onPress={() => this.selectedCountry(item)}
      bottomDivider
    />
  )
  updateSearch = search => {
    this.list = this.con.filter(item => {
      const itemName = item.name.toLowerCase()
      const itemCode = item.phone.toLowerCase()
      const textData = search.toLowerCase()
      if (itemName.indexOf(textData) > -1 || itemCode.indexOf(textData) > -1)
        return true
    })
    this.setState({search})
  }

  inputTextChange = text => {
    const number = this.state.code + text
    this.props.onDataChange(number)
  }

  render () {
    const {search} = this.state
    return (
      <View style={styles.container}>
        <View style={styles.buttonViewStyle}>
          <Button
            buttonStyle={styles.buttonStyle}
            titleStyle={styles.buttonTitleStyle}
            title={this.state.emoji + ' ' + this.state.code}
            onPress={() => this.selectCountry()}
            containerStyle={styles.buttonContainerStyle}
          />
        </View>
        <View style={styles.inputViewStyle}>
          <Input
            inputContainerStyle={this.props.inputContainerStyle}
            keyboardType='number-pad'
            placeholder={this.props.placeholder}
            inputStyle={styles.inputStyle}
            containerStyle={[
              styles.inputContainerStyle,
              this.props.containerStyle,
            ]}
            onChangeText={text => this.inputTextChange(text)}
            errorMessage={this.props.errorMessage}
          />
        </View>
        <Overlay
          fullScreen
          isVisible={this.state.isVisible}
          onBackdropPress={this.closeOverlay}>
          <View>
            <Icon
              name='close'
              containerStyle={styles.iconContainerStyle}
              onPress={this.closeOverlay}
            />
            <SearchBar
              placeholder='Search by country or code '
              onChangeText={this.updateSearch}
              value={search}
              containerStyle={styles.searchBarContainerStyle}
              inputContainerStyle={styles.searchBarInputContainerStyle}
              inputStyle={styles.searchBarInputStyle}
            />
            <FlatList
              keyboardShouldPersistTaps='handled'
              keyExtractor={this.keyExtractor}
              data={this.list}
              renderItem={this.renderItem}
            />
          </View>
        </Overlay>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: 'white',
    height: 50,
  },
  buttonTitleStyle: {
    color: 'black',
    fontSize: 20,
    justifyContent: 'center',
  },
  buttonViewStyle: {flex: 0.3},
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    margin: 10,
    marginRight: 20,
    width: 350,
  },
  iconContainerStyle: {height: 50, width: 50},
  inputStyle: {
    fontSize: 20,
  },
  inputViewStyle: {
    alignItems: 'flex-start',
    flex: 0.7,
    justifyContent: 'center',
    marginTop: 20,
  },
  searchBarContainerStyle: {
    backgroundColor: 'white',
    borderBottomColor: 'white',
    borderTopColor: 'white',
  },
  searchBarInputContainerStyle: {
    backgroundColor: 'white',
  },
  searchBarInputStyle: {
    color: 'black',
  },
})
