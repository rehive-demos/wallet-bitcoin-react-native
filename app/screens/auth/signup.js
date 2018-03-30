import React, {Component} from 'react'
import ReactNative, {
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
        let reg = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/ ;
        if(reg.test(email) === false)
        {
            this.email.refs.electronic_mail.focus();
            this._scrollToInput(ReactNative.findNodeHandle(this.email.refs.electronic_mail));
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
            this.company.refs.company.focus();
            this._scrollToInput(ReactNative.findNodeHandle(this.company.refs.company));
            this.setState({
                company_error:"Enter a valid company id."
            })
        }

    }

    password1Checking = () => {
        if (this.state.password1.length>=8) {
            this.setState({
                password1_status: true
            })
        } else {
            this.pass.refs.password.focus()
            this._scrollToInput(ReactNative.findNodeHandle(this.pass.refs.password));
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
            this.confirm.refs.confirm_password.focus()
            this._scrollToInput(ReactNative.findNodeHandle(this.confirm.refs.confirm_password));
            this.setState({
                password2_status: false,
                password_error:"Confirm your password.",
            })
        }

    }

    passwordMatching = () => {
        if(this.state.password2_status){
            if (this.state.password1 !== this.state.password2) {
                this.confirm.refs.confirm_password.focus()
                this._scrollToInput(ReactNative.findNodeHandle(this.confirm.refs.confirm_password));
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

    _scrollToInput (inputHandle) {
        const scrollResponder = this.refs.myScrollView.getScrollResponder();
        scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
          inputHandle, // The TextInput node handle
          0, // The scroll view's bottom "contentInset" (default 0)
          true // Prevent negative scrolling
        );
      }

    signup = async () => {
        let data = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
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

        if(this.state.inputNumber){
            data.mobile_number= '+'+this.state.countryCode+this.state.inputNumber;
        }
        await this.validateEmail(this.state.email);
        await this.mobileNumberChecking();
        await this.companyChecking();
        await this.password1Checking();
        await this.password2Checking();
        await this.passwordMatching();
        console.log(data)
        if(!this.state.password_error && this.state.email_status && this.state.mobile_number_status && this.state.company && this.state.password1_status){
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
                //console.log(responseJson.message)
                if(responseJson.data.company){
                    this.company.refs.company.focus()
                    this._scrollToInput(ReactNative.findNodeHandle(this.company.refs.company));
                    this.setState({
                        company_error: responseJson.data.company,
                    })
                }
                if(responseJson.data.email){
                    this.email.refs.electronic_mail.focus();
                    this._scrollToInput(ReactNative.findNodeHandle(this.email.refs.electronic_mail));
                    this.setState({
                        email_error: responseJson.data.email,
                    })
                }
                if(responseJson.data.mobile_number){
                    this.mobile_number.refs.mobile_number.focus();
                    this._scrollToInput(ReactNative.findNodeHandle(this.mobile_number.refs.mobile_number));
                    this.setState({
                        mobile_error: responseJson.data.mobile_number,
                    })
                }
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
                        <ScrollView keyboardDismissMode={'interactive'} ref="myScrollView" keyboardShouldPersistTaps='always'>
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
                                returnKeyType="done"
                                ref={ref => this.email = ref}
                                reference="electronic_mail"
                                onSubmitEditing={() => this.mobile_number.refs.mobile_number.focus()}
                            />
                            <MobileInput
                                title="Mobile"
                                autoCapitalize="none"
                                keyboardType="numeric"
                                value={this.state.mobile_number}
                                underlineColorAndroid="white"
                                onChangeText={(mobile_number) => this.setState({mobile_number})}
                                changeCountryCode={this.changeCountryCode}
                                error={this.state.mobile_error}
                                ref={ref => this.mobile_number = ref}
                                reference="mobile_number"
                                onSubmitEditing={() => this.company.refs.company.focus()}
                            />
                            <TextInput
                                title="Company"
                                required
                                underlineColorAndroid="white"
                                placeholder="e.g rehive"
                                autoCapitalize="none"
                                onChangeText={(company) => this.setState({company})}
                                error={this.state.company_error}
                                returnKeyType="next"
                                ref={ref => this.company = ref}
                                reference="company"
                                onSubmitEditing={() => this.pass.refs.password.focus()}
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
                        </ScrollView>
                        <TouchableHighlight
                            style={styles.submit}
                            onPress={() => this.signup()}>
                            <Text style={{color: 'white', fontSize:20}}>
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
})
