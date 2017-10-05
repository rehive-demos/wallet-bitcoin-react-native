import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    AsyncStorage,
    Button,
    TouchableHighlight,
    TextInput,
    KeyboardAvoidingView,
    Alert
} from 'react-native'
import Header from '../../../../components/header'
import Colors from '../../../../config/colors'
import AuthService from '../../../../services/authService'
import resetNavigation from './../../../../util/resetNavigation'

export default class Receive extends Component {
    static navigationOptions = {
        title: 'Token',
    }

    constructor(props) {
        super(props)
        const params = this.props.navigation.state.params
        this.state = {
            imageURI: 'https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=undefined&choe=UTF-8',
            otpauth_url:'',
            token: '',
            issuer: '',
            account: '',
            key: '',
            delete: params.authInfo.token,
        }
    }

    async componentWillMount() {
        let responseJson = await AuthService.tokenAuthGet()
        if (responseJson.status === "success") {
            const tokenResponse = responseJson.data
            this.setState({
                otpauth_url:tokenResponse.otpauth_url,
                issuer:tokenResponse.issuer,
                account:tokenResponse.account,
                key:tokenResponse.key,
                imageURI:"https://chart.googleapis.com/chart?cht=qr&chs=200x200&chld=L|0&chl="+tokenResponse.otpauth_url
            })

        }
        else {
            let responseJson = await AuthService.tokenAuthPost({})
            if(responseJson.status==="success"){
                const tokenResponse=responseJson.data
                this.setState({
                    otpauth_url:tokenResponse.otpauth_url,
                    issuer:tokenResponse.issuer,
                    account:tokenResponse.account,
                    key:tokenResponse.key,
                    imageURI:"https://chart.googleapis.com/chart?cht=qr&chs=200x200&chld=L|0&chl="+tokenResponse.otpauth_url
                })
            }else{
                Alert.alert('Error',
                    responseJson.message,
                    [{text: 'OK'}])
            }
        }
    }

    saveToken=async () => {
        let responseJson = await AuthService.authVerify({token: this.state.token})
        if (responseJson.status === "success") {
            const authInfo = responseJson.data
            await resetNavigation.dispatchUnderTwoFactor(this.props.navigation)
        }
        else {
            Alert.alert('Error',
                responseJson.message,
                [{text: 'OK'}])
        }
    }

    deleteTwoFactorAuth= async () => {
        let responseJson = await AuthService.authTokenDelete()
        if (responseJson.status === "success") {
            this.setState({
                delete:!this.state.delete
            })
            await resetNavigation.dispatchUnderTwoFactor(this.props.navigation)
        }
        else {
            Alert.alert('Error',
                responseJson.message,
                [{text: 'OK'}])
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
                <KeyboardAvoidingView style={styles.container} behavior={'padding'} keyboardVerticalOffset={85}>
                    <ScrollView>
                        <Image
                            style={{width: 250, height: 250, alignSelf: 'center'}}
                            source={{uri: this.state.imageURI}}
                        />
                        <View style={styles.infoContainer}>
                            <Text style={styles.infoTitleText}>
                                issuer
                            </Text>
                            <Text style={styles.infoDetailsText}>
                                {this.state.issuer}
                            </Text>
                        </View>
                        <View style={[styles.infoContainer, {backgroundColor: 'white'}]}>
                            <Text style={styles.infoTitleText}>
                                account
                            </Text>
                            <Text style={styles.infoDetailsText}>
                                {this.state.account}
                            </Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.infoTitleText}>
                                key
                            </Text>
                            <Text style={styles.infoDetailsText}>
                                {this.state.key}
                            </Text>
                        </View>
                        <View style={styles.textInputContainer}>
                            <TextInput
                                placeholder="e.g. 123456"
                                value={this.state.token}
                                style={styles.textInput}
                                underlineColorAndroid="white"
                                keyboardType="numeric"
                                returnKeyType='next'
                                onChangeText={(token) => this.setState({token: token})}
                            />
                        </View>
                        <TouchableHighlight
                            style={styles.buttonStyle}
                            onPress={() => this.saveToken()}
                        >
                            <Text style={styles.buttonTextColor}> Save</Text>
                        </TouchableHighlight>
                        {
                            this.state.delete &&
                            <TouchableHighlight
                                style={[styles.buttonStyle, {backgroundColor: 'red'}]}
                                onPress={() => this.deleteTwoFactorAuth()}
                            >
                                <Text style={styles.buttonTextColor}> Delete</Text>
                            </TouchableHighlight>
                        }
                    </ScrollView>
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
    text: {
        fontSize: 16,
        color: Colors.black,
        padding: 20,
    },
    infoContainer: {
        marginHorizontal: 8,
        paddingVertical: 16,
        borderRadius: 4,
        paddingHorizontal: 8,
        flexDirection: 'row',
        backgroundColor: Colors.lightgray,
    },
    infoTitleText: {
        flex: 2,
        color: Colors.black,
        textAlign: 'left'
    },
    infoDetailsText: {
        flex: 5,
        textAlign: 'right'
    },
    buttonStyle: {
        backgroundColor: Colors.lightblue,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 4,
        marginHorizontal: 8,
        marginVertical: 8
    },
    buttonTextColor: {
        color: 'white'
    },
    textInput: {
        padding: 8,
        borderWidth: 1,
        borderColor: Colors.lightgray
    },
    textInputContainer: {
        backgroundColor: 'white',
        borderRadius: 2,
        paddingTop: 8,
        paddingBottom: 8,
        paddingHorizontal: 8
    },
})

