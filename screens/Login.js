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
  
  /**
  * login sends the entered details
  * to the API for login validation
  * and sends user to homepage if successful
  */
  async login(email, password){
    //Creates JSON object of email and password
    const res = JSON.stringify({
      email: email,
      password: password
    });

    //HTTP request made to API login endpoint
    return fetch('http://10.0.2.2:3333/api/v0.0.5/login/',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: res
    })
    .then((response) => {
      //If response is OK - no errors, retrieve response token and id and store them in asyncstorage for later access
      if(response.ok){
        response.json().then(json => {
          const token = (json)['token']
          const id = (json)['id']
          const password = this.state.password
          this.storeDetails(token,id,password)

        });
        //Alert user of successful login and navigate to chits page
        Alert.alert('Logged In!');
        this.props.navigation.navigate('Chits')
      }
      else{
        //Aler user of eror. Throw error for use with testing.
        Alert.alert('Error Logging In, Please Check Your Details!')
        
      }
    })
    .catch((error) => {
      console.log(error)
    });
  }

/**
  * storeDetails stores the details sent in login request response in async storage
  * as well as the password the user entered for later use in profile update
  */
  async storeDetails(token,id,password){
    try {
      await AsyncStorage.setItem('token', token)
      await AsyncStorage.setItem('id', id.toString())
      await AsyncStorage.setItem('password',password)

    } catch (e) {
      console.error(e)
    }
  }
  
  render(){
    return(
      <Container style={styles.container}>
      <Container style={styles.loginContainer}>
      <Text style={styles.text}>Please Enter Your Details</Text>
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
          secureTextEntry={true}
          onChangeText={password => this.setState({password: password})}
        />
      
        <Button
          color = '#3700B3'
          onPress={() => {
            this.login(this.state.email,this.state.password);
          }}
        title="Login"/>
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

