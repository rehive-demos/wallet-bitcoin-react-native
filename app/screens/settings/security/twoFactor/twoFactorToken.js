import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, AsyncStorage, Button, TouchableHighlight } from 'react-native'
import Header from '../../../../components/header'
import Colors from '../../../../config/colors'
import AuthService from '../../../../services/authService'

export default class Receive extends Component {
    static navigationOptions = {
        title: 'Token',
    }

    constructor() {
        super()
        this.state = {
            imageURI: 'https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=undefined&choe=UTF-8',
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Header
                    navigation={this.props.navigation}
                    back
                    title="Token authentication"
                />
                <Image
                    style={{ width: 250, height: 250, alignSelf:'center' }}
                    source={{ uri: this.state.imageURI }}
                />
                <View style={styles.infoContainer}>
                    <Text style={styles.infoTitleText}>
                        isuser
                    </Text>
                    <Text style={styles.infoDetailsText}>
                        none
                    </Text>
                </View>
                <View style={[styles.infoContainer,{backgroundColor:'white'}]}>
                    <Text style={styles.infoTitleText}>
                        account
                    </Text>
                    <Text style={styles.infoDetailsText}>
                        world
                    </Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoTitleText}>
                        key
                    </Text>
                    <Text style={styles.infoDetailsText}>
                        hello
                    </Text>
                </View>
                <TouchableHighlight
                    style={styles.deleteButton}
                    onPress={() => this.deleteTwoFactorAuth()}
                >
                    <Text style={styles.buttonColor}> Delete</Text>
                </TouchableHighlight>
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
    text: {
        fontSize: 16,
        color: Colors.black,
        padding: 20,
    },
    infoContainer:{
        marginHorizontal:8,
        paddingVertical:16,
        borderRadius:4,
        paddingHorizontal:8,
        flexDirection:'row',
        backgroundColor:Colors.lightgray,
    },
    infoTitleText:{
        flex:2,
        color:Colors.black,
        textAlign:'left'
    },
    infoDetailsText:{
        flex:5,
        textAlign:'right'
    },
    deleteButton: {
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 4,
        marginHorizontal: 8,
        marginVertical:16
    },
    buttonColor: {
        color: 'white'
    }
})

