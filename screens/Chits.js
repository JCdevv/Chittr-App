import React, { Component } from 'react';
import { Image,FlatList, ActivityIndicator, Text, View, Button } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class Chits extends Component {
  constructor(props){
    super(props);
    this.state ={
    isLoading: true,
    chitData: []
    }
   }

  profileNavigate(){
    this.getID().then((id) =>{
      this.props.navigation.navigate('MyProfile',{
        user_id: id
      })
    })
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
              }}>Posted By:</Text>
              <Text style={{
                color: '#BB86FC'
              }}>{item.user.given_name}, {item.user.family_name}</Text>

              <Button
                color = '#3700B3'
                onPress={() => {
                  
                 this.props.navigation.navigate('UserProfile',{
                    user_id: item.user.user_id
                 })
               }}
              title="Profile"
             />  
            </View>
          }
          keyExtractor={({id}) => id}
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
            this.profileNavigate()
          }}
        title="View Profile"
        />

        <Button
          color = '#3700B3'
          onPress={() => {
            this.props.navigation.navigate('Search')
          }}
        title="User Search"
        />
        </View>  
      </View>
    );
  }
}

export default Chits