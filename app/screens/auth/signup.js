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

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

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
            email_status: true,
            mobile_number: '+1',
            mobile_number_status: true,
            company: '',
            password1: '',
            password1_status: true,
            password2: '',
            password2_status: true,
            password_matching: true,
            terms_and_conditions: false,
            password_error:null,
            mobile_error:null,
            email_error:null,
            company_error:null,
            inputNumber:'',
            countryCode:null,
            countryName:'',
        }
    }

    changeCountryCode = (code,cca2) => {
        this.setState({
            countryCode:code,
            countryName:cca2
        })
    }
    validateEmail = (email) => {
        console.log(email);
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        if(reg.test(email) === false)
        {
            this.setState({
                email:email,
                email_status:false,
                email_error:"Enter a valid email address.",
            })
        }
        else {
            this.setState({
                email:email,
                email_status:true,
                email_error:null,
            })
        }
    }

    mobileNumberChecking = () => {
        if(this.state.countryCode){
            const number = phoneUtil.parseAndKeepRawInput(this.state.countryCode+this.state.inputNumber, this.state.countryName)
            if (phoneUtil.isValidNumber(number)) {
                this.setState({
                    mobile_number_status: true,
                    mobile_error:null,
                })
            } else {
                this.setState({
                    mobile_number_status: false,
                    mobile_error:"Enter a valid mobile number.",
                })
            }
        }
    }
    companyChecking = () => {
        if (this.state.company) {
            this.setState({
                company_error:null,
            })
        } else {
            this.setState({
                company_error:"Enter a valid company id."
            })
        }

    }

    password1Checking = () => {
        if (this.state.password1>=8) {
            this.setState({
                password1_status: true
            })
        } else {
            this.setState({
                password1_status: false
            })
        }

    }

    password2Checking = () => {
        if (this.state.password2) {
            this.setState({
                password2_status: true,
                password_error:null,
            })
        } else {
            this.setState({
                password2_status: false,
                password_error:"Confirm your password.",
            })
        }

    }

    passwordMatching = () => {
        if(this.state.password2_status){
            if (this.state.password1 !== this.state.password2) {
                this.setState({
                    password_error: "Passwords do not match."
                })
            } else {
                this.setState({
                    password_error: null,
                })
            }
        }
    }

    signup = async () => {
        let data = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            mobile_number: '+'+this.state.countryCode+this.state.inputNumber,
            company: this.state.company,
            password1: this.state.password1,
            password2: this.state.password2,
            terms_and_conditions: this.state.terms_and_conditions,
        }
        /*if (data.mobile_number) {
            if (data.mobile_number.length < 8) {
                delete data.mobile_number
            }
        }*/
        await this.validateEmail(this.state.email);
        await this.mobileNumberChecking();
        await this.companyChecking();
        await this.password1Checking();
        await this.password2Checking();
        await this.passwordMatching();
        console.log(data)
        if(!this.state.password_error && this.state.email_status){
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
                console.log(responseJson.message)
                this.setState({
                    mobile_error:"A user is already registered with this mobile number.",
                    email_error:"A user is already registered with this email address.",
                    company_error:"Enter a valid company id.",
                })
            }
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
                                error={this.state.email_error}
                            />
                            <MobileInput
                                title="Mobile"
                                autoCapitalize="none"
                                keyboardType="numeric"
                                value={this.state.inputNumber}
                                underlineColorAndroid="white"
                                onChangeText={(mobile_number) => this.setState({inputNumber:mobile_number})}
                                changeCountryCode={this.changeCountryCode}
                                error={this.state.mobile_error}
                            />
                            <TextInput
                                title="Company"
                                required
                                underlineColorAndroid="white"
                                placeholder="e.g rehive"
                                autoCapitalize="none"
                                onChangeText={(company) => this.setState({company})}
                                error={this.state.company_error}
                            />
                            <TextInput
                                title="Password"
                                required
                                placeholder="Password"
                                underlineColorAndroid="white"
                                autoCapitalize="none"
                                secureTextEntry
                                onChangeText={(password1) => this.setState({password1})}
                                error={!this.state.password1_status ? "Password must be at least 8 characters." :  null}
                            />
                            <TextInput
                                title="Confirm password"
                                required
                                placeholder="Confirm password"
                                underlineColorAndroid="white"
                                autoCapitalize="none"
                                secureTextEntry
                                onChangeText={(password2) => this.setState({password2})}
                                error={this.state.password_error}
                            />
                            <View style={styles.termsAndCondition}>
                                <Icon
                                    onPress={() => this.setState({
                                        terms_and_conditions: !this.state.terms_and_conditions
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
        justifyContent: 'center'
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
        alignItems: 'center'
    },
    termsText: {
        color: Colors.lightblue,
        fontSize: 16,
    },
    agreeText: {
        color: Colors.black,
        paddingLeft: 8,
        paddingRight: 4,
        fontSize: 16,
    }

})
