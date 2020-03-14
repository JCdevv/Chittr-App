import React, { Component } from 'react';
import { ActivityIndicator, Text, View, Button,Alert,Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class Profile extends Component {
    constructor(props){
        super(props);
        this.state ={
          given_name: '',
          family_name: '',
          email: '',
          id: '',
          isLoading: true,
        }
    }

  async getToken(){
    try {
      let token = await AsyncStorage.getItem('token')
      console.log("Token is!: " + token)
      if(token !== null) {
        return token
      }
        return token
      } catch(e) {
        console.error(e)
      }
    }
  componentDidMount(){
    this.getProfile()
  }

  logout(){
    this.getToken.then((token) =>{
      return fetch('http://10.0.2.2:3333/api/v0.0.5/logout/',
      {
        method: 'POST',
        headers: {
          'X-Authorization': token
        },
      })
      .then((response) => {
        Alert.alert("Logged out")
        this.props.navigation.navigate('Home')
      })
      .catch((error) => {
        Alert.alert("Error Logging Out!");
        console.error(error);
      });
    })
  }

  getProfile(){
    this.getID().then((id) =>{
      this.setState({id:id})
      return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' +id,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
      })
      .then((response) => {
        response.json().then(json => {
          let fname = (json)['given_name']
          let lname = (json)['family_name']
          let email = (json)['email']
          
          this.setState({given_name: fname})
          this.setState({last_name: lname})
          this.setState({email: email})
          this.setState({isLoading: false})
        });
      })
      .catch((error) => {
        Alert.alert("Error Grabbing Account Details!");
        console.error(error);
      });
    })
  }

  render(){

    if(this.state.isLoading){
      return(
      <View>
        <ActivityIndicator/>
      </View>
      )
    }
    else{

    return(
      <View>

          <Image 
            style={{
              height: 100,
              width: 100,
              justifyContent: 'center',
              alignItems: 'center',
 

            }}
            source={{uri: 'http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.id + '/photo/'}}
          />

          <Text>{this.state.given_name}</Text>
          <Text>{this.state.family_name}</Text>
          <Text>{this.state.email}</Text>

          <Button
          onPress={() => {
            this.props.navigation.navigate('Update',{
              givenName: this.state.given_name,
              familyName: this.state.family_name,
              email: this.state.email
            })
          }}
        title="Update Profile" 
        />
        <Button
          onPress={() => {
            this.props.navigation.navigate('Followers',{
              id: this.state.id
            })
          }}
        title="Followers" 
        />

        <Button
          onPress={() => {
            this.props.navigation.navigate('Following',{
              id: this.state.id
            })
          }}
        title="Following" 
        />  

        <Button
          onPress={() => {
            this.props.navigation.navigate('ProfilePhoto')
          }}
        title="Update Profile Picture" 
        />  

        <Button
          onPress={() => {
            this.props.navigation.navigate('ProfilePhoto')
          }}
        title="Logout" 
        />    
      </View>
      );
    }
  }
}

export default Profile