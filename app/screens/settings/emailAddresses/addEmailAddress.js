import React, { Component } from 'react'
import { View, KeyboardAvoidingView, StyleSheet, TouchableHighlight, Text, Alert } from 'react-native'
import SettingsService from './../../../services/settingsService'
import ResetNavigation from './../../../util/resetNavigation'
import TextInput from './../../../components/textInput'
import Colors from './../../../config/colors'
import Header from './../../../components/header'

export default class AmountEntry extends Component {
  static navigationOptions = {
    title: 'Add email address',
  }

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      primary: false,
    }
  }

  reload = () => {
    ResetNavigation.dispatchUnderDrawer(this.props.navigation, 'Settings', 'SettingsEmailAddresses')
  }

  add = async () => {
    let responseJson = await SettingsService.addEmail(this.state)

    if (responseJson.status === "success") {
      this.reload()
    }
    else {
      Alert.alert('Error',
        responseJson.message,
        [{ text: 'OK' }])
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          navigation={this.props.navigation}
          back
          title="Add email address"
        />
        <KeyboardAvoidingView style={styles.container} behavior={'padding'} >
          <View style={{ flex: 1,paddingTop:10 }}>
            <TextInput
              title="Enter email address"
              placeholder="e.g. john@gmail.com"
              autoCapitalize="none"
              underlineColorAndroid="white"
              onChangeText={(email) => this.setState({ email })}
            />
          </View>
          <TouchableHighlight
            style={styles.submit}
            onPress={this.add}>
            <Text style={{ color: 'white', fontSize: 18 }}>
              Save
          </Text>
          </TouchableHighlight>
        </KeyboardAvoidingView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  submit: {
    padding: 10,
    height: 65,
    backgroundColor: Colors.lightblue,
    width: "100%",
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
