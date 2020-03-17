import React, { Component } from 'react';
import { StyleSheet,FlatList, ActivityIndicator, Text, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container,Button } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
      <Container style ={styles.container}> 
        <FlatList
    
          data={this.state.following}
          renderItem={
            ({item}) => 
            <View style={{flexDirection: 'row'}}>
              <Text style ={styles.text}>{item.given_name}, {item.family_name}</Text>

              <TouchableOpacity style ={styles.button}
                onPress={() => {
                  this.removeFollow(item.user_id);
                }}>

              <Text style={styles.text}> Unfollow </Text>
              </TouchableOpacity>
            </View>
          }
          keyExtractor={({id}, index) => id}
        /> 
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1,backgroundColor: '#121212',justifyContent: 'center',alignItems: 'center'},
  text: {color: '#BB86FC',textAlign: 'center',fontSize: 15},
  image: {height: 75,width: 75,justifyContent: 'center',alignItems: 'center'},
  footer: {height: 30,backgroundColor: '#121212'},
  button: {alignItems: 'center', marginLeft: 10, backgroundColor: '#DDDDDD'}

});

export default Following