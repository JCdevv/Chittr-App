import React, { Component } from 'react';
import { TextInput, Alert,StyleSheet,Button } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container,Body,Text,Header } from 'native-base';

class Login extends Component {
  constructor(props){
    super(props)
    this.state ={
      email: '',
      password: ''
    }
   }

   login(email,password){

    let res = JSON.stringify({
      email: email,
      password: password
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
      if(response.ok){
        response.json().then(json => {
          let token = (json)['token']
          console.log("Token is!: " + token)
          let id = (json)['id']
          this.storeDetails(token,id)

        });
        Alert.alert("Logged In!");
        this.props.navigation.navigate('Chits')
      }
      else{
        Alert.alert("Error Logging In, Please Check Your Details!")
        throw new Error('Login Error')
        
      }
    })
    .catch((error) => {
      console.log(error)
      throw new Error('Login Error')
    });
  }

  async storeDetails(token,id,password){
    try {
      await AsyncStorage.setItem('token', token)
      await AsyncStorage.setItem('id', id.toString())
      await AsyncStorage.setItem('password',this.state.password)

    } catch (e) {
      console.error(e)
    }
  }
  
   render(){
    return(
    <Container style={styles.container}>
      <Text style={styles.text}> Please Enter Your Login Details</Text>
      <Container style={styles.loginContainer}>
        <TextInput 
          placeholder='Email'
          style={{ height: 40, borderColor: 'gray', borderWidth: 1,color: 'white'}} 
          placeholderTextColor={'white'}
          onChangeText={email => this.setState({email: email})}
        />

        <TextInput 
          placeholder='Password'
          style={{ height: 40, borderColor: 'gray', borderWidth: 1,color: 'white'}}
          placeholderTextColor={'white'}
          onChangeText={password => this.setState({password: password})}
        />
      
        <Button
          color = '#3700B3'
          onPress={() => {
            this.login(this.state.email,this.state.password);
          }}
        title="Login"
          />
          </Container>
        
   </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {backgroundColor: '#121212',justifyContent: 'center'},
  loginContainer: {marginTop: 0,backgroundColor: '#121212',justifyContent: 'center'},
  text: {color: '#BB86FC',fontSize: 20,marginTop: 30,textAlign: 'center'}
});

export default Login