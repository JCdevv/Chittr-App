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
      <View style = {{flex: 1,backgroundColor: '#121212'}}> 
        <FlatList
          data={this.state.chitData}
          renderItem={
            ({item}) => 
            <View>
              <Text style={{
                color: '#BB86FC'
              }}>{item.chit_content}</Text>
              <Text style={{
                color: '#BB86FC'
              }}>Posted By:</Text>
              <Text style={{
                color: '#BB86FC'
              }}>{item.user.given_name}, {item.user.family_name}</Text>
            </View>
          }
          keyExtractor={({id}, index) => id}
        /> 
      <View>
        <Button
          color = '#3700B3'
          onPress={() => {
            this.props.navigation.navigate('Post')
          }}
        title="Post a Chit"
        />
        <Button
          color = '#3700B3'
          onPress={() => {
            this.props.navigation.navigate('Profile')
          }}
        title="View Profile"
        />
        </View>  
      </View>
    );
  }
}

export default Chits