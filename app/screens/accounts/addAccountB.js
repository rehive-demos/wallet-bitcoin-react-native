import React, {Component} from 'react'
import {ScrollView, View, ListView, StyleSheet, Text, Alert, RefreshControl, TouchableHighlight} from 'react-native'
import InfiniteScrollView from 'react-native-infinite-scroll-view'
import Icon from 'react-native-vector-icons/Ionicons'
import AccountService from './../../services/accountService'
import CurrencyCircle from './../../components/currencyCircle'
import CurrencyCircleUnselected from './../../components/currencyCircleUnselected'
import Header from './../../components/header'
import Account from './../../components/accountB'
import Colors from './../../config/colors'
import TextInput from "../../components/textInput";

export default class Accounts extends Component {
    static navigationOptions = {
        title: 'Add Account',
    }

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => JSON.stringify(r1) !== JSON.stringify(r2),
            }),
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
                <TextInput
                    title="Account Name"
                    placeholder="e.g. savings"
                    underlineColorAndroid="white"
                />
                <TouchableHighlight
                    style={styles.submit}
                    onPress={() => console.log("Next button Pressed")}>
                    <Text style={{color: 'white', fontSize: 20}}>
                        Next
                    </Text>
                </TouchableHighlight>
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
    addAccount: {
        color: Colors.lightblue,
        padding: 10,
        paddingHorizontal: 20,
        fontSize: 17
    },
    submit: {
        position:'absolute',
        bottom:10,
        left:0,
        right:0,
        marginHorizontal: 20,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.lightblue,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
