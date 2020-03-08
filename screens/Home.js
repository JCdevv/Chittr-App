import React, { Component } from 'react';
import { View, Button,StyleSheet } from 'react-native';

class Home extends Component {

   render(){
    return(
      <View style={{flex: 1,backgroundColor: '#121212'}}>
      <Button 
        color = '#3700B3'
        onPress={() => {
          this.props.navigation.navigate('Create')
        }}
       title="Create Account"
      />

      <Button
        color = '#3700B3'
        
        onPress={() => {
          this.props.navigation.navigate('Login')
        }}
      title="Login"
      />
    </View>
    );
  }
}


export default Home