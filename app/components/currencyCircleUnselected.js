import React, {Component} from 'react'
import {View, Text, StyleSheet, TouchableHighlight, Image} from 'react-native'
import Colors from './../config/colors'

export default class Account extends Component {
    constructor(props) {
        super(props);
        const color = this.props.active === true ? Colors.lightgray : 'orange'
        this.state = {
            balance: 0,
            color,
        }
    }

    render() {
        return (
            <View
                style={ styles.row}>
                <View style={[styles.options, {backgroundColor: Colors.lightgray}]}>
                  <Text style={{color:'white', fontSize:16, fontWeight:'bold'}}>
                    {this.props.code}
                  </Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    row: {
      width: 60,
      justifyContent: 'flex-start', 
      alignItems: 'center',
    },
    options: {
        height: 50,
        width: 50,
        borderRadius: 25,
        justifyContent: 'center', 
        alignItems: 'center',
    },
})
