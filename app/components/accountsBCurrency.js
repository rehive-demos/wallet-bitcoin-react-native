import React, {Component} from 'react'
import {View, Text, StyleSheet, TouchableHighlight, Image} from 'react-native'
import Colors from './../config/colors'

export default class Account extends Component {

    render() {
        return (
            <View style={styles.row}>
                <View style={[styles.options, {backgroundColor: Colors.lightgray}]}>
                    <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
                        {this.props.rowData.code}
                    </Text>
                </View>
                <View style={{paddingLeft:20,justifyContent:'center'}}>
                    <Text style={{color:Colors.black,fontSize: 16}}>
                        {this.props.rowData.description}
                    </Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    row: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        flexDirection:'row',
        borderBottomColor: Colors.lightgray
    },
    options: {
        height: 60,
        width: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
