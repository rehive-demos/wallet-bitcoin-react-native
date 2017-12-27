import React, {Component} from 'react'
import {
    ScrollView,
    View,
    ListView,
    StyleSheet,
    Text,
    Alert,
    RefreshControl,
    TouchableHighlight,
    ActivityIndicator
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import UserInfoService from './../../services/userInfoService'
import AccountService from './../../services/accountService'
import AccountCircle from '../../components/accountCircle'
import NewAccountName from './../../components/newAccountName'
import Header from './../../components/header'
import ResetNavigation from './../../util/resetNavigation'
import Account from './../../components/newAccountCurrency'
import Colors from './../../config/colors'

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => JSON.stringify(r1) !== JSON.stringify(r2)});

export default class NewAccounts extends Component {
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
            loading: true,
            activeAccount: '',
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => JSON.stringify(r1) !== JSON.stringify(r2),
            }),
            accountDataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => JSON.stringify(r1) !== JSON.stringify(r2),
            }),
            refreshing: false,
            nextUrl: null,
            reference: '',
            data: [],
        }
    }

    async componentWillMount() {
        this.getData()
        this.getActiveAccount()
    }


    /*getCurrencies = async (reference) => {
     let responseJson = await AccountService.getAllAccountCurrencies(reference)
     this.setDataInAccountListView(responseJson)
     }

     loadMoreData = async () => {
     if (this.state.refreshing !== true) {
     this.setState({
     refreshing: true,
     })
     let responseJson = await AccountService.getMoreAccounts(this.state.nextUrl)
     this.setDataInListView(responseJson)
     }
     }*/

    getData = async () => {
        let responseJson = await AccountService.getAllAccounts()
        if (responseJson.status === 'success') {
            let data = responseJson.data.results
            let ids = data.map((obj, index) => index);
            this.setState({
                data,
                dataSource: ds.cloneWithRows(data, ids)
            })
        }
    }

    getActiveAccount = async () => {
        let responseJson = await UserInfoService.getActiveAccount()
        if (responseJson.status === 'success') {
            let data = responseJson.data.results[0]
            this.setState({
                activeAccount: data,
                loading: false,
            })
            this.getSelectedCurrencies(data)
        }
    }

    getSelectedCurrencies = async (getAccountList) => {
        console.log(getAccountList)
        let responseJson = await AccountService.getAllAccountCurrencies(getAccountList.reference)
        if (responseJson.status === 'success') {
            let data = responseJson.data.results
            this.setState({
                accountDataSource: ds.cloneWithRows(data),
                reference: getAccountList.reference,
                activeAccount: getAccountList,
                loading: false,
            })
        }
    }

    setActiveCurrency = async (reference, code) => {
        Alert.alert(
            'Are you sure?',
            'Change your active account.',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
                {
                    text: 'OK', onPress: async () => {
                    let responseJson = await AccountService.setActiveCurrency(reference, code)
                    if (responseJson.status === 'success') {
                        ResetNavigation.dispatchUnderHome(this.props.navigation, "NewAccount")

                    } else {
                        Alert.alert('Error',
                            responseJson.message,
                            [{text: 'OK'}])
                    }
                }
                },
            ]
        )
    }


    render() {
        return (
            <View style={styles.container}>
                <Header
                    navigation={this.props.navigation}
                    back
                    title="Accounts"
                />
                <View style={{backgroundColor:Colors.lightgray}}>
                    <Text style={styles.addAccountText}
                          onPress={() => this.props.navigation.navigate('AddAccountB')}>
                        Add account
                    </Text>
                </View>
                <View style={styles.currencyListHeader}>
                    {
                        !this.state.loading &&
                        <AccountCircle getAccountList={this.state.activeAccount} active/>
                    }
                    <View style={{flex: 1, flexDirection: 'row', paddingHorizontal: 10}}>
                        <ListView
                            pagingEnabled={true}
                            horizontal={true}
                            removeClippedSubviews={false}
                            showsHorizontalScrollIndicator={false}
                            style={{flexDirection: 'row'}}
                            dataSource={this.state.dataSource}
                            /*canLoadMore={!!this.state.nextUrl}
                             onLoadMoreAsync={this.loadMoreData.bind(this)}*/
                            enableEmptySections
                            renderRow={(rowData) => <AccountCircle getAccountList={rowData}
                                                                   getSelectedCurrencies={this.getSelectedCurrencies}/>}
                        />
                    </View>
                </View>
                {/*<View style={{flex: 1, flexDirection: 'row', backgroundColor: Colors.whitesmoke}}>
                 <View style={{flex: 1, paddingHorizontal: 20, justifyContent: 'center'}}>
                 <Text style={{color: Colors.darkestgray, fontSize: 16}}>
                 {this.state.activeCurrencyDescription}
                 </Text>
                 <Text style={{color: Colors.darkestgray, fontSize: 16}}>
                 {this.state.symbol}{this.state.balance.toFixed(4).replace(/0{0,2}$/, "")}
                 </Text>
                 </View>
                 <TouchableHighlight
                 style={{paddingHorizontal: 20, justifyContent: 'center'}}
                 underlayColor={Colors.whitesmoke}
                 onPress={() => this.setState({
                 isShown: !this.state.isShown
                 })}
                 >
                 <Icon
                 name="ios-arrow-up-outline"
                 size={30}
                 color={Colors.darkestgray}
                 />
                 </TouchableHighlight>
                 </View>*/}
                <View style={{flex: 7, flexDirection: 'column', backgroundColor: 'white'}}>
                    {!this.state.isShown &&
                    <ScrollView>
                        <ListView
                            style={{backgroundColor: 'white', borderTopColor: Colors.lightgray, borderTopWidth: 1}}
                            dataSource={this.state.dataSource}
                            renderRow={(rowData) => <NewAccountName getAccountList={rowData}
                                                                    getSelectedCurrencies={this.getSelectedCurrencies}/>}
                        />
                    </ScrollView>
                    }
                    {this.state.isShown &&
                    <ScrollView>
                        <View style={{
                            padding: 10,
                            paddingHorizontal: 20,
                            justifyContent: 'center',
                            backgroundColor: Colors.darkergray,
                        }}>
                            <Text style={{color: Colors.darkestgray, fontWeight: 'bold', fontSize: 12}}>
                                Currencies
                            </Text>
                        </View>
                        {
                            this.state.loading &&
                            <ActivityIndicator style={{padding: 10}}
                                               size="large"
                            />
                        }
                        {
                            !this.state.loading &&
                            <ListView
                                style={{backgroundColor: 'white', borderTopColor: Colors.lightgray, borderTopWidth: 1}}
                                dataSource={this.state.accountDataSource}
                                renderRow={(rowData) => <Account
                                    reference={this.state.reference}
                                    setActiveCurrency={this.setActiveCurrency}
                                    enableEmptySections
                                    currencies={rowData}/>}

                            />
                        }
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
    currencyListHeader: {
        height: 150,
        padding: 10,
        paddingTop: 20,
        flexDirection: 'row',
        backgroundColor: Colors.lightgray
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
