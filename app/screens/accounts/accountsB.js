import React, { Component } from 'react'
import { View, ListView, StyleSheet, Text, Alert, RefreshControl } from 'react-native'
import InfiniteScrollView from 'react-native-infinite-scroll-view'
import Icon from 'react-native-vector-icons/Ionicons'
import AccountService from './../../services/accountService'
import CurrencyCircle from './../../components/currencyCircle'
import CurrencyCircleUnselected from './../../components/currencyCircleUnselected'
import Header from './../../components/header'
import Colors from './../../config/colors'

export default class Accounts extends Component {
  static navigationOptions = {
    title: 'Accounts',
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          navigation={this.props.navigation}
          back
          title="Accounts"
        />
        <View style={{flex:2, padding:10, flexDirection:'row', backgroundColor:'white'}}>
          <CurrencyCircle code={"ZAR"} />
          <View style={{flex:1, flexDirection:'row', paddingHorizontal:20}}>
            <CurrencyCircleUnselected code={"USD"} />
            <CurrencyCircleUnselected code={"EUR"} />
            <CurrencyCircleUnselected code={"TAKA"} />
          </View>
        </View>
        <View style={{flex:1, flexDirection:'row', backgroundColor:'white'}}>
          <View style={{flex:1, paddingHorizontal:20, justifyContent:'center'}}>
            <Text style={{color: Colors.lightgray, fontSize:15}}>
              South African Rand
            </Text>
            <Text style={{color: Colors.lightgray, fontSize:15}}>
              R1000.00
            </Text>
          </View>
          <View style={{width:50, paddingHorizontal:10, justifyContent:'center', alignItems:'center'}}>
            <Icon
                name="ios-arrow-up-outline"
                size={30}
                color={Colors.lightgray}
                style={{paddingRight: 10}}
            />
          </View>
        </View>
        <View style={{flex:7, flexDirection:'column', backgroundColor:Colors.lightgray}}>
        </View>
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
})
