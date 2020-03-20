import React, { Component } from 'react';
import { ActivityIndicator, Text, View, Button,Alert,Image,StyleSheet } from 'react-native';
import { Container, Footer } from 'native-base';
import Utils from '../utils/utils'

class MyProfile extends Component {
    constructor(props){
        super(props);
        this.state ={
          given_name: '',
          family_name: '',
          email: '',
          id: '',
          isLoading: true,
          hasLoaded: false,
          url: 'temp'
        }
    }
  /**
  * Gets ID and stores in state
  */
  componentDidMount(){
    //Event listener listens to when navigation change causes a change in screen focus
    this.reloadProfile = this.props.navigation.addListener('focus', () =>
		{ 
      if(this.state.hasLoaded == true){
        //Load chits incase of change due to chit being posted
      this.getProfile(this.state.id)
      //Changes uri due to react native caching images and not showing an update profile picture
      this.setState({url: `http://10.0.2.2:3333/api/v0.0.5/user/${this.state.id}/photo/?` + Math.random()})
      } 
		});
    Utils.getID().then((id) =>{
      this.setState({id: id})
      this.getProfile(id)
      this.setState({url: `http://10.0.2.2:3333/api/v0.0.5/user/${id}/photo/?` + Math.random()})
      this.setState({hasLoaded: true})
    })
  }
  /**
  * If user has pressed logout button, make HTTP request to log them out
  */
  logout(){
    Utils.getToken().then((token) =>{
      return fetch('http://10.0.2.2:3333/api/v0.0.5/logout/',
      {
        method: 'POST',
        headers: {
          'X-Authorization': token
        },
      })
      .then((response) => {
        Alert.alert('Logged out')
        this.props.navigation.navigate('Home')
      })
      .catch((error) => {
        Alert.alert('Error Logging Out!');
        console.error(error);
      });
    })
  }
  /**
  * Get Profile gets the details of the User
  */
  getProfile(id){
    //Make http request
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
          //Parse JSON returned, getting details of user
          let fname = (json)['given_name']
          let lname = (json)['family_name']
          let email = (json)['email']
          //Set returned details to values within state so they can be displayed
          this.setState({given_name: fname})
          this.setState({family_name: lname})
          this.setState({email: email})
          this.setState({isLoading: false})
        });
      })
      .catch((error) => {
        Alert.alert('Error Grabbing Account Details!');
        console.error(error);
      });
  }

  render(){
    const {navigation} = this.props
    return(
      <Container style={styles.container}>
        <Image style={styles.image} source={{uri: this.state.url}}/>
    
        <Text style={styles.text}>{this.state.given_name}</Text>
        <Text style={styles.text}>{this.state.family_name}</Text>
        <Text style={styles.text}>{this.state.email}</Text>

        <View>
          <Button
            color = '#3700B3'
            onPress={() => {
              navigation.navigate('Update',{
                givenName: this.state.given_name,
                familyName: this.state.family_name,
                email: this.state.email
              })
            }}
            title='Update Profile'/>

          <Button
            color = '#3700B3'
              onPress={() => {
                navigation.navigate('Followers',{
                  id: this.state.id
                })
              }}
            title='Followers'/>
          
          <Button
            color = '#3700B3'
              onPress={() => {
                navigation.navigate('Following',{
                  id: this.state.id,
                  currentUser: true
                })
              }}
            title='Following'
            />  

          <Button
            color = '#3700B3'
              onPress={() => {
                navigation.navigate('ProfilePhoto')
              }}
            title='Update Photo' 
            />  
             
          <Button
            color = '#3700B3'
            onPress={() => {
              navigation.navigate('Login')
              this.logout()
            }}
            title='Logout'/>  
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