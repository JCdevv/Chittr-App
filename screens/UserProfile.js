import React, { Component } from 'react';
import { ActivityIndicator, Text, View, Button,Alert,Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class UserProfile extends Component {
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
    let id = this.props.route.params.user_id;
    this.setState({id: id})
    this.getProfile(id)
  }

  followUser(){
    this.getToken().then(token =>{ 
      return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' +this.state.id +'/follow/',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'X-Authorization' : token
        },
      })
      .then((response) => {
        
      })
      .catch((error) => {
        Alert.alert("Error Grabbing Account Details!");
        console.error(error);
      });
    })    
  }

  getProfile(id){
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
  }

  render(){  
      return(
        <View>
          <Image 
            style={{height: 100,width: 100,justifyContent: 'center', alignItems: 'center', }}
            source={{uri: 'http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.id + '/photo/'}}
          />

          <Text>{this.state.given_name}</Text>
          <Text>{this.state.family_name}</Text>
          <Text>{this.state.email}</Text>
          
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
            this.followUser()
          }}
        title="Follow" 
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
            this.followUser()
          }}
        title="Follow" 
        />
           
      </View>
      )
  }
}


export default UserProfile