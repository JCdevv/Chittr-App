import React, { Component } from 'react';
import { ScrollView,FlatList, ActivityIndicator, Text, TextInput, View, Button,Alert } from 'react-native';

class Followers extends Component {
  constructor(props){
    super(props);
    this.state ={
        isLoading: true,
        followers: [],
        user_id: -1
    }
   }

  getFollowers(id){
    let url = "http://10.0.2.2:3333/api/v0.0.5/user/" +id+"/followers/"
    console.log(url)
    return fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
    this.setState({
      isLoading: false,
      followers: responseJson,
      });
    })
    .catch((error) =>{
      console.log(error);
    });
  }

  componentDidMount(){
    let id = this.props.route.params.id;
    console.log(id);
    this.getFollowers(id)
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
    
          data={this.state.followers}
          renderItem={
            ({item}) => 
            <View>
              <Text>{item.given_name}, {item.family_name}</Text>
            </View>
          }
          keyExtractor={({id}, index) => id}
        /> 
      </ScrollView>
    );
  }
}

export default Followers