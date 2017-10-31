import React, { Component } from 'react'
import { ScrollView, StyleSheet, TouchableHighlight, Text, KeyboardAvoidingView } from 'react-native'
import TextInput from './../../../components/textInput'
import Colors from './../../../config/colors'

export default class BitcoinAddressComponent extends Component {

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={'padding'}>
        <ScrollView keyboardDismissMode={'interactive'}>
          <TextInput
            title="Bitcoin Address"
            placeholder="e.g akjsfndj2432askfn"
            autoCapitalize="none"
            underlineColorAndroid="white"
            value={this.props.values.address}
            onChangeText={this.props.updateAddress}
          />
        </ScrollView>
        <TouchableHighlight
          style={styles.submit}
          onPress={this.props.onPress}>
          <Text style={{ color: 'white', fontSize: 18 }}>
            Save
          </Text>
        </TouchableHighlight>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  submit: {
    padding: 10,
    marginTop: 10,
    height: 65,
    backgroundColor: Colors.lightblue,
    width: "100%",
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
