import React, {Component} from 'react'
import {View, StyleSheet, AsyncStorage, TouchableHighlight, Text, Image, TouchableWithoutFeedback } from 'react-native'
import Swipeout from 'react-native-swipeout';
import moment from 'moment'
import PopupDialog from 'react-native-popup-dialog'
import UserInfoService from './../../services/userInfoService'
import Transactions from './transactions'
import Auth from './../../util/auth'
import Colors from './../../config/colors'
import Header from './../../components/header'

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

    componentDidMount() {
        this.getBalanceInfo()
        this.getUserInfo()
    }

    setBalance = (balance, divisibility) => {
        for (let i = 0; i < divisibility; i++) {
            balance = balance / 10
        }

        return balance
    }

    getUserInfo = async () => {
        let responseJson = await UserInfoService.getUserDetails()
        if (responseJson.status === "success") {
            AsyncStorage.removeItem('user')
            AsyncStorage.setItem('user', JSON.stringify(responseJson.data))
            const token = await AsyncStorage.getItem('token')
            if (token === null) {
                await this.logout()
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
            AsyncStorage.setItem('currency', JSON.stringify(account.currency))
            this.setState({
                symbol: account.currency.symbol,
                reference: responseJson.data.results[0].reference
            })
            this.setState({balance: this.setBalance(account.balance, account.currency.divisibility)})
        }
        else {
            this.logout()
        }
    }

    logout = () => {
        Auth.logout(this.props.navigation)
    }

    showDialog = (item) => {
        this.setState({dataToShow: item});
        this.popupDialog.show()
    }

    getAmount = (amount = 0, divisibility) => {
        for (let i = 0; i < divisibility; i++) {
            amount = amount / 10
        }

        return amount.toFixed(8).replace(/\.?0+$/, "")
    }

    render() {
        let swipeBtns = [{
            text: 'Show',
            backgroundColor: Colors.lightgray,
            underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
            onPress: () => this.props.navigation.navigate(
                'AccountCurrencies',
                {reference: this.state.reference}
            )
        }];
        return (
            <View style={styles.container}>
                <Header
                    navigation={this.props.navigation}
                    drawer
                    homeRight
                />
                <TouchableWithoutFeedback
                    style={{flex: 1}}
                    onPress={() => this.setState({showTransaction: true})}
                >
                    <View style={styles.balance}>
                        <Text style={{fontSize: 20, color: 'white'}}>
                            Cheque Account
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{fontSize: 25, color: 'white'}}>
                                {this.state.symbol}
                            </Text>
                            <Text style={{paddingLeft: 5, fontSize: 40, color: 'white'}}>
                                {this.state.balance.toFixed(4).replace(/0{0,2}$/, "")}
                            </Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback >
                {/*<View style={{
                    position: 'absolute',
                    backgroundColor:'white',
                    height:30,
                    width:30,
                    borderRadius:30,
                    top:130,
                    right:40,
                    alignItems:'center',
                    justifyContent:'center',
                    shadowColor: Colors.lightblue,
                    shadowOffset: {
                        width: 0,
                        height: 3
                    },
                    shadowRadius: 5,
                    shadowOpacity: 1.0,
                    elevation:3
                }}>
                    <Text style={{fontSize: 24, color: Colors.lightblue}}>
                        +
                    </Text>
                </View>*/}
                <View style={styles.transaction}>
                    {   this.state.showTransaction &&
                    <Transactions updateBalance={this.getBalanceInfo} showDialog={this.showDialog}
                                  logout={this.logout}/>
                    }
                </View>
                <View style={styles.buttonbar}>
                    <TouchableHighlight
                        style={styles.submit}
                        onPress={() => this.props.navigation.navigate("Receive")}>
                        <Text style={{color: 'white', fontSize: 20}}>
                            Receive
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={[styles.submit, {marginLeft: 25}]}
                        onPress={() => this.props.navigation.navigate("SendTo", {reference: ""})}>
                        <Text style={{color: 'white', fontSize: 20}}>
                            Send
                        </Text>
                    </TouchableHighlight>
                </View>
                <PopupDialog
                    ref={(popupDialog) => {
                        this.popupDialog = popupDialog;
                    }}
                    height={250}>
                    <View style={{flex: 1}}>
                        <View style={{flex: 3, justifyContent: 'center', alignItems: 'center', padding: 20}}>
                            <Image
                                source={require('./../../../assets/icons/placeholder.png')}
                                style={{height: 80, width: 80, margin: 10}}
                            />
                            <Text style={{fontSize: 20, color: Colors.black}}>
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
                            <View style={{flex: 2, justifyContent: 'center'}}>
                                <Text style={{fontSize: 15, alignSelf: "flex-start", color: Colors.black}}>
                                    {moment(this.state.dataToShow.created).format('lll')}
                                </Text>
                            </View>
                            <View style={{flex: 1, justifyContent: 'center'}}>
                                <Text style={{fontSize: 15, alignSelf: "flex-end", color: Colors.black}}>
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
        backgroundColor: Colors.lightblue,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    transaction: {
        flex: 5,
        paddingHorizontal: 20,
        backgroundColor: Colors.lightgray,
    },
    buttonbar: {
        flexDirection: 'row',
        paddingHorizontal: 25,
        justifyContent: 'center',
        paddingVertical: 10,
        backgroundColor: Colors.lightgray,
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

