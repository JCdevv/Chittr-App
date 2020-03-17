import React, { Component } from 'react';
import { ActivityIndicator, Text, View, Button,Alert,Image,StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Footer } from 'native-base';

class MyProfile extends Component {
    constructor(props){
        super(props);
        this.state ={
          given_name: '',
          family_name: '',
          email: '',
          id: '',
          isLoading: true,
        }
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
  componentDidMount(){
    this.getID().then((id) =>{
      this.setState({id: id})
      this.getProfile(id)
    })
  }

  logout(){
    this.getToken().then((token) =>{
      return fetch('http://10.0.2.2:3333/api/v0.0.5/logout/',
      {
        method: 'POST',
        headers: {
          'X-Authorization': token
        },
      })
      .then((response) => {
        Alert.alert("Logged out")
        this.props.navigation.navigate('Home')
      })
      .catch((error) => {
        Alert.alert("Error Logging Out!");
        console.error(error);
      });
    })
  }

  getProfile(id){
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' +id,
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

          console.log(lname)
          
          this.setState({given_name: fname})
          this.setState({family_name: lname})
          this.setState({email: email})
          this.setState({isLoading: false})
        });
      })
      .catch((error) => {
        Alert.alert("Error Grabbing Account Details!");
        console.error(error);
      });
  }

  render(){
    return(
      <Container style={styles.container}>
          <Image style={styles.image}
            source={{uri: 'http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.id + '/photo/'}}
          />
    
          <Text style={styles.text}>{this.state.given_name}</Text>
          <Text style={styles.text}>{this.state.family_name}</Text>
          <Text style={styles.text}>{this.state.email}</Text>

          <View>
            <Button
            onPress={() => {
              this.props.navigation.navigate('Update',{
                givenName: this.state.given_name,
                familyName: this.state.family_name,
                email: this.state.email
              })
            }}
          title="Update Profile" 
          />
          <Button
            onPress={() => {
              this.props.navigation.navigate('Followers',{
                id: this.state.id
              })
            }}
          title="Followers" 
          />
          
            <Button
              onPress={() => {
                this.props.navigation.navigate('Following',{
                  id: this.state.id
                })
              }}
            title="Following" 
            />  
          
        
        
            <Button
              onPress={() => {
                  this.props.navigation.navigate('Login')
                  this.logout()
              }}
              title="Logout" 
              />  
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1,backgroundColor: '#121212',alignItems: 'center'},
  titleText: {color: '#BB86FC',textAlign: 'center',fontSize: 40,marginTop: 10},
  text: {color: '#BB86FC',textAlign: 'center',fontSize: 15,marginTop: 10},
  image: {height: 200,width: 200,justifyContent: 'center',alignItems: 'center'},
  footer: {height: 30,backgroundColor: '#121212'}

});


export default MyProfile