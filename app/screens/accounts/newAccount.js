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
            showIcon: false,
        }
    }

    async componentWillMount() {
        this.getActiveAccount()
    }

    getActiveAccount = async () => {
        let responseJson = await UserInfoService.getActiveAccount()
        if (responseJson.status === 'success') {
            let data = responseJson.data.results[0]
            data.activeCurrency=true
            this.setState({
                activeAccount: data,
                loading: false,
            })
            this.getSelectedCurrencies(data)
        }
    }

    getSelectedCurrencies = async (getAccountList) => {
        this.setState({
            loading: true,
            isShown: true,
        })
        if(getAccountList.reference!=this.state.activeAccount.reference){
            this.state.activeAccount.activeCurrency=false
        }else{
            this.state.activeAccount.activeCurrency=true
        }
        let accountResponse = await AccountService.getAllAccounts()
        if (accountResponse.status === 'success') {
            let accountData = accountResponse.data.results
            let UniqueAccount = accountData
            for(let i=0;i<UniqueAccount.length;i++){
                if(UniqueAccount[i].reference===getAccountList.reference){
                    UniqueAccount[i].activeCurrency=true
                }else{
                    UniqueAccount[i].activeCurrency=false
                }
                if(UniqueAccount[i].reference===this.state.activeAccount.reference){
                    UniqueAccount.splice(i, 1)
                }
            }
            if (UniqueAccount.length > 0) {
                this.setState({
                    showIcon: true,
                })
            }
            let responseJson = await AccountService.getAllAccountCurrencies(getAccountList.reference)
            if (responseJson.status === 'success') {
                let data = responseJson.data.results
                this.setState({
                    dataSource: ds.cloneWithRows(UniqueAccount),
                    accountDataSource: ds.cloneWithRows(data),
                    reference: getAccountList.reference,
                    loading: false,
                })
            } else {
                Alert.alert('Error',
                    responseJson.message,
                    [{text: 'OK'}])
            }
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
                        this.getActiveAccount()

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
                    drawer
                    title="Accounts"
                />
                <View style={{
                    paddingVertical: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: Colors.whitesmoke
                }}>
                    <Text style={styles.addAccountText}
                          onPress={() => this.props.navigation.navigate('AddAccountB')}>
                        Add account
                    </Text>
                    {
                        this.state.showIcon &&
                        <TouchableHighlight
                            style={{paddingHorizontal: 20}}
                            underlayColor={Colors.darkestgray}
                            onPress={() => this.setState({
                                isShown: !this.state.isShown
                            })}>
                            <Icon
                                name="ios-arrow-up-outline"
                                size={30}
                                color={Colors.darkestgray}
                            />
                        </TouchableHighlight>
                    }
                </View>
                {/*{
                 this.state.loading &&
                 <View style={{
                 backgroundColor: Colors.whitesmoke,
                 height: 70,
                 alignItems: 'center',
                 justifyContent: 'center'
                 }}>
                 <ActivityIndicator size="large"
                 />
                 </View>
                 }*/}
                <ScrollView
                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    style={{backgroundColor: Colors.whitesmoke, height: 40}}>
                    <View style={styles.currencyListHeader}>

                        <AccountCircle getAccountList={this.state.activeAccount}
                                       getSelectedCurrencies={this.getSelectedCurrencies}/>

                        <ListView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            style={{flexDirection: 'row'}}
                            dataSource={this.state.dataSource}
                            automaticallyAdjustContentInsets={false}
                            enableEmptySections
                            renderRow={(rowData) => <AccountCircle getAccountList={rowData}
                                                                   getSelectedCurrencies={this.getSelectedCurrencies}/>}
                        />
                    </View>

                </ScrollView>

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
                                enableEmptySections
                                renderRow={(rowData) => <Account
                                    reference={this.state.reference}
                                    setActiveCurrency={this.setActiveCurrency}
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
        flexDirection: 'row',
        paddingHorizontal: 20,
        backgroundColor: Colors.whitesmoke
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
        fontSize: 17,
        marginLeft: 20
    },
})
