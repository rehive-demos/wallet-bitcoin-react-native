import React, {Component} from 'react'
import Expo from 'expo'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    NetInfo,
    Alert,
    Image,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Colors from './../config/colors'
import DrawerButton from './drawerButton'

export default class HomeCard extends Component {
    constructor(props) {
        super(props)
    }

    setBalance = (balance, divisibility) => {
        for (let i = 0; i < divisibility; i++) {
            balance = balance / 10
        }
        let balanceString = balance.toString()
        inputLength = balanceString.length
        return balance
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row', paddingTop: 10}}>
                    <View style={{flex: 1}}>
                        <Text style={[styles.titleText, {fontWeight: 'bold'}]}>
                            {this.props.currency.currency.code} {this.props.accountName}
                        </Text>

                        <Text style={[styles.titleText]}>
                            Balance
                        </Text>
                        <Text style={styles.balanceText}>
                            {this.props.currency.currency.code} {this.setBalance(this.props.currency.balance,this.props.currency.currency.divisibility).toFixed(4).replace(/0{0,2}$/, "")}
                        </Text>
                        <Text style={styles.titleText}>
                            Available
                        </Text>
                        <Text style={styles.balanceText}>
                            {this.props.currency.currency.code} {this.setBalance(this.props.currency.available_balance,this.props.currency.currency.divisibility).toFixed(4).replace(/0{0,2}$/, "")}
                        </Text>
                    </View>
                    <Image
                        source={require('./../../assets/icons/new_logo.png')}
                        resizeMode="contain"
                        style={styles.image}/>
                </View>
                <View style={styles.falseView}/>
                <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
                    <Text style={styles.buttonText}>
                        Withdraw
                    </Text>
                    <Text style={[styles.buttonText, {paddingLeft: 20}]}>
                        Deposit
                    </Text>
                </View>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingBottom: 15,
        marginTop: 20,
        backgroundColor: 'white',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 8,
    },
    imageContainer: {
        justifyContent: 'center',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    titleText: {
        color: Colors.black,
        fontSize: 18,
        paddingTop: 10
    },
    balanceText:{
        color:Colors.black,
        fontWeight:'bold',
        fontSize:20,
    },
    buttonBar: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        paddingVertical: 10,
        justifyContent: 'center',
    },
    submit: {
        backgroundColor: 'white',
        height: 50,
        flex: 1,
        borderRadius: 25,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: Colors.lightblue,
        fontSize: 18,
    },
    falseView: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightgray,
        marginVertical: 15,
        marginHorizontal: -20
    },
})
