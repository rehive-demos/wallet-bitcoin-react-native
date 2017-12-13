
import React, {Component} from 'react'
import {View, Text, StyleSheet, TouchableHighlight, Image} from 'react-native'
import Colors from './../config/colors'
import IconF from 'react-native-vector-icons/FontAwesome'

export default class Account extends Component {
    constructor(props){
        super(props);
        this.state={
            currencies:this.props.currencies,
            active:false,
            balance:0,
            code:this.props.code,
        }
    }
    componentWillMount(){
        let i=0,j=0;
        let zarAccount=this.state.currencies.filter(account=>account.currency.code===this.state.code)
        this.setState({
            balance:this.setBalance(zarAccount[0].balance,zarAccount[0].currency.divisibility),
            active:zarAccount[0].active
        })

    }
    setBalance = (balance, divisibility) => {
        for (let i = 0; i < divisibility; i++) {
            balance = balance / 10
        }
        let balanceString = balance.toString()
        return balance
    }
    render() {
        return (
          <View style={{height:70, padding:10, paddingHorizontal:20, borderBottomWidth:2, borderBottomColor: Colors.lightgray, justifyContent:'center', backgroundColor:'white'}}>
          
            <View style={{flexDirection:'row', flex:1}}>
              <View style={{flex:1, justifyContent:'center'}}>
                <Text style={{color: Colors.darkgray, fontSize:17}}>
                  {this.props.name}
                </Text>
                <Text style={{color: Colors.black, fontSize:22}}>
                  {this.props.symbol}{this.state.balance.toFixed(4).replace(/0{0,2}$/, "")}
                </Text>
              </View>
              <View style={{justifyContent:'center'}}>
                <IconF
                  name="check-square"
                  size={40}
                  color={this.state.active ? Colors.green : Colors.lightgray}
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





