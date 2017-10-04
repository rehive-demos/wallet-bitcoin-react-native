import React, {Component} from 'react'
import {
    View,
    KeyboardAvoidingView,
    TextInput,
    StyleSheet,
    AsyncStorage,
    TouchableHighlight,
    Text,
    Alert,
    Button
} from 'react-native'
import AuthService from '../../../../services/authService'
import Header from '../../../../components/header'
import Colors from '../../../../config/colors'
import Auth from './../../../../util/auth'
import resetNavigation from './../../../../util/resetNavigation'

export default class AmountEntry extends Component {
    static navigationOptions = {
        title: 'Verify mobile number',
    }

    constructor(props) {
        super(props)
        const params = this.props.navigation.state.params
        this.state = {
            token: ''
        }
    }

    verify = async () => {
        let responseJson = await AuthService.authVerify(this.state)
        if (responseJson.status === "success") {
            const authInfo = responseJson.data
            if(this.props.navigation.state.params.isTwoFactor){
                await AsyncStorage.removeItem("token")
                Auth.login(this.props.navigation, this.props.navigation.state.params.loginInfo)
            }else {
                await resetNavigation.dispatchUnderTwoFactor(this.props.navigation)
            }
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
                    title="Verify mobile number"
                />
                <KeyboardAvoidingView style={styles.container} behavior={'padding'}>
                    <View style={styles.mainContainer}>
                        <View style={styles.textInputContainer}>
                            <TextInput
                                placeholder="OTP"
                                autoCapitalize="none"
                                style={styles.textInput}
                                underlineColorAndroid="white"
                                autoFocus={true}
                                keyboardType="numeric"
                                onChangeText={(token) => this.setState({token})}
                            />
                        </View>
                        <TouchableHighlight
                            style={styles.VerifyButton}
                            onPress={() => this.verify()}
                        >
                            <Text style={styles.buttonColor}> Verify</Text>
                        </TouchableHighlight>
                    </View>
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
    },
    mainContainer: {
        backgroundColor: Colors.lightgray,
        paddingVertical: 24,
        paddingHorizontal: 8
    },
    textInputContainer:{
        paddingVertical:16
    },
    textInput: {
        padding: 8,
        backgroundColor: 'white'
    },
    VerifyButton: {
        backgroundColor: Colors.lightblue,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
        borderRadius: 4,
        height:50
    },
    buttonColor: {
        fontSize: 18,
        color: 'white'
    }
})

