import React, { Component } from 'react';
import { ScrollView,FlatList, ActivityIndicator, Text, TextInput, View, Button,Alert } from 'react-native';

class Chits extends Component {
  constructor(props){
    super(props);
    this.state ={
    isLoading: true,
    chitData: []
    }
   }

  getChits(){
    return fetch("http://10.0.2.2:3333/api/v0.0.5/chits/")
    .then((response) => response.json())
    .then((responseJson) => {
    this.setState({
      isLoading: false,
      chitData: responseJson,
      });
    })
    .catch((error) =>{
      console.log(error);
    });
  }

  componentDidMount(){
    this.getChits();
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

          data={this.state.chitData}
          renderItem={
            ({item}) => 
            <View>
              <Text>{item.chit_content}</Text>
              <Text>Posted By:</Text>
              <Text>{item.user.given_name}, {item.user.family_name}</Text>
            </View>
          }
          keyExtractor={({id}, index) => id}
        /> 
        
      <Button
        onPress={() => {
          this.props.navigation.navigate('Post')
        }}
      title="Post a Chit"
      />
      <Button
        onPress={() => {
          this.props.navigation.navigate('Profile')
        }}
      title="View Profile"
      />
      </ScrollView>
    );
  }
}

export default Chits