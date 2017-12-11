import React, {Component} from 'react'
import {Modal, View, StyleSheet, Text, TouchableHighlight} from 'react-native'
import {ImagePicker} from 'expo'
import Colors from './../../../config/colors'
import Header from './../../../components/header'
import Button from './../../../components/button'

export default class Document extends Component {

    static navigationOptions = {
        title: "Document",
    }

    constructor(props) {
        super(props)
        const params = this.props.navigation.state.params
        this.state = {
            title: params.name,
            modalVisible: false,
        }
    }

    openModal = async () => {
        this.setState({modalVisible: true})
    }

    launchCamera = async () => {

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
        })
        this.setState({modalVisible: false})
        if (!result.cancelled) {
            this.props.navigation.navigate("DocumentUpload", {image: result, type: this.state.title})
        }
    }

    launchImageLibrary = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        })
        this.setState({modalVisible: false})
        if (!result.cancelled) {
            this.props.navigation.navigate("DocumentUpload", {image: result, type: this.state.title})
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Header
                    navigation={this.props.navigation}
                    back
                    title="Document"
                />
                <View style={styles.topContainer}>
                    <Text style={{fontSize: 18, textAlign: 'center'}}>
                        Instructions of why and how to upload a picture of {this.state.title}.
                    </Text>
                </View>
                <View style={styles.bottomContainer}>
                    <View style={{flex: 1}}/>
                    <Button
                        title="Upload"
                        onPress={() => this.openModal()}/>
                </View>
                <Modal
                    animationType={"slide"}
                    transparent
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        console.log("Modal has been closed.")
                    }}>
                    <View style={styles.modal}>
                        <View style={styles.bottomModal}>
                            <View style={[styles.button, {borderBottomColor: 'black'}]}>
                                <Text style={{fontSize: 22, fontWeight: 'bold'}}>
                                    Upload Image
                                </Text>
                            </View>
                            <TouchableHighlight
                                style={styles.button}
                                onPress={() => this.launchCamera()}>
                                <Text style={styles.buttonText}>
                                    Use Camera
                                </Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                style={styles.button}
                                onPress={() => this.launchImageLibrary()}>
                                <Text style={styles.buttonText}>
                                    Choose From Gallery
                                </Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                style={styles.button}
                                onPress={() => {
                                    this.setState({modalVisible: false})
                                }}>
                                <Text style={styles.buttonText}>
                                    Cancel
                                </Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>
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
    topContainer: {
        flex: 1,
        backgroundColor: Colors.lightgray,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomContainer: {
        flex: 3,
        flexDirection: 'column',
    },
    upload: {
        marginBottom: 10,
        marginHorizontal: 20,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.lightblue,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomModal: {
        width: '70%',
        height: 220,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: 'white',
        borderColor: Colors.black,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        height: 50,
        width: "100%",
        borderWidth: 1,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: Colors.black,
    },
})

