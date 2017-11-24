import React, {Component} from 'react'
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native'
import Colors from './../config/colors'

export default class Options extends Component {
    constructor(props){
        super(props)
        this.state={
            color:'black'
        }
    }
    render() {
        /*if(this.props.buttonText==='Pending'){
            this.setState({
                color:Colors.lightgray
            })
        }else if (this.props.buttonText==='Verified'){
            this.setState({
                color:Colors.green
            })
        }else if(this.props.buttonText==='Incomplete' || this.props.buttonText==='Denied'){
            this.setState({
                color:Colors.red
            })
        }*/
        return (
            <View style={styles.options}>
                <View style={styles.optionsElement}>
                    <View style={{flex:1,marginRight:8,alignItems:'flex-start'}}>
                        <Text style={[styles.optionsText,{color:'gray',fontSize:20}]}>
                            {this.props.title}
                        </Text>
                        <Text style={styles.optionsText}>
                            {this.props.subtitle}
                        </Text>
                    </View>
                    <TouchableHighlight
                        style={[styles.submit]}
                        onPress={()=>console.log("Pressed")}>
                        <Text style={styles.optionsText}>
                            {this.props.buttonText}
                        </Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    options: {
        paddingVertical: 10,
        paddingHorizontal:20,
        height: 70,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightgray
    },
    optionsElement: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionsText: {
        fontSize: 16,
        color: Colors.black,
    },
    submit: {
        paddingHorizontal: 10,
        marginLeft:8,
        height: 40,
        borderWidth:1,
        borderRadius: 20,
        borderColor: Colors.lightblue,
        alignSelf:'flex-end',
        justifyContent:'center'
    },
})
