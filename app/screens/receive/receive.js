import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, AsyncStorage } from 'react-native'
import Colors from './../../config/colors'
import Header from './../../components/header'
import BitcoinService from './../../services/bitcoinService'

export default class Receive extends Component {
  static navigationOptions = {
    title: 'Receive',
  }

  constructor() {
    super()

    this.state = {
      imageURI: 'https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=undefined&choe=UTF-8',
      address: ''
    }
    this.service = new BitcoinService()
  }

  async getData() {
    let responseJson = await this.service.getUserAccount()
  }

  async componentDidMount() {
    let responseJson = await this.service.getUserAccount()
    const imageURI = responseJson.details.qr_code
    const address = responseJson.account_id
    this.setState({ imageURI, address })
  }

  // getData = async () => {
  //   this.setState({
  //     refreshing: true,
  //     data: [],
  //   })
  //   let responseJson = await BitcoinService.getUserAccount()
  //   // this.setDataInListView(responseJson)
  // }

  render() {
    return (
      <View style={styles.container}>
        <Header
          navigation={this.props.navigation}
          drawer
          title="Receive"
        />
        <Text style={styles.text}>
          The QR code is your public address for accepting payments.
        </Text>
        <Image
          style={{ width: 300, height: 300 }}
          source={{ uri: this.state.imageURI }}
        />
        <Text style={styles.text}>
          Address: {this.state.address}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.black,
    padding: 20,
  },
})
