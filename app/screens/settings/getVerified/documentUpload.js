import React, {Component} from 'react'
import {View, StyleSheet, Image, Alert, Text, TouchableHighlight} from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import SettingsService from './../../../services/settingsService'
import ResetNavigation from './../../../util/resetNavigation'
import Colors from './../../../config/colors'
import Header from './../../../components/header'

export default class DocumentUpload extends Component {
    static navigationOptions = {
        title: 'Document upload',
    }

    constructor(props) {
        super(props)
        const params = this.props.navigation.state.params
        this.state = {
            image: params.image,
            type: params.type,
            getVerified:params.getVerified,
            loading: false,
        }
    }

    goBackAndReload = () => {
        ResetNavigation.dispatchUnderDrawer(this.props.navigation, this.state.getVerified?"GetVerified":"Settings", 'SettingsGetVerified')
    }

    saveImage = async () => {
        this.setState({loading: true})
        const uri = this.state.image.uri
        const parts = uri.split("/")
        const name = parts[parts.length - 1]
        const file = {
            uri,
            name,
            type: 'image/jpg',
        }
        var type = "other"

        // if (this.state.type === "ID Document") {

        // }
        // else if (this.state.type === "ID Selfie") {

        // }
        // else if (this.state.type === "Proof Of Address") {

        // }

        let responseJson = await SettingsService.documentUpload(file, type)
        if (responseJson.status === "success") {
            Alert.alert(
                "Upload successful",
                "Your information will shortly be reviewed by our team.",
                [{text: 'OK', onPress: () => this.goBackAndReload()}]
            )
        }
        else {
            Alert.alert('Error',
                responseJson.message,
                [{text: 'OK'}])
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Header
                    navigation={this.props.navigation}
                    back
                    title="Document upload"
                />
                <View style={styles.container}>
                    <Spinner
                        visible={this.state.loading}
                        textContent={"Uploading..."}
                        textStyle={{color: '#FFF'}}
                    />
                    <TouchableHighlight
                        style={{flex: 1}}
                        onPress={null}>
                        <Image
                            style={{height: 300, width: 300}}
                            source={{uri: this.state.image.uri}}
                        />
                    </TouchableHighlight>
                    <View style={styles.buttonsContainer}>
                        <TouchableHighlight
                            style={[styles.button, {backgroundColor: Colors.red}]}
                            onPress={() => this.props.navigation.goBack()}>
                            <Text style={{color: 'white', fontSize: 20}}>
                                Cancel
                            </Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={styles.button}
                            onPress={() => this.saveImage()}>
                            <Text style={{color: 'white', fontSize: 20}}>
                                Upload
                            </Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        flexDirection: 'column',
        backgroundColor: 'white',
        alignItems: 'center',
    },
    buttonsContainer: {
        height: 65,
        backgroundColor: Colors.lightblue,
        flexDirection: 'row',
        alignSelf: 'stretch',
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})

