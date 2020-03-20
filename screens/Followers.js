import React, { Component } from 'react';
import { StyleSheet,FlatList, ActivityIndicator, Text, View, TouchableOpacity } from 'react-native';
import { Container } from 'native-base';
import Utils from '../utils/utils'

class Followers extends Component {
  constructor(props){
    super(props);
    this.state ={
        isLoading: true,
        followers: [],
        user_id: -1
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
          user_id: user_id
        })
      }
    })
  }
/**
  * Get Followers takes the ID of the user and uses it 
  * in a HTTP request to get a list of the users current followers
  */
  getFollowers(id){
    //Build URL using ID
    const url = `http://10.0.2.2:3333/api/v0.0.5/user/${id}/followers/`
    console.log(url)
    //make http request
    return fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
    //set state of isLoading to false so loading symbol stops loading and set followers value to returned json
    this.setState({
      isLoading: false,
      followers: responseJson,
      });
    })
    .catch((error) =>{
      console.log(error);
    });
  }
  /**
  * On component mount, get the ID passed from previous screen
  * and use it to get list of followers
  */
  componentDidMount(){
    const id = this.props.route.params.id;
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
      <Container style={styles.container}>
        <FlatList
          data={this.state.followers}
          renderItem={
            ({item,index}) => 
            <TouchableOpacity 
              onPress={() =>{this.profileNavigate(item.user_id)}}
              style= {{
              flexDirection: "column", alignItems: "center", marginBottom: 5, backgroundColor: '#3700B3'
            }}
            >
              <Text style={styles.text}> {item.given_name} {item.family_name}  </Text>
            </TouchableOpacity>
          }
          keyExtractor={(item, index) => index.toString()}
        /> 
    </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1,backgroundColor: '#121212'},
  titleText: {color: '#BB86FC',textAlign: 'center',fontSize: 40,marginTop: 10},
  text: {color: '#BB86FC',textAlign: 'center',fontSize: 25,marginTop: 10},
  image: {height: 75,width: 75,justifyContent: 'center',alignItems: 'center'},
  footer: {height: 30,backgroundColor: '#121212'}

});

export default Followers