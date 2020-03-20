import React, { Component } from 'react';
import { StyleSheet, Text, View, Button,Alert,Image,FlatList } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Container} from 'native-base'
import Utils from '../utils/utils'

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

  /**
  * Use passd ID value to get profile of user with this ID
  */
  componentDidMount(){
    const {navigation} = this.props
    this.reloadProfile = navigation.addListener('focus', () =>{ 
      const id = this.props.route.params.user_id;
      this.setState({id: id})
			this.getProfile(id)
		});
    const id = this.props.route.params.user_id;
    this.setState({id: id})
    this.getProfile(id)

  }

  /**
  * Converts the returned timestamp to a readable date
  */
  convertToDate(timestamp){
    console.log(timestamp)
    var date = new Date(timestamp).toString()
    return date
  }

  /**
  * Allows the user to follow the person who's profile they are currently on
  */
  followUser(){
    Utils.getToken().then(token =>{ 
      return fetch(`http://10.0.2.2:3333/api/v0.0.5/user/${this.state.id}/follow/`,
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
        Alert.alert('Error Grabbing Account Details!');
        console.error(error);
      });
    })    
  }

  /**
  * Gets the profile details of the user of passed ID
  */
  getProfile(id){
    return fetch(`http://10.0.2.2:3333/api/v0.0.5/user/${id}`,
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
          this.setState({family_name: lname})
          this.setState({email: email})
          this.setState({isLoading: false})
        });
      })
      .catch((error) => {
        Alert.alert('Error Grabbing Account Details!');
        console.log(error);
      });
  }

  render(){  
    const {navigation} = this.props
      return(
        <Container style={styles.mainContainer}>
          
            <Image 
              style={{height: 200,width: 200,justifyContent: 'center', alignItems: 'center', }}
              source={{uri: `http://10.0.2.2:3333/api/v0.0.5/user/${this.state.id}/photo/?`+Math.random()}}
            />
          
          <Text style={styles.text}>{this.state.given_name}</Text>
          <Text style={styles.text}>{this.state.family_name}</Text>
          <Text style={styles.text}>{this.state.email}</Text>
        
        <Button
        color = '#3700B3'
          onPress={() => {
            navigation.navigate('Followers',{
              id: this.state.id
            })
          }}
        title='Followers'
        />

        <Button
        color = '#3700B3'
          onPress={() => {
            this.followUser()
          }}
        title='Follow'
        />
        

        <Button
        color = '#3700B3'
          onPress={() => {
            navigation.navigate('Following',{
              id: this.state.id,
              currentUser: false
            })
          }}
        title='Following'
        />    
    
      <View style={{marginTop: 10}}>
      <FlatList
          data={this.state.chitData}
          renderItem={
            ({item,index}) => 
            <View style= {{flexDirection: "row", alignItems: "center", marginBottom: 5, backgroundColor: '#3700B3'}}>
              <Image style={styles.image} source={{uri: `http://10.0.2.2:3333/api/v0.0.5/chits/${item.chit_id}/photo/`}}/>
              <View style= {{flexDirection: "column", alignItems: "center", marginBottom: 5, backgroundColor: '#3700B3'}}>
                <Text style={{
                  color: '#BB86FC'
                }}>{item.chit_content}</Text>
                
                <Text style={{
                  color: '#BB86FC'
                }}>{this.convertToDate(item.timestamp)}</Text>
              </View>
            </View>
          }
          keyExtractor={(item, index) => index.toString()}
        /> 
      </View>    
      </Container>
      )  
  }
}

const styles = StyleSheet.create({
  container: {flex: 1,backgroundColor: '#121212',alignItems: 'center'},
  mainContainer: {backgroundColor: '#121212',alignItems: 'center'},
  text: {color: '#BB86FC',textAlign: 'center',fontSize: 15},
  image: {height: 75,width: 75,justifyContent: 'center',alignItems: 'center'},
  footer: {height: 30,backgroundColor: '#121212'},
  button: {alignItems: 'center', marginLeft: 10, backgroundColor: '#DDDDDD'}

});


export default UserProfile