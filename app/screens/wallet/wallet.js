import React, {Component} from 'react'
import{
    View,
    Text,
    StyleSheet,
    ListView,
    TouchableHighlight,
    ActivityIndicator
} from 'react-native'
import Header from './../../components/header'
import Colors from './../../config/colors'
import WalletCard from "../../components/walletCard";
import AccountService from './../../services/accountService'
export default class Wallet extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => JSON.stringify(r1) !== JSON.stringify(r2),
            })
        }
    }

    async componentWillMount() {
        this.getAllAccount()
    }

    getAllAccount = async () => {
        let accountResponse = await AccountService.getAllAccounts()
        if (accountResponse.status === 'success') {
            let data = accountResponse.data.results
            let i = 0, j = 0, accountData = [],accountInfo={};
            for (i = 0; i < data.length; i++) {
                let currenciesResponse = await AccountService.getAllAccountCurrencies(data[i].reference)
                if (currenciesResponse.status === 'success') {
                    let currencyData = currenciesResponse.data.results
                    for (j = 0; j < currencyData.length; j++) {
                        accountInfo={accountName:data[i].name,currencies:currencyData[j]}
                        accountData.push(accountInfo)
                    }

                }
            }
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(accountData),
                loading:false,
            })
        }
    }


    render() {
        return (
            <View style={{flex: 1}}>
                <Header
                    navigation={this.props.navigation}
                    title="Wallet"
                    drawer/>
                <View style={{paddingHorizontal: 20, backgroundColor: Colors.lightgray}}>
                    {
                        this.state.loading &&
                        <ActivityIndicator style={{padding: 10}}
                                           size="large"
                        />
                    }
                    {
                        !this.state.loading &&
                        <ListView
                            dataSource={this.state.dataSource}
                            enableEmptySections
                            showsVerticalScrollIndicator={false}
                            renderRow={(rowData) =>
                                <WalletCard accountName={rowData.accountName}
                                            currency={rowData.currencies}/>}
                        />
                    }
                </View>
            </View>
        )
    }
}
