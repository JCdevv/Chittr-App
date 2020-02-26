import React, { Component } from 'react';
import { FlatList, ActivityIndicator, Text, TextInput, View, Button,Alert } from 'react-native';

class Login extends Component {
  constructor(props){
    super(props);
    this.state ={
      email: '',
      password: ''
    }
   }

   login(){

    let res = JSON.stringify({
      email: this.state.email,
      password: this.state.password
    });

    console.log(res);

    return fetch("http://10.0.2.2:3333/api/v0.0.5/login/",
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: res
    })
    .then((response) => {
      Alert.alert("Logged In!");
      this.props.navigation.navigate('Chits')
    })
    .catch((error) => {
      Alert.alert("Error Logging In!");
      console.error(error);
    });
  }

   render(){
    return(
    <View>
      <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} 
        onChangeText={email => this.setState({email: email})}
      />

      <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} 
        onChangeText={password => this.setState({password: password})}
      />
     
    <Button
      onPress={() => {
        this.login();
      }}
    title="Login"
/>
   </View>
    );
  }
}

export default Login