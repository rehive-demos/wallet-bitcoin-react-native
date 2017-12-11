import React, {Component} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, NetInfo, Alert, TouchableHighlight} from 'react-native'
import Colors from './../config/colors'

export default class Account extends Component {
    static propTypes={
        title:React.PropTypes.string.isRequired
    }


    render() {
        return (
            <View style={styles.buttonbar}>
                <TouchableHighlight
                    {...this.props}
                    style={styles.submit}>
                    <Text style={styles.buttonText}>
                        {this.props.title}
                    </Text>
                </TouchableHighlight>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    buttonbar: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        paddingHorizontal: 20,
        justifyContent: 'center',
        paddingVertical: 10,
        backgroundColor: 'transparent',
    },
    submit: {
        backgroundColor: Colors.lightblue,
        height: 50,
        borderRadius: 25,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText:{
        color: 'white',
        fontSize: 20
    },
})
