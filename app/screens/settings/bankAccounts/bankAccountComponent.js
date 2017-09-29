import React, {Component} from 'react'
import {ScrollView, StyleSheet, TouchableHighlight, Text, KeyboardAvoidingView} from 'react-native'
import TextInput from './../../../components/textInput'
import Colors from './../../../config/colors'

export default class BankAccountComponent extends Component {

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior={'padding'}>
                <ScrollView keyboardDismissMode={'interactive'}>
                    <TextInput
                        title="Account holder"
                        placeholder="e.g. John Snow"
                        autoCapitalize="none"
                        value={this.props.values.name}
                        returnKeyType="next"
                        onChangeText={(text) => this.props.updateName(text)}
                        onSubmitEditing={() => { this.refs.account_no.focus(); }}
                    />
                    <TextInput
                        title="Account number"
                        placeholder="e.g. 4083764677"
                        autoCapitalize="none"
                        value={this.props.values.number}
                        returnKeyType="next"
                        ref='account_no'
                        onChangeText={(text) => this.props.updateNumber(text)}
                        onSubmitEditing={() => { this.refs.account_type.focus(); }}
                    />
                    <TextInput
                        title="Account type"
                        placeholder="e.g. Cheque account"
                        autoCapitalize="none"
                        value={this.props.values.type}
                        ref="account_type"
                        returnKeyType="next"
                        onChangeText={(text) => this.props.updateType(text)}
                        onSubmitEditing={() => this.refs.bank_name.focus()}
                    />
                    <TextInput
                        title="Bank name"
                        placeholder="e.g. Bank of World"
                        autoCapitalize="none"
                        value={this.props.values.bank_name}
                        ref="bank_name"
                        returnKeyType="next"
                        onChangeText={(text) => this.props.updateBank(text)}
                        onSubmitEditing={() => this.refs.branch_code.focus()}
                    />
                    <TextInput
                        title="Branch code"
                        placeholder="e.g. 46589"
                        autoCapitalize="none"
                        value={this.props.values.branch_code}
                        ref="branch_code"
                        returnKeyType="next"
                        onSubmitEditing={() => this.refs.swift_code.focus()}
                        onChangeText={(text) => this.props.updateBranch(text)}
                    />
                    <TextInput
                        title="Swift code"
                        placeholder="Usually 8 or 11 characters"
                        autoCapitalize="none"
                        value={this.props.values.swift}
                        ref="swift_code"
                        returnKeyType="next"
                        onSubmitEditing={() => this.refs.IBAN_no.focus()}
                        onChangeText={(text) => this.props.updateSwift(text)}
                    />
                    <TextInput
                        title="IBAN number"
                        placeholder="34 alphanumeric characters"
                        autoCapitalize="none"
                        value={this.props.values.iban}
                        ref="IBAN_no"
                        returnKeyType="next"
                        onSubmitEditing={() => this.refs.BIC_no.focus()}
                        onChangeText={(text) => this.props.updateIBAN(text)}
                    />
                    <TextInput
                        title="BIC number"
                        placeholder="Usually 8 or 11 characters"
                        autoCapitalize="none"
                        value={this.props.values.bic}
                        ref="BIC_no"
                        returnKeyType="next"
                        onChangeText={(text) => this.props.updateBIC(text)}
                    />
                </ScrollView>
                <TouchableHighlight
                    style={styles.submit}
                    ref="save"
                    onPress={this.props.save}>
                    <Text style={{color: 'white', fontSize: 18}}>
                        Save
                    </Text>
                </TouchableHighlight>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    submit: {
        marginTop: 10,
        height: 65,
        backgroundColor: Colors.lightblue,
        width: "100%",
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
    },
})
