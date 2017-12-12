import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    AsyncStorage,
    TouchableHighlight,
    Alert,
    Text,
    Image,
    TouchableWithoutFeedback
} from 'react-native'
import moment from 'moment'
import PopupDialog from 'react-native-popup-dialog'
import UserInfoService from './../../services/userInfoService'
import AccountService from './../../services/accountService'
import Transactions from './transactions'
import Auth from './../../util/auth'
import NetInfo from './../../util/checkNetConnection'
import Colors from './../../config/colors'
import Header from './../../components/header'
import HomeCard from './../../components/homeCard'

let inputLength = 0;

export default class Home extends Component {
    static navigationOptions = {
        label: 'Home',
    }

    constructor(props) {
        super(props)
        this.state = {
            balance: 0,
            showTransaction: false,
            symbol: '',
            dataToShow: {
                currency: {},
            },
            reference: '',
            selectedCurrency: -1,
            company: {
                name: '',
            },
            code: '',
        }
    }

    async componentWillMount() {
        try {
            const token = await AsyncStorage.getItem('token')
            if (token === null) {
                this.logout()
            }
            return token
        }
        catch (error) {
        }
    }

    async componentDidMount() {
        //NetInfo.check(this.props.navigation)
        this.getBalanceInfo()
        this.getUserInfo()
    }

    setBalance = (balance, divisibility) => {
        for (let i = 0; i < divisibility; i++) {
            balance = balance / 10
        }
        let balanceString = balance.toString()
        inputLength = balanceString.length
        return balance
    }

    getUserInfo = async () => {
        let responseJson = await UserInfoService.getUserDetails()
        if (responseJson.status === "success") {
            AsyncStorage.removeItem('user')
            AsyncStorage.setItem('user', JSON.stringify(responseJson.data))
            let switches = responseJson.data.switches
            let creditSwitches = switches.filter(word => word.tx_type === 'credit')
            if (creditSwitches.length > 0) {
                let creditSwitch = creditSwitches[0]
                if (!creditSwitch.enabled) {
                    this.setState({
                        creditSwitch: false,
                    })
                }
            }
            let debitSwitches = switches.filter(word => word.tx_type === 'debit')
            if (debitSwitches.length > 0) {
                let debitSwitch = debitSwitches[0]
                if (!debitSwitch.enabled) {
                    this.setState({
                        debitSwitch: false,
                    })
                }
            }
            const token = await AsyncStorage.getItem('token')
            if (token === null) {
                await this.logout()
            }
            let responseJson2 = await UserInfoService.getCompany()
            if (responseJson2.status === "success") {
                this.setState({
                    company: responseJson2.data,
                })
            }
        }
        else {
            this.logout()
        }
    }

    getBalanceInfo = async () => {
        let responseJson = await UserInfoService.getActiveAccount()
        if (responseJson.status === "success") {
            const account = responseJson.data.results[0].currencies[0]
            let switches = account.switches
            let creditSwitches = switches.filter(word => word.tx_type === 'credit')
            if (creditSwitches.length > 0) {
                let creditSwitch = creditSwitches[0]
                if (!creditSwitch.enabled) {
                    this.setState({
                        creditSwitch: false,
                    })
                }
            }
            let debitSwitches = switches.filter(word => word.tx_type === 'debit')
            if (debitSwitches.length > 0) {
                let debitSwitch = debitSwitches[0]
                if (!debitSwitch.enabled) {
                    this.setState({
                        debitSwitch: false,
                    })
                }
            }
            AsyncStorage.setItem('currency', JSON.stringify(account.currency))
            this.setState({
                account: responseJson.data.results[0].name,
                default: account,
                code: account.currency.code,
                symbol: account.currency.symbol,
                reference: responseJson.data.results[0].reference,
                balance: this.setBalance(account.available_balance, account.currency.divisibility),
            })
            let responseJson2 = await AccountService.getAllAccountCurrencies(this.state.reference)
            if (responseJson2.status === "success") {
                const currencies = responseJson2.data.results
                this.setState({
                    currencies,
                    selectedCurrency: -1,
                })
            }
        }
        else {
            this.logout()
        }
    }

    logout = () => {
        Auth.logout(this.props.navigation)
    }

    showDialog = (item) => {
        this.setState({ dataToShow: item });
        this.popupDialog.show()
    }

    getAmount = (amount = 0, divisibility) => {
        for (let i = 0; i < divisibility; i++) {
            amount = amount / 10
        }

        return amount.toFixed(8).replace(/\.?0+$/, "")
    }

    tap1 = () => {
        this.setState({
            showTransaction: !this.state.showTransaction,
        });
    }

    longTap1 = async () => {
        Alert.alert(
            "Are you sure?",
            "Set it as active currency?",
            [
                {text: 'Yes', onPress: () => this.changeAccount()},
                {
                    text: 'No',
                    style: 'cancel',
                },
            ]
        )
    }

    changeAccount = async () => {
        let responseJson = await AccountService.setActiveCurrency(this.state.reference, this.state.currencies[this.state.selectedCurrency].currency.code)
        if (responseJson.status === "success") {
            Alert.alert(
                "Success",
                "Your active currency has been changed successfully.",
                [{text: 'OK'}]
            )
        }
    }

    tap2 = () => {
        let index = (this.state.selectedCurrency + 1) % this.state.currencies.length
        if (this.state.currencies[index].currency.symbol === this.state.symbol) {
            index = (index + 1) % this.state.currencies.length
        }
        console.log(index)
        this.setState({
            showTransaction: false,
            selectedCurrency: index,
            code: this.state.currencies[index].currency.code,
            symbol: this.state.currencies[index].currency.symbol,
            balance: this.setBalance(this.state.currencies[index].available_balance, this.state.currencies[index].currency.divisibility),
        });
    }

    render() {
        /*let swipeBtns = [{
         text: 'Show',
         backgroundColor: Colors.lightgray,
         underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
         onPress: () => this.props.navigation.navigate(
         'AccountCurrencies',
         {reference: this.state.reference}
         )
         }];*/
        return (
            <View style={styles.container}>
                <Header
                    navigation={this.props.navigation}
                    drawer
                    homeRight
                />
                <View style={styles.balance}>
                    <TouchableHighlight style={{flex: 1}}><View></View></TouchableHighlight>
                    <TouchableHighlight
                        underlayColor={Colors.lightblue}
                        onPress={() => this.tap1()}
                        onLongPress={() => this.longTap1()}
                        style={{flex: 4}}>
                        <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center',}}>
                            <Text style={{fontSize: 18, color: 'white'}}>
                                {this.state.account}
                            </Text>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{fontSize: inputLength < 8 ? 23 : 12, color: 'white'}}>
                                    {this.state.symbol}
                                </Text>
                                <Text style={{paddingLeft: 5, fontSize: inputLength < 8 ? 40 : 20, color: 'white'}}>
                                    {this.state.balance.toFixed(4).replace(/0{0,2}$/, "")}
                                </Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        underlayColor={Colors.lightblue}
                        style={{flex: 1}}
                        onPress={() => this.tap2()}>
                        <View></View>
                    </TouchableHighlight>
                </View>
                <View style={styles.transaction}>
                    {this.state.showTransaction === false ?
                        <View style={{flex: 1, backgroundColor: Colors.lightgray, padding: 10}}>
                            <HomeCard title="Welcome to Rehive"
                                      text="Put your logo and brand here."
                                      buttonText="Cool"
                                      buttonId={1}/>
                        </View> :
                        <Transactions updateBalance={this.getBalanceInfo}
                                      currency={this.state.code}
                                      showDialog={this.showDialog}
                                      logout={this.logout}/>}
                </View>
                <View style={styles.buttonbar}>
                    <TouchableHighlight
                        style={styles.submit}
                        onPress={() => this.props.navigation.navigate("Receive")}>
                        <Text style={{ color: 'white', fontSize: 20 }}>
                            Receive
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={[styles.submit, { marginLeft: 25 }]}
                        onPress={() => this.props.navigation.navigate("SendTo", {
                            reference: "",
                            balance: this.state.balance
                        })}>

                        <Text style={{ color: 'white', fontSize: 20 }}>
                            Send
                        </Text>
                    </TouchableHighlight>
                </View>
                <PopupDialog
                    ref={(popupDialog) => {
                        this.popupDialog = popupDialog;
                    }}
                    height={250}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                            <Image
                                source={require('./../../../assets/icons/placeholder.png')}
                                style={{ height: 80, width: 80, margin: 10 }}
                            />
                            <Text style={{ fontSize: 20, color: Colors.black }}>
                                {this.state.dataToShow.label + ": " + this.state.dataToShow.currency.symbol + this.getAmount(this.state.dataToShow.amount, this.state.dataToShow.currency.divisibility)}
                            </Text>
                        </View>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            borderTopColor: Colors.lightgray,
                            borderTopWidth: 1,
                            paddingLeft: 20,
                            paddingRight: 20
                        }}>
                            <View style={{ flex: 2, justifyContent: 'center' }}>
                                <Text style={{ fontSize: 15, alignSelf: "flex-start", color: Colors.black }}>
                                    {moment(this.state.dataToShow.created).format('lll')}
                                </Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={{ fontSize: 15, alignSelf: "flex-end", color: Colors.black }}>
                                    {this.state.dataToShow.status}
                                </Text>
                            </View>
                        </View>
                    </View>
                </PopupDialog>
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
    balance: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Colors.lightblue,
    },
    transaction: {
        flex: 5,
        backgroundColor: Colors.lightgray,
    },
    buttonbar: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        paddingHorizontal: 25,
        justifyContent: 'center',
        paddingVertical: 10,
        backgroundColor: 'transparent',
    },
    floatView: {
        position: 'absolute',
        width: 100,
        height: 100,
        top: 200,
        left: 40,
        backgroundColor: 'green',
    },
    submit: {
        backgroundColor: Colors.lightblue,
        height: 50,
        borderRadius: 25,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})

