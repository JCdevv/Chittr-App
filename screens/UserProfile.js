import React, { Component } from 'react';
import { ActivityIndicator, Text, View, Button,Alert,Image,FlatList } from 'react-native';
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
          chitData: []
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

  async getID(){
      try {
        let id = await AsyncStorage.getItem('id')
        console.log(id)        
        if(id !== null) {
          return id
        }
        return id
      } catch(e) {
        console.error(e)
      }
    } 

  componentDidMount(){
    let id = this.props.route.params.user_id;
    this.setState({id: id})
    this.getProfile(id)

  }

  


  convertToDate(timestamp){
    console.log(timestamp)
    var date = new Date(timestamp).toString()
    return date
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
          let chits = (json)['recent_chits']
          
          this.setState({chitData: chits})
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

      <FlatList
          data={this.state.chitData}
          renderItem={
            ({item}) => 
            <View style= {{
              flexDirection: "column", alignItems: "center", marginBottom: 5, backgroundColor: '#3700B3'
            }}>
              <Image 
              style={{
               height: 75,
               width: 75,
               justifyContent: 'center',
               alignItems: 'center',
 

            }}
            source={{uri: 'http://10.0.2.2:3333/api/v0.0.5/chits/' + item.chit_id + '/photo/'}}
          />

              <Text style={{
                color: '#BB86FC'
              }}>{item.chit_content}</Text>
              
            <Text style={{
                color: '#BB86FC'
              }}>
              {this.convertToDate(item.timestamp)}

              </Text>

      
            </View>
          }
          keyExtractor={({id}) => id}
        /> 


      </View>

      )  
  }
}


export default UserProfile