import React, {Component} from 'react'
import {ScrollView, View, ListView, StyleSheet, Text, Alert, RefreshControl, TouchableHighlight} from 'react-native'
import InfiniteScrollView from 'react-native-infinite-scroll-view'
import Icon from 'react-native-vector-icons/Ionicons'
import UserInfoService from './../../services/userInfoService'
import AccountService from './../../services/accountService'
import CurrencyCircle from './../../components/currencyCircle'
import AccountsBCurrency from './../../components/accountsBCurrency'
import CurrencyCircleUnselected from './../../components/currencyCircleUnselected'
import Header from './../../components/header'
import Account from './../../components/accountB'
import Colors from './../../config/colors'

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => JSON.stringify(r1) !== JSON.stringify(r2)});

export default class Accounts extends Component {
    static navigationOptions = {
        title: 'Accounts',
    }

    constructor(props) {
        super(props);
        this.state = {
            activeCurrency: '',
            isShown: true,
            balance: 0,
            symbol: '',
            activeCurrencyDescription: '',
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => JSON.stringify(r1) !== JSON.stringify(r2),
            }),
            accountDataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => JSON.stringify(r1) !== JSON.stringify(r2),
            })
        }
    }

    componentWillMount() {
        this.getAllCompanyCurrencies()
        this.getActiveAccount()
    }

    getAllCompanyCurrencies = async () => {
        let responseJson = await UserInfoService.getAllCompanyCurrencies()
        if (responseJson.status === 'success') {
            let data = responseJson.data.results
            let ids = data.map((obj, index) => index);
            this.setState({
                refreshing: false,
                dataSource: ds.cloneWithRows(data, ids)
            })
        }
    }

    getActiveAccount = async () => {
        let responseJson = await UserInfoService.getActiveAccount()
        if (responseJson.status === 'success') {
            let data = responseJson.data.results
            this.setViewAccount(data[0].currencies[0].currency)
            this.getSelectedCurrencyBalance(data[0].currencies[0].currency.code)
        }
    }
    setBalance = (balance, divisibility) => {
        for (let i = 0; i < divisibility; i++) {
            balance = balance / 10
        }
        let balanceString = balance.toString()
        return balance
    }
    setViewAccount = async (rowData) => {
        this.setState({
            activeCurrency: rowData.code,
            symbol: rowData.symbol,
            activeCurrencyDescription: rowData.description,
            isShown: true
        })
        this.getSelectedCurrencyBalance(rowData.code)
    }

    getSelectedCurrencyBalance = async (code) => {
        let responseJson = await AccountService.getSelectedCurrency(code)
        if (responseJson.status === 'success') {
            let data = responseJson.data.results
            let i, j, balance = 0, zarAccount = [];
            for (i = 0; i < data.length; i++) {
                zarAccount = data[i].currencies.filter(account => account.currency.code === code)
                balance = balance + zarAccount[0].balance
            }
            this.setState({
                balance: this.setBalance(balance, zarAccount[0].currency.divisibility),
                accountDataSource: ds.cloneWithRows(data)
            })
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Header
                    navigation={this.props.navigation}
                    back
                    title="Accounts"
                />
                <View style={{flex: 2, padding: 10, paddingTop: 20, flexDirection: 'row', backgroundColor: 'white'}}>
                    <CurrencyCircle code={this.state.activeCurrency}/>
                    <View style={{flex: 1, flexDirection: 'row', paddingHorizontal: 10}}>
                        {/* <CurrencyCircleUnselected code={"USD"} />
                         <CurrencyCircleUnselected code={"EUR"} />
                         <CurrencyCircleUnselected code={"TAKA"} /> */}
                        <ListView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            style={{flexDirection: 'row'}}
                            dataSource={this.state.dataSource}
                            renderRow={(rowData) => <CurrencyCircleUnselected currency={rowData}
                                                                              setViewAccount={this.setViewAccount}/>}
                        />
                    </View>
                </View>
                <View style={{flex: 1, flexDirection: 'row', backgroundColor: 'white'}}>
                    <View style={{flex: 1, paddingHorizontal: 20, justifyContent: 'center'}}>
                        <Text style={{color: Colors.black, fontSize: 17}}>
                            {this.state.activeCurrencyDescription}
                        </Text>
                        <Text style={{color: Colors.black, fontSize: 17}}>
                            {this.state.symbol}{this.state.balance.toFixed(4).replace(/0{0,2}$/, "")}
                        </Text>
                    </View>
                    <TouchableHighlight
                        style={{paddingHorizontal: 20, justifyContent: 'center'}}
                        onPress={() => this.setState({
                            isShown: !this.state.isShown
                        })}
                    >
                        <Icon
                            name="ios-arrow-up-outline"
                            size={30}
                            color={Colors.black}
                        />
                    </TouchableHighlight>
                </View>
                <View style={{flex: 7, flexDirection: 'column', backgroundColor: 'white'}}>
                    {!this.state.isShown &&
                    <ScrollView>
                        <ListView
                            style={{backgroundColor: 'white', borderTopColor: Colors.lightgray, borderTopWidth: 1}}
                            dataSource={this.state.dataSource}
                            renderRow={(rowData) => <AccountsBCurrency rowData={rowData}
                                                                       setViewAccount={this.setViewAccount}/>}
                        />
                    </ScrollView>
                    }
                    { this.state.isShown &&
                    <ScrollView>
                        <View style={{
                            height: 50,
                            padding: 10,
                            paddingHorizontal: 20,
                            justifyContent: 'center',
                            backgroundColor: Colors.lightgray
                        }}>
                            <Text style={{color: Colors.black, fontSize: 20}}>
                                DEFAULT ACCOUNTS
                            </Text>
                        </View>
                        <ListView
                            style={{backgroundColor: 'white', borderTopColor: Colors.lightgray, borderTopWidth: 1}}
                            dataSource={this.state.accountDataSource}
                            renderRow={(rowData) => <Account
                                name={rowData.name}
                                symbol={this.state.symbol}
                                code={this.state.activeCurrency}
                                currencies={rowData.currencies}/>}

                        />
                        {/*<Account name={"Cheque account"} symbol={"R"} amount={500.00} active={true}/>
                         <Account name={"Savings account"} symbol={"R"} amount={500.00} active={false}/>
                         <View style={styles.account}>
                         <Text style={{color: Colors.black, fontSize: 20}}>
                         Your ACCOUNTS
                         </Text>
                         </View>
                         <Account name={"Cheque account"} symbol={"R"} amount={500.00} active={false}/>
                         <Account name={"Savings account"} symbol={"R"} amount={500.00} active={false}/>*/}
                        <Text style={styles.addAccountText}
                              onPress={() => this.props.navigation.navigate('AddAccountB')}>
                            Add account
                        </Text>
                    </ScrollView>
                    }
                </View>
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
    account: {
        height: 50,
        padding: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        backgroundColor: Colors.lightgray
    },
    addAccountText: {
        color: Colors.lightblue,
        padding: 10,
        paddingHorizontal: 20,
        fontSize: 17
    },
})
