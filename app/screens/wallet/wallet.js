import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    ListView,
    TouchableHighlight,
    Alert,
    ActivityIndicator,
    ScrollView
} from 'react-native'
import Header from './../../components/header'
import Colors from './../../config/colors'
import WalletCard from "../../components/walletCard";
import AccountService from './../../services/accountService'
import UserInfoService from './../../services/userInfoService'
import ResetNavigation from './../../util/resetNavigation'

export default class Wallet extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            activeAccountLoading:true,
            activeAccount:'',
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => JSON.stringify(r1) !== JSON.stringify(r2),
            }),
            accountDataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => JSON.stringify(r1) !== JSON.stringify(r2),
            })
        }
    }

    async componentWillMount() {
        this.getActiveAccount()
        this.getAllAccount()
    }

    getActiveAccount = async () => {
        let responseJson = await UserInfoService.getActiveAccount()
        if (responseJson.status === 'success') {
            let data = responseJson.data.results[0]
            console.log(data)
            this.setState({
                activeAccount: data,
                activeAccountLoading:false
            })
        }
    }
    getAllAccount = async () => {
        let accountResponse = await AccountService.getAllAccounts()
        if (accountResponse.status === 'success') {
            let data = accountResponse.data.results
            let i = 0, j = 0, accountData = [], accountInfo = {};
            for (i = 0; i < data.length; i++) {
                if (this.state.activeAccount.reference === data[i].reference) {
                    continue
                }
                let currenciesResponse = await AccountService.getAllAccountCurrencies(data[i].reference)
                if (currenciesResponse.status === 'success') {
                    let currencyData = currenciesResponse.data.results
                    for (j = 0; j < currencyData.length; j++) {
                        accountInfo = {accountName: data[i].name, reference:data[i].reference,currencies: currencyData[j]}
                            accountData.push(accountInfo)
                    }
                }
            }
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(accountData),
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
                        ResetNavigation.dispatchToSingleRoute(this.props.navigation, "Wallet")

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
            <View style={{flex: 1}}>
                <Header
                    navigation={this.props.navigation}
                    title="Wallet"
                    drawer/>
                <View style={{flex:1,paddingHorizontal: 20, backgroundColor: Colors.lightgray}}>
                    {
                        this.state.loading &&
                        <ActivityIndicator style={{padding: 10}}
                                           size="large"
                        />
                    }
                    {
                        !this.state.loading &&
                        <ScrollView showsVerticalScrollIndicator={false}>
                            { !this.state.activeAccountLoading &&
                                <WalletCard accountName={this.state.activeAccount.name}
                                            reference={this.state.activeAccount.reference}
                                            currency={this.state.activeAccount.currencies[0]}
                                            setActiveCurrency={this.setActiveCurrency}
                                            active/>
                            }
                            <ListView
                                dataSource={this.state.dataSource}
                                enableEmptySections
                                showsVerticalScrollIndicator={false}
                                renderRow={(rowData) =>
                                    <WalletCard accountName={rowData.accountName}
                                                reference={rowData.reference}
                                                setActiveCurrency={this.setActiveCurrency}
                                                currency={rowData.currencies}/>}
                            />
                            <View style={{height:80}}/>
                        </ScrollView>
                    }
                </View>
            </View>
        )
    }
}
