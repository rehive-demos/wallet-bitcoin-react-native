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
        this.state = {
            title: this.props.title,
            text: this.props.text,
            buttonText: this.props.buttonText,
            buttonId: this.props.buttonId
        }
    }

    goto = (buttonId) => {
        if (buttonId === 1) {
            this.setState({
                title: 'Get started',
                text: 'Tell your customers what your app is about.',
                buttonText: "Let\'s go",
                buttonId: 2
            })
        } else if (buttonId === 2) {
            this.setState({
                title: 'This is a demo app',
                text: 'Note that you have to verify your email or mobile number to claim funds that has been sent to you.',
                buttonId: 3
            })
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image
                        source={require('./../../assets/icons/new_logo.png')}
                        resizeMode="contain"
                        style={styles.image}/>
                </View>
                <Text style={styles.titleText}>
                    {this.state.title}
                </Text>
                <Text style={[styles.titleText,{fontSize:18}]}>
                    {this.state.text}
                </Text>
                {
                    this.state.buttonId !== 3 &&
                    <View style={[styles.buttonBar]}>
                        <View style={[styles.submit, {backgroundColor: 'white', marginRight: 25}]}>

                        </View>
                        <TouchableHighlight
                            onPress={() => this.goto(this.state.buttonId)}
                            style={[styles.submit,{borderWidth:1,borderColor:Colors.lightblue}]}>
                            <Text style={styles.buttonText}>
                                {this.state.buttonText}
                            </Text>
                        </TouchableHighlight>
                    </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        backgroundColor: 'white'
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        maxWidth: 250,
        height: 120,
    },
    titleText: {
        color: Colors.black,
        fontSize: 28,
        paddingVertical: 5
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
        fontSize: 20
    }
})
