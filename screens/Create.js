import React, { Component } from 'react';
import { TextInput, StyleSheet, Button,Alert,Text } from 'react-native';
import { Container } from 'native-base';


class Create extends Component {
  constructor(props){
    super(props);
    this.state ={
      email: '',
      password: '',
      given_name: '',
      family_name: '',
    }
   }

   /**
  * createAccount makes a HTTP request to user creation endpoint
  */
  createAccount(){
    //Create JSON ovject of account information
    const res = JSON.stringify({
      given_name: this.state.given_name,
      family_name: this.state.family_name,
      email: this.state.email,
      password: this.state.password
    });

    //Make HTTP request
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: res
    })
    .then((response) => {
      const {navigation} = this.props
      //if OK - no error
      if(response.ok){
        //Alert user of success and navigate to login page
        Alert.alert('Account Created. Please log in.!');
        navigation.navigate('Login')
      }
      else{
        //Alert user of error
        Alert.alert('Error Creating Account!, Please Check Your Details Are Correct');
      } 
    })
    .catch((error) => {
      Alert.alert('API is down, pleae try again later.');
      console.log(error);
    });
  }
  
  render(){
    return(
      <Container style={styles.container}>

        <Text style={styles.text}> Please Enter Your Details</Text>
        <TextInput 
          placeholder='First Name'
          style={{ height: 40, borderColor: 'gray', borderWidth: 1,color: 'white'}} 
          placeholderTextColor={'white'}
          onChangeText={given_name => this.setState({given_name: given_name})}
        />

        <TextInput 
          placeholder='Last Name'
          style={{ height: 40, borderColor: 'gray', borderWidth: 1,color: 'white' }} 
          placeholderTextColor={'white'}
          onChangeText={family_name => this.setState({family_name: family_name})}
        />
        <TextInput 
          placeholder='Email'
          style={{ height: 40, borderColor: 'gray', borderWidth: 1,color: 'white' }} 
          placeholderTextColor={'white'}
          onChangeText={email => this.setState({email: email})}
        />

        <TextInput 
          placeholder='Password'
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, color: 'white' }} 
          placeholderTextColor={'white'}
          onChangeText={password => this.setState({password: password})}
        />
     
        <Button
          onPress={() => {
            this.createAccount();
          }}
        title='Create Account'/>
   </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {backgroundColor: '#121212',justifyContent: 'center'},
  loginContainer: {marginTop: 0,backgroundColor: '#121212',justifyContent: 'center'},
  text: {color: '#BB86FC',fontSize: 20,marginTop: 30,textAlign: 'center'}
});

export default Create