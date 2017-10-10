import React, {Component} from 'react'
import {View, Alert, StyleSheet, ScrollView, TouchableHighlight, Text, KeyboardAvoidingView} from 'react-native'
import AuthService from './../../services/authService'
import TextInput from './../../components/textInputRow'
import MobileInput from './../../components/mobileNumberInputRow'
import Colors from './../../config/colors'
import Header from './../../components/header'

export default class Signup extends Component {
    static navigationOptions = {
        title: 'Create new account',
    }

    constructor(props) {
        super(props)
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            mobile: '+1',
            company: '',
            password1: '',
            password2: '',
        }
    }

    changeCountryCode = (code) => {
        this.setState({mobile: '+' + code})
    }

    signup = async () => {
        let responseJson = await AuthService.signup(this.state)
        if (responseJson.status === "success") {
            const loginInfo = responseJson.data
            this.props.navigation.navigate("AuthVerifyMobile", {loginInfo})
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
                    title="Create new account"
                />
                <View style={styles.mainContainer}>
                    <KeyboardAvoidingView style={styles.container} behavior={'padding'} keyboardVerticalOffset={85}>
                        <ScrollView keyboardDismissMode={'interactive'}>
                            <TextInput
                                title="First name"
                                underlineColorAndroid="white"
                                placeholder="e.g. John"
                                autoCapitalize="none"
                                onChangeText={(first_name) => this.setState({first_name})}
                            />
                            <TextInput
                                title="Last name"
                                underlineColorAndroid="white"
                                placeholder="e.g. Snow"
                                autoCapitalize="none"
                                onChangeText={(last_name) => this.setState({last_name})}
                            />
                            <TextInput
                                title="Email"
                                underlineColorAndroid="white"
                                placeholder="e.g john@gmail.com"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                onChangeText={(email) => this.setState({email})}
                            />
                            <MobileInput
                                title="Mobile"
                                autoCapitalize="none"
                                keyboardType="numeric"
                                value={this.state.mobile}
                                underlineColorAndroid="white"
                                onChangeText={(mobile) => this.setState({mobile})}
                                changeCountryCode={this.changeCountryCode}
                            />
                            <TextInput
                                title="Company"
                                underlineColorAndroid="white"
                                placeholder="e.g rehive"
                                autoCapitalize="none"
                                onChangeText={(company) => this.setState({company})}
                            />
                            <TextInput
                                title="Password"
                                placeholder="Password"
                                underlineColorAndroid="white"
                                autoCapitalize="none"
                                secureTextEntry
                                onChangeText={(password1) => this.setState({password1})}
                            />
                            <TextInput
                                title="Confirm password"
                                placeholder="Confirm password"
                                underlineColorAndroid="white"
                                autoCapitalize="none"
                                secureTextEntry
                                onChangeText={(password2) => this.setState({password2})}
                            />
                        </ScrollView>
                        <TouchableHighlight
                            style={styles.submit}
                            onPress={() => this.signup()}>
                            <Text style={{color: 'white'}}>
                                Sign up
                            </Text>
                        </TouchableHighlight>
                    </KeyboardAvoidingView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
        paddingVertical: 15,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    submit: {
        padding: 10,
        marginTop: 10,
        height: 50,
        borderRadius: 8,
        backgroundColor: Colors.lightblue,
        marginHorizontal:10,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
    },
})
