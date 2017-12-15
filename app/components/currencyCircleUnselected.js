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
                <TouchableHighlight
                    underlayColor={Colors.darkergray}
                    onPress={() => {
                        this.props.setViewAccount(this.props.currency)
                    }}
                    style={[styles.options, {backgroundColor: Colors.darkergray}]}>
                    <Text style={{
                        color: 'white',
                        fontSize: this.props.currency.code.length < 4 ? 16 : 8,
                        fontWeight: 'bold'
                    }}>
                        {this.props.currency.code.substr(0,6)}
                    </Text>
                </TouchableHighlight>
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
