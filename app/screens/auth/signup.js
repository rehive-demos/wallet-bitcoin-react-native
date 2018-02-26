import React, {Component} from 'react'
import {
    View,
    Alert,
    StyleSheet,
    WebView,
    Linking,
    ScrollView,
    TouchableHighlight,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView
} from 'react-native'
import AuthService from './../../services/authService'
import Icon from 'react-native-vector-icons/Ionicons'
import Auth from './../../util/auth'
import TextInput from './../../components/textInput'
import MobileInput from './../../components/mobileNumberInput'
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
            mobile_number: '+1',
            company: '',
            password1: '',
            password2: '',
            terms_and_conditions:false,
        }
    }

    changeCountryCode = (code) => {
        this.setState({mobile_number: '+' + code})
    }

    signup = async () => {
        let data = this.state;
        if(data.mobile_number){
            if (data.mobile_number.length < 8) {
                delete data.mobile_number
            }
        }
        let responseJson = await AuthService.signup(data)
        if (responseJson.status === "success") {
            const loginInfo = responseJson.data
            if (data.mobile_number) {
                this.props.navigation.navigate("AuthVerifyMobile", {loginInfo, signupInfo: this.state})
            } else {
                Auth.login(this.props.navigation, loginInfo)
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
                                required
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
                                value={this.state.mobile_number}
                                underlineColorAndroid="white"
                                onChangeText={(mobile_number) => this.setState({mobile_number})}
                                changeCountryCode={this.changeCountryCode}
                            />
                            <TextInput
                                title="Company"
                                required
                                underlineColorAndroid="white"
                                placeholder="e.g rehive"
                                autoCapitalize="none"
                                onChangeText={(company) => this.setState({company})}
                            />
                            <TextInput
                                title="Password"
                                required
                                placeholder="Password"
                                underlineColorAndroid="white"
                                autoCapitalize="none"
                                secureTextEntry
                                onChangeText={(password1) => this.setState({password1})}
                            />
                            <TextInput
                                title="Confirm password"
                                required
                                placeholder="Confirm password"
                                underlineColorAndroid="white"
                                autoCapitalize="none"
                                secureTextEntry
                                onChangeText={(password2) => this.setState({password2})}
                            />
                            <View style={styles.termsAndCondition}>
                                <Icon
                                    onPress={()=>this.setState({
                                        terms_and_conditions:!this.state.terms_and_conditions
                                    })}
                                    name="md-checkbox"
                                    size={30}
                                    color={this.state.terms_and_conditions ? Colors.green : Colors.lightgray}
                                />
                                <Text style={styles.agreeText}>
                                    I agree to the
                                </Text>
                                <TouchableOpacity onPress={() => Linking.openURL('https://rehive.com/terms-of-use')}>
                                    <Text style={styles.termsText}>
                                        terms of use
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                        <TouchableHighlight
                            style={styles.submit}
                            onPress={() => this.signup()}>
                            <Text style={{color: 'white', fontSize: 20}}>
                                Register
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
        paddingVertical: 10,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: 10,
    },
    submit: {
        marginTop: 10,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.lightblue,
        marginHorizontal: 10,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
    },
    termsAndCondition: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems:'center'
    },
    termsText: {
        color: Colors.lightblue,
        fontSize:16,
    },
    agreeText: {
        color: Colors.black,
        paddingLeft:8,
        paddingRight:4,
        fontSize:16,
    }

})
