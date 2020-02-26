import React, { Component } from 'react';
import { FlatList, ActivityIndicator, Text, TextInput, View, Button,Alert } from 'react-native';

class Home extends Component {

   render(){
    return(
      <View>
      <Button
        onPress={() => {
          
        }}
      title="Create Account"
      />

      <Button
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