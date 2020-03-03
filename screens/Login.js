import React, { Component } from 'react';
import { TextInput, View, Button,Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

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
      response.json().then(json => {
        let token = (json)['token']
        let id = (json)['id']
        console.log("This is the token: " + token)
        this.storeToken(token)

      });
      Alert.alert("Logged In!");
      this.props.navigation.navigate('Chits')
    })
    .catch((error) => {
      Alert.alert("Error Logging In!");
      console.error(error);
    });
  }

  async storeDetails(token,id){
    try {
      await AsyncStorage.setItem('token', token)
      await AsyncStorage.setItem('id', id)

    } catch (e) {
      console.error(e)
    }
  }
  
   render(){
    return(
    <View>
      <TextInput 
        placeholder='Email'
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} 
        onChangeText={email => this.setState({email: email})}
      />

      <TextInput 
        placeholder='Password'
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} 
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