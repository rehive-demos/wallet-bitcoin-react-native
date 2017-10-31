import React, {Component} from 'react'
import {View, Text, StyleSheet, TextInput} from 'react-native'
import Colors from './../config/colors'

export default class Account extends Component {
    render() {
        return (
            <View style={styles.inputContainer}>
                <Text style={styles.text}>
                    {this.props.title}
                </Text>
                <TextInput
                    {...this.props}
                    style={styles.input}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    input: {
        height: 26,
        paddingLeft: 0,
        fontSize: 22,
        color: Colors.black,
        fontWeight: 'normal',
        borderColor: 'white',
        borderWidth: 1,
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        paddingBottom:15,
        color: Colors.black,
    },
    inputContainer: {
        flexDirection: 'column',
        marginLeft: 20,
        marginRight:20,
        paddingVertical:10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightgray,
    },
})
