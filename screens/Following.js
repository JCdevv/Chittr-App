import React, { Component } from 'react';
import { StyleSheet,FlatList, ActivityIndicator, Text, View, Alert } from 'react-native';
import { Container,Button } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Utils from '../utils/utils'

class Following extends Component {
  constructor(props){
    super(props);
    this.state ={
        isLoading: true,
        following: [],
        user_id: -1,
        currentUser: false,
        id: ''
    }
   }


    /**
  * Profile Navigator handles which profile page to send the user to
  * depending on whether the profile requested is the current users profile
  * or a different users profile
  */
  profileNavigate(user_id){
    Utils.getID().then((id) =>{
      const {navigation} = this.props
      if(id == user_id || user_id == -1){
        navigation.navigate('MyProfile',{
          user_id: id
        })
      }else{
        navigation.navigate('UserProfile',{
          user_id: id
        })
      }
    })
  }
  /**
  * Remove Follow takes the ID of the chosen user, and unfollows them
  */
  removeFollow(id){
    Utils.getToken().then((token) =>{
      //Build URL. Uses token to authenticate current user and ID to unfollow user
      const url = `http://10.0.2.2:3333/api/v0.0.5/user/${id}/follow/`
      console.log(url)
      return fetch(url,{
        method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization' : token
          },
        }
      )
      .then((response) => {
        if(response.ok){
          this.getFollowing(this.state.id)
        }
      })
      .catch((error) =>{
        console.log(error);
      });
    })
  }
/**
  * Get Following takes the ID of the user and uses it 
  * in a HTTP request to get a list of people the user followers
  */
  getFollowing(id){
    const url = `http://10.0.2.2:3333/api/v0.0.5/user/${id}/following/`
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

  /**
  * On component mount, get currentUser value to check if profile is that of current user
  * If so, get following for this user
  * Else, get following of different user
  */
  componentDidMount(){
    let isCurrentUser = this.props.route.params.currentUser
    
    if(isCurrentUser == true){
      Utils.getID().then((id) =>{
        this.getFollowing(id)
        this.setState({id: id})
        this.setState({currentUser: true})
      })
    }
    else{
      let user_id = this.props.route.params.id;
      this.getFollowing(user_id)
    }
}    
    
  render(){
    
      if(this.state.isLoading){
        return(
        <View>
          <ActivityIndicator/>
        </View>
        )
      }
      
      if(!this.state.currentUser){
        return(
          <Container style ={styles.container}> 
            <FlatList
        
              data={this.state.following}
              renderItem={
                ({item,index}) => 
                  <TouchableOpacity 
                    onPress={() =>{this.profileNavigate(item.user_id)}}
                    style= {{flexDirection: "column", alignItems: "center", marginBottom: 5, backgroundColor: '#3700B3'}}>
                    <Text style={styles.text}> {item.given_name} {item.family_name}  </Text>
                  </TouchableOpacity>   
              }
              keyExtractor={(item, index) => index.toString()}
            /> 
          </Container>
        );
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
              keyExtractor={(item, index) => index.toString()}
            /> 
          </Container>
        )
      
    
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