import React, {Component} from 'react'
import {View, Text, StyleSheet, TouchableHighlight, ScrollView} from 'react-native'
import Colors from './../config/colors'

export default class Options extends Component {
    constructor(props) {
        super(props)
        this.state = {
            color: 'black'
        }
    }

    componentWillReceiveProps() {
        let color;
        if (this.props.buttonText === 'PENDING') {
            color = Colors.darkgray
        } else if (this.props.buttonText === 'VERIFIED') {
            color = Colors.green
        } else if (this.props.buttonText === 'INCOMPLETE' || this.props.buttonText === 'DENIED') {
            color = Colors.red
        }

        this.setState({
            color: color
        })
    }

    render() {
        return (
            <TouchableHighlight style={styles.options}
                                onPress={() => this.props.goTo(this.props.gotoAddress,this.props.title)}>
                <View style={styles.optionsElement}>
                    <ScrollView style={{flex: 1, marginRight: 8}}>
                        <Text style={[styles.optionsText, {color: 'gray', fontSize: 20}]}>
                            {this.props.title}
                        </Text>
                        <Text style={styles.optionsText}>
                            {this.props.subtitle}
                        </Text>
                    </ScrollView>
                    <View style={[styles.submit, {borderColor: this.state.color}]}>
                        <Text style={[styles.optionsText, {color: this.state.color}]}>
                            {this.props.buttonText}
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
}

const styles = StyleSheet.create({
    options: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        height: 70,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightgray
    },
    optionsElement: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionsText: {
        fontSize: 16,
        color: Colors.black,
    },
    submit: {
        paddingHorizontal: 10,
        marginLeft: 8,
        height: 40,
        borderWidth: 1,
        borderRadius: 20,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
})
