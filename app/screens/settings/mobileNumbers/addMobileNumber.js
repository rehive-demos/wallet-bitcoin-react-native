import React, {Component} from 'react'
import {View, KeyboardAvoidingView, StyleSheet, TouchableHighlight, Text, Alert} from 'react-native'
import SettingsService from './../../../services/settingsService'
import TextInput from './../../../components/mobileNumberInput'
import Colors from './../../../config/colors'
import Header from './../../../components/header'
import Button from './../../../components/button'

export default class AmountEntry extends Component {
    static navigationOptions = {
        title: 'Add mobile number',
    }

    constructor(props) {
        super(props);
        this.state = {
            number: '+1',
            primary: false,
        }
    }

    changeCountryCode = (code) => {
        this.setState({number: '+' + code})
    }
    add = async () => {
        let responseJson = await SettingsService.addMobile(this.state)

        if (responseJson.status === "success") {
            this.props.navigation.navigate("VerifyMobileNumber")
        }
        else {
            Alert.alert('Error',
                responseJson.message,
                [{text: 'OK'}])
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Header
                    navigation={this.props.navigation}
                    back
                    title="Add mobile number"
                />
                <KeyboardAvoidingView style={styles.container} behavior={'padding'}>
                    <View style={{flex: 1}}>
                        <TextInput
                            title="Enter number"
                            autoCapitalize="none"
                            value={this.state.number}
                            onChangeText={(number) => this.setState({number})}
                            changeCountryCode={this.changeCountryCode}
                        />
                    </View>
                    <Button
                        title="Save"
                        onPress={this.add}/>
                </KeyboardAvoidingView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        paddingTop:10
    },
    submit: {
        marginBottom: 10,
        marginHorizontal: 20,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.lightblue,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
