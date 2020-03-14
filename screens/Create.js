import React, { Component } from 'react';
import { TextInput, View, Button,Alert } from 'react-native';


class Create extends Component {
  constructor(props){
    super(props);
    this.state ={
      email: '',
      password: '',
      given_name: '',
      family_name: ''
    }
   }

   createAccount(){

    let res = JSON.stringify({
      given_name: this.state.given_name,
      family_name: this.state.family_name,
      email: this.state.email,
      password: this.state.password
    });

    console.log(res);

    return fetch("http://10.0.2.2:3333/api/v0.0.5/user/",
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: res
    })
    .then((response) => {
      Alert.alert("Account Created. Please log in.!");
      this.props.navigation.navigate('Login')
    })
    .catch((error) => {
      Alert.alert("Error Creating Account!");
      console.error(error);
    });
  }
  
   render(){
    return(
    <View>
      <TextInput 
        placeholder='First Name'
        style={{ height: 40, borderColor: 'gray', borderWidth: 1}} 
        onChangeText={given_name => this.setState({given_name: given_name})}
      />

      <TextInput 
        placeholder='Last Name'
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} 
        onChangeText={family_name => this.setState({family_name: family_name})}
      />
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
        this.createAccount();
      }}
    title="Create Account"
/>
   </View>
    );
  }
}

export default Create