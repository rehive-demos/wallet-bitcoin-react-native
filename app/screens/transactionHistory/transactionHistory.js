import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    AsyncStorage,
    TouchableHighlight,
    Alert,
    Text,
    ScrollView,
    ListView,
    Image,
    TouchableWithoutFeedback
} from 'react-native'
import moment from 'moment'
import Swiper from 'react-native-swiper'
import PopupDialog from 'react-native-popup-dialog'
import UserInfoService from './../../services/userInfoService'
import AccountService from './../../services/accountService'
import Transactions from './../home/transactions'
import Auth from './../../util/auth'
import NetInfo from './../../util/checkNetConnection'
import Colors from './../../config/colors'
import Header from './../../components/header'
import HomeCard from './../../components/homeCard'
import Icon from 'react-native-vector-icons/MaterialIcons'

let inputLength = 0;

const renderPagination = (index, total, context) => {
    return (
        <View style={styles.paginationStyle}>
            <Text style={{color: 'grey'}}>

            </Text>
        </View>
    )
}

export default class Home extends Component {
    static navigationOptions = {
        label: 'Transactions',
    }

    constructor(props) {
        super(props)
        this.state = {
            balance: 0,
            showTransaction: true,
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
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => JSON.stringify(r1) !== JSON.stringify(r2),
            }),
            transactionView: false
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
            let settings = responseJson.data.settings
            if (settings.allow_transactions === false) {
                this.setState({
                    creditSwitch: false,
                    debitSwitch: false
                })
            }
            if (settings.allow_debit_transactions === false) {
                this.setState({
                    debitSwitch: false
                })
            }
            if (settings.allow_credit_transactions === false) {
                this.setState({
                    creditSwitch: false
                })
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
            const account = responseJson.data.results[0].currencies[0];
            AsyncStorage.setItem("account_reference", JSON.stringify(responseJson.data.results[0].reference));
            let settings = account.settings
            if (settings.allow_transactions === false) {
                this.setState({
                    creditSwitch: false,
                    debitSwitch: false
                })
            }
            if (settings.allow_debit_transactions === false) {
                this.setState({
                    debitSwitch: false
                })
            }
            if (settings.allow_credit_transactions === false) {
                this.setState({
                    creditSwitch: false
                })
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
                    dataSource: this.state.dataSource.cloneWithRows(currencies),
                    selectedCurrency: -1,
                })
            }
        }
        else {
            this.logout();
        }
    }

    logout = () => {
        Auth.logout(this.props.navigation);
    }

    showDialog = (item) => {
        this.setState({dataToShow: item});
        this.popupDialog.show();
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
        this.setState({
            transactionView: true,
            selectedCurrency: index,
            code: this.state.currencies[index].currency.code,
            symbol: this.state.currencies[index].currency.symbol,
            balance: this.setBalance(this.state.currencies[index].available_balance, this.state.currencies[index].currency.divisibility),
        });
    }


    render() {
        return (
            <View style={styles.container}>
                <Header
                    navigation={this.props.navigation}
                    drawer
                    /*homeRight*/
                />
                <View style={styles.balance}>
                    {/*<TouchableHighlight style={{ flex: 1 }}><View></View></TouchableHighlight>*/}
                    <View style={{flex: 4, justifyContent: 'flex-start', alignItems: 'center',}}>
                        {/*<Text style={{ fontSize: 18, color: 'white' }}>
                         {this.state.account}
                         </Text>*/}
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{
                                fontSize: this.state.balance.toFixed(4).replace(/0{0,2}$/, "").toString().length < 11 ? 23 : 12,
                                color: 'white'
                            }}>
                                {this.state.symbol}
                            </Text>
                            <Text onPress={() => this.tap2()}
                                  onLongPress={() => this.longTap1()}
                                  style={{
                                      paddingLeft: 5,
                                      fontSize: this.state.balance.toFixed(4).replace(/0{0,2}$/, "").toString().length < 11 ? 40 : 24,
                                      color: 'white'
                                  }}>
                                {this.state.balance.toFixed(4).replace(/0{0,2}$/, "")}
                            </Text>
                        </View>
                    </View>
                    {/*<TouchableHighlight
                     underlayColor={Colors.lightblue}
                     style={{ flex: 1 }}
                     onPress={() => console.log("Home Screen")}>
                     <View></View>
                     </TouchableHighlight>*/}
                </View>
                <View style={styles.transaction}>
                    {
                        this.state.showTransaction &&
                        <Transactions
                            updateBalance={this.getBalanceInfo}
                            currency={this.state.code}
                            showDialog={this.showDialog}
                            logout={this.logout}/>
                    }
                    {
                        !this.state.showTransaction &&
                        <ListView
                            dataSource={this.state.dataSource}
                            renderRow={(rowData) => {
                                return (
                                    <View style={{
                                        height: 60,
                                        padding: 10,
                                        paddingHorizontal: 20,
                                        borderBottomWidth: 2,
                                        borderBottomColor: Colors.lightgray,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: 'white'
                                    }}>

                                        <View style={{
                                            flexDirection: 'row', flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                            <View style={{flex: 1, justifyContent: 'center'}}>
                                                <Text style={{color: Colors.darkestgray, fontSize: 14}}>
                                                    {rowData.currency.code}
                                                </Text>
                                                <Text style={{color: Colors.black, fontSize: 18}}>
                                                    {rowData.currency.symbol}{rowData.balance.toFixed(4).replace(/0{0,2}$/, "")}
                                                </Text>
                                            </View>
                                        </View>

                                    </View>
                                )
                            }}
                        />
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
                        onPress={() => this.props.navigation.navigate("SendTo", {
                            reference: "",
                            balance: this.state.balance
                        })}>

                        <Text style={{color: 'white', fontSize: 20}}>
                            Send
                        </Text>
                    </TouchableHighlight>
                </View>
                <PopupDialog
                    ref={(popupDialog) => {
                        this.popupDialog = popupDialog;
                    }}
                    width={0.9}
                    height={400}>
                    <View style={{flex: 1}}>
                        <View style={{flex: 3, padding: 20}}>
                            {/*<Image
                             source={require('./../../../assets/icons/placeholder.png')}
                             style={{height: 80, width: 80, margin: 10}}
                             />*/}
                            <View style={{flexDirection:'row'}}>
                                <Text style={{flex:1,textAlign: 'center',fontSize: 20, color: Colors.black}}> Transaction details</Text>

                                <Icon
                                    onPress={()=>{
                                        this.popupDialog.dismiss()
                                    }}
                                    name="clear"
                                    size={30}
                                    color={Colors.lightgray}
                                    style={{marginRight:-10,marginTop:-10}}
                                />
                            </View>

                            <View style={{flexDirection: 'row', paddingTop: 20,}}>
                                <Text style={{textAlign: 'right', flex: 3, fontSize: 20, color: Colors.black}}>
                                    {"Type:"}
                                </Text>
                                <Text style={{flex: 4, fontSize: 20, color: Colors.black, paddingLeft: 8}}>
                                    {this.state.dataToShow.label}
                                </Text>
                            </View>

                            <View style={{flexDirection: 'row', paddingTop: 10,}}>
                                <Text style={{textAlign: 'right', flex: 3, fontSize: 20, color: Colors.black}}>
                                    {"Total amount:"}
                                </Text>
                                <View style={{flex: 4, flexDirection: 'row', paddingLeft: 8, alignItems: 'center'}}>
                                    <Text>
                                        {this.state.dataToShow.total_amount < 0 ? '-' : ''}
                                    </Text>
                                    <Text style={{fontSize: 20, color: Colors.black}}>
                                        {this.state.dataToShow.currency.symbol + Math.abs(this.getAmount(this.state.dataToShow.total_amount, this.state.dataToShow.currency.divisibility))}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.borderLine}/>
                            <View style={{flexDirection: 'row', paddingTop: 10,}}>
                                <Text style={{textAlign: 'right', flex: 3, fontSize: 20, color: Colors.black}}>
                                    {"Amount:"}
                                </Text>
                                <View style={{flex: 4, flexDirection: 'row', paddingLeft: 8, alignItems: 'center'}}>
                                    <Text>
                                        {this.state.dataToShow.amount < 0 ? '-' : ''}
                                    </Text>
                                    <Text style={{fontSize: 20, color: Colors.black}}>
                                        {this.state.dataToShow.currency.symbol + Math.abs(this.getAmount(this.state.dataToShow.amount, this.state.dataToShow.currency.divisibility))}
                                    </Text>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', paddingTop: 10,}}>
                                <Text style={{textAlign: 'right', flex: 3, fontSize: 20, color: Colors.black}}>
                                    {"Fees:"}
                                </Text>
                                <View style={{flex: 4, flexDirection: 'row', paddingLeft: 8, alignItems: 'center'}}>
                                    <Text>
                                        {this.state.dataToShow.fee < 0 ? '-' : ''}
                                    </Text>
                                    <Text style={{fontSize: 20, color: Colors.black}}>
                                        {this.state.dataToShow.currency.symbol + Math.abs(this.getAmount(this.state.dataToShow.fee, this.state.dataToShow.currency.divisibility))}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.borderLine}/>
                            <View style={{flexDirection: 'row', paddingTop: 10,}}>
                                <Text style={{textAlign: 'right', flex: 3, fontSize: 20, color: Colors.black}}>
                                    {"Balance:"}
                                </Text>
                                <View style={{flex: 4, flexDirection: 'row', paddingLeft: 8, alignItems: 'center'}}>
                                    <Text>
                                        {this.state.dataToShow.balance < 0 ? '-' : ''}
                                    </Text>
                                    <Text style={{fontSize: 20, color: Colors.black}}>
                                        {this.state.dataToShow.currency.symbol + Math.abs(this.getAmount(this.state.dataToShow.balance, this.state.dataToShow.currency.divisibility))}
                                    </Text>
                                </View>
                            </View>
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
    falseView: {
        height: 70
    },
    paginationStyle: {
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    paginationText: {
        color: 'white',
        fontSize: 20
    },
    borderLine:{
        borderBottomColor: Colors.lightgray,
        borderBottomWidth: 1,
        width:250,
        paddingTop:10
    }
})

