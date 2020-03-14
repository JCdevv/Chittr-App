import React, { Component } from 'react';
import { ScrollView,FlatList, ActivityIndicator, Text, TextInput, View, Button,Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class Following extends Component {
  constructor(props){
    super(props);
    this.state ={
        isLoading: true,
        following: [],
        user_id: -1
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

  removeFollow(id){

    this.getToken().then((token) =>{
      let url = "http://10.0.2.2:3333/api/v0.0.5/user/" +id+"/follow/"
      console.log(url)
      return fetch(url,{
        method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization' : token
          },
        }
      )
      .then((response) => response.json())
      .then((responseJson) => {
      this.setState({
        isLoading: false,
        following: responseJson,
        });
      })
      .catch((error) =>{
        console.log(error);
      });
    })
  }

  getFollowing(id){
    let url = "http://10.0.2.2:3333/api/v0.0.5/user/" +id+"/following/"
    console.log(url)
    return fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
    this.setState({
      isLoading: false,
      following: responseJson,
      });
    })
    .catch((error) =>{
      console.log(error);
    });
  }

  componentDidMount(){
    let id = this.props.route.params.id;
    console.log(id);
    this.getFollowing(id)
}    
    
   render(){
    if(this.state.isLoading){
      return(
      <View>
        <ActivityIndicator/>
      </View>
      )
    }

    return(
      <ScrollView>  
        
        <FlatList
    
          data={this.state.following}
          renderItem={
            ({item}) => 
            <View>
              <Text>{item.given_name}, {item.family_name}</Text>

              <Button
            onPress={() => {
              this.removeFollow(item.user_id);
             }}
            title="Remove"
               />
            </View>
          }
          keyExtractor={({id}, index) => id}
        /> 
      </ScrollView>
    );
  }
}

export default Following