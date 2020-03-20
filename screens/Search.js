import React, { Component } from 'react';
import { TextInput, View, Button,Image,FlatList,Text, Alert,StyleSheet,TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container } from 'native-base'
import Utils from '../utils/utils'

class Search extends Component {
  constructor(props){
    super(props)
    this.state ={
      content: '',
      hasSearched: false,
      searchData: []
    }
  }
  /**
  * Makes request to server with search query
  * server responds with list of users matching this query
  */
  search(){
    //Make HTTP request
    return fetch(`http://10.0.2.2:3333/api/v0.0.5/search_user?q=${this.state.content}`)
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.length == 0){
        Alert.alert('No Results Found')
      }  
      else{
        this.setState({
          hasSearched: true,
          searchData: responseJson,
          
        });
      }
    })
    .catch((error) =>{
      console.log(error);
    })
  }

  /**
  * Profile Navigator handles which profile page to send the user to
  * depending on whether the profile requested is the current users profile
  * or a different users profile
  */
  profileNavigate(user_id){
    const {navigation} = this.props
    //get current stored ID
    Utils.getID().then((id) =>{
      //if current ID is equal to user_id passed from button press, they are current user and send to my profile
      if(id == user_id || user_id == -1){
        navigation.navigate('MyProfile',{
          user_id: id
        })
      }
      //Else, they are not the current user, send to different user profile page
      else{
        navigation.navigate('UserProfile',{
          user_id: user_id
        })
      }
    })
  }

   render(){

    if(this.state.hasSearched == true && this.state.searchData.length != 0){
      return(

        <Container style={styles.container}>
        <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} 
          onChangeText={content => this.setState({content: content})}
        />

        <Button
        onPress={() => {
          
          this.setState({
            hasSearched: true
          })

          this.search()
        
        }}
        title='Search'
      />
        <FlatList
          data={this.state.searchData}
          renderItem={
            ({item,index}) => 
            <TouchableOpacity 
              onPress={() =>{this.profileNavigate(item.user_id)}}
              style= {{
              flexDirection: "row", alignItems: "center", marginBottom: 5, backgroundColor: '#3700B3'
            }}>
              <Image 
              style={{
               height: 75,
               width: 75,
               justifyContent: 'center',
               alignItems: 'center',
 

            }}
            source={{uri: `http://10.0.2.2:3333/api/v0.0.5/user/${item.user_id}/photo/?` + Math.random()}}
          />
              <Text style={{
                color: '#BB86FC', marginLeft: 30
              }}>{item.given_name}, {item.family_name}</Text>
            </TouchableOpacity>
          }
          keyExtractor={(item, index) => index.toString()}
        /> 
        </Container>
      )
    }

    return(

      <Container style={styles.container}>
        <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1,color: 'white'}} 
          onChangeText={content => this.setState({content: content})}
        />

        <Button
        color = '#3700B3'
        onPress={() => {
          
          this.setState({
            hasSearched: true
          })
          this.search()
        }}
        title="Search"
      />
    </Container>
    );  
  }
}

const styles = StyleSheet.create({
  container: {backgroundColor: '#121212'},
  loginContainer: {marginTop: 0,backgroundColor: '#121212',justifyContent: 'center'},
  text: {color: '#BB86FC',fontSize: 20,marginTop: 30,textAlign: 'center'}
});

export default Search