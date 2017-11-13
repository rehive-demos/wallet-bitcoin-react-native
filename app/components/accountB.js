
import React, {Component} from 'react'
import {View, Text, StyleSheet, TouchableHighlight, Image} from 'react-native'
import Colors from './../config/colors'
import IconF from 'react-native-vector-icons/FontAwesome'

export default class Account extends Component {

    render() {
        return (
          <View style={{height:70, padding:10, paddingHorizontal:20, borderBottomWidth:2, borderBottomColor: Colors.lightgray, justifyContent:'center', backgroundColor:'white'}}>
          
            <View style={{flexDirection:'row', flex:1}}>
              <View style={{flex:1, justifyContent:'center'}}>
                <Text style={{color: Colors.darkgray, fontSize:17}}>
                  {this.props.name}
                </Text>
                <Text style={{color: Colors.black, fontSize:22}}>
                  {this.props.symbol + this.props.amount}
                </Text>
              </View>
              <View style={{justifyContent:'center'}}>
                <IconF
                  name="check-square"
                  size={40}
                  color={this.props.active ? Colors.green : Colors.lightgray}
                />
              </View>
            </View>
              
          </View>
        )
    }
}

const styles = StyleSheet.create({
    options: {
        height: 80,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightgray,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    optionsElement: {
        flex: 1,
        flexDirection: 'row',
    },
    icon: {
        flex: 1,
        justifyContent: 'center',
    },
    type: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
})





