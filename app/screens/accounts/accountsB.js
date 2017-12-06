import React, {Component} from 'react'
import {ScrollView, View, ListView, StyleSheet, Text, Alert, RefreshControl} from 'react-native'
import InfiniteScrollView from 'react-native-infinite-scroll-view'
import Icon from 'react-native-vector-icons/Ionicons'
import AccountService from './../../services/accountService'
import CurrencyCircle from './../../components/currencyCircle'
import CurrencyCircleUnselected from './../../components/currencyCircleUnselected'
import Header from './../../components/header'
import Account from './../../components/accountB'
import Colors from './../../config/colors'

export default class Accounts extends Component {
    static navigationOptions = {
        title: 'Accounts',
    }

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => JSON.stringify(r1) !== JSON.stringify(r2),
            }),
        }
    }

    componentWillMount() {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => JSON.stringify(r1) !== JSON.stringify(r2)});
        const data = ["USD", "EUR", "TAKA", "RUPEE"]
        let ids = data.map((obj, index) => index);
        this.setState({
            refreshing: false,
            dataSource: ds.cloneWithRows(data, ids),
        })
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
                    <CurrencyCircle code={"ZAR"}/>
                    <View style={{flex: 1, flexDirection: 'row', paddingHorizontal: 20}}>
                        {/* <CurrencyCircleUnselected code={"USD"} />
                         <CurrencyCircleUnselected code={"EUR"} />
                         <CurrencyCircleUnselected code={"TAKA"} /> */}
                        <ListView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            style={{flexDirection: 'row'}}
                            dataSource={this.state.dataSource}
                            renderRow={(rowData) => <CurrencyCircleUnselected code={rowData}/>}
                        />
                    </View>
                </View>
                <View style={{flex: 1, flexDirection: 'row', backgroundColor: 'white'}}>
                    <View style={{flex: 1, paddingHorizontal: 20, justifyContent: 'center'}}>
                        <Text style={{color: Colors.black, fontSize: 17}}>
                            South African Rand
                        </Text>
                        <Text style={{color: Colors.black, fontSize: 17}}>
                            R1000.00
                        </Text>
                    </View>
                    <View style={{paddingHorizontal: 20, justifyContent: 'center'}}>
                        <Icon
                            name="ios-arrow-up-outline"
                            size={30}
                            color={Colors.black}
                        />
                    </View>
                </View>
                <View style={{flex: 7, flexDirection: 'column', backgroundColor: 'white'}}>
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
                        <Account name={"Cheque account"} symbol={"R"} amount={500.00} active={true}/>
                        <Account name={"Savings account"} symbol={"R"} amount={500.00} active={false}/>
                        <View style={styles.account}>
                            <Text style={{color: Colors.black, fontSize: 20}}>
                                Your ACCOUNTS
                            </Text>
                        </View>
                        <Account name={"Cheque account"} symbol={"R"} amount={500.00} active={false}/>
                        <Account name={"Savings account"} symbol={"R"} amount={500.00} active={false}/>
                        <Text style={styles.addAccountText}
                              onPress={()=>this.props.navigation.navigate('AddAccountB')}>
                            Add account
                        </Text>
                    </ScrollView>
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
        padding:10,
        paddingHorizontal:20,
        fontSize:17
    }
})
