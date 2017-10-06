import React, {Component} from 'react'
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    TouchableHighlight
} from 'react-native'
import Header from '../../../../components/header'
import Colors from '../../../../config/colors'
import AuthService from '../../../../services/authService'
export default class twoFactorSmsAuth extends Component {
    static navigationOptions = {
        title: 'SMS',
    }

    constructor(props) {
        super(props)
        const params = this.props.navigation.state.params
        this.state = {
            mobile_number: '',
            delete: params.authInfo.sms,
            authInfo: params.authInfo
        }
    }

    sendSms = async () => {
        let responseJson = await AuthService.smsAuthPost({"mobile_number": this.state.mobile_number})
        if (responseJson.status === "success") {
            const authInfo = responseJson.data
            this.props.navigation.navigate("AuthVerifySms", {authInfo})
        }
        else {
            Alert.alert('Error',
                responseJson.message,
                [{text: 'OK'}])
        }
    }

    deleteTwoFactorAuth= async () => {
        let responseJson = await AuthService.authOptionDelete()
        if (responseJson.status === "success") {
            this.setState({
                mobile_number:'',
                delete:!this.state.delete
            })
        }
        else {
            Alert.alert('Error',
                responseJson.message,
                [{text: 'OK'}])
        }
    }

    async componentWillMount() {
        if (this.state.authInfo.sms === true) {
            let responseJson = await AuthService.smsAuthGet()
            if (responseJson.status === "success") {
                const authInfo = responseJson.data
                if (authInfo.confirmed === true) {
                    this.setState({
                        mobile_number: authInfo.mobile_number,
                    })
                }
            }
            else {
                Alert.alert('Error',
                    responseJson.message,
                    [{text: 'OK'}])
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Header
                    navigation={this.props.navigation}
                    back
                    title="SMS"
                />
                <View style={styles.mainContainer}>
                    <Text style={styles.titleText}>
                        Enable sms authentication
                    </Text>
                    <Text style={styles.textInputText}>
                        Enter valid mobile no
                    </Text>
                    <View style={styles.mobileNoContainer}>
                        <TextInput
                            placeholder="e.g. +8801714632656"
                            value={this.state.mobile_number}
                            style={styles.textInput}
                            underlineColorAndroid="white"
                            autoFocus={true}
                            keyboardType="numeric"
                            returnKeyType='next'
                            onChangeText={(mobile) => this.setState({mobile_number: mobile})}
                        />
                    </View>
                    <View style={styles.buttonsContainer}>
                        {
                            this.state.delete &&
                            <TouchableHighlight
                                style={styles.deleteButton}
                                onPress={() => this.deleteTwoFactorAuth()}
                            >
                                <Text style={styles.buttonColor}> Delete</Text>
                            </TouchableHighlight>
                        }
                        <TouchableHighlight
                            style={styles.saveButton}
                            onPress={() => this.sendSms()}
                        >
                            <Text style={styles.buttonColor}> Save</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    mainContainer: {
        backgroundColor: Colors.lightgray,
        paddingHorizontal: 15,
        paddingVertical: 16,
    },
    titleText: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        paddingBottom: 8,
    },
    textInputText: {
        fontSize: 16,
        paddingTop: 8,
        paddingBottom: 4,
    },
    textInput: {
        paddingHorizontal: 15,
        paddingVertical:8,
    },
    mobileNoContainer: {
        backgroundColor: 'white',
    },
    buttonsContainer: {
        paddingTop: 8,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    saveButton: {
        backgroundColor: Colors.lightblue,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
        paddingHorizontal: 6,
        borderRadius: 2,
        marginLeft: 12
    },
    deleteButton: {
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
        paddingHorizontal: 6,
        borderRadius: 2,
        marginHorizontal: 12
    },
    buttonColor: {
        color: 'white'
    }
})