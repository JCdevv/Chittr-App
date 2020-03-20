import React, { Component } from 'react';
import { Image,FlatList, ActivityIndicator, Text, View, Button,StyleSheet, Alert } from 'react-native';
import { Footer,Container } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Utils from '../utils/utils'


class Chits extends Component {
  constructor(props){
    super(props);
      this.state ={
      isLoading: true,
      chitData: [],
      location: ''
    }
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
  /**
  * Loops through the response json from the server and if location data is present, stored a new value containing name of location
  */
  async updateJson(json){
    let responseJson = json
    for(let i = 0; i < responseJson.length; i++){
      if(responseJson[i]['location'] != null){
        const locationObject = responseJson[i]['location']
        const latitude = locationObject['latitude']
        const longitude = locationObject['longitude']
        console.log(i)

        await this.getLocationName(latitude,longitude).then((name) =>{
          const locName = name.toString()
          responseJson[i]['locationname'] = locName
        })
      }
      else{
        console.log(i)
        responseJson[i]['locationname'] = " "
      }
    }
    return responseJson
  }

  /**
  * getChits retrives all the chits on the server
  */
  async getChits(){
    //make HTTP request
    return fetch('http://10.0.2.2:3333/api/v0.0.5/chits/')
    .then((response) => response.json())
    .then((responseJson) => {
      //Parse json to check for location and add location name 
      this.updateJson(responseJson).then((json) =>{
        this.setState({
          isLoading: false,
          chitData: json
        });
      })    
    })
    .catch((error) =>{
      console.log(error);
    });
  }

  /**
  * convertToData converts the timestamp sent from server
  * to a readable date
  */
  convertToDate(timestamp){
    //Create date object using timestamp, return it
    const date = new Date(timestamp).toString()
    return date
  }

  /**
  * getLocationName queries the google geocode service with the lat and long of provided location
  * responds with location data of the location. JSON is parsed and approximate location is retrived
  * for displaying on chit.
  */
  async getLocationName(latitude,longitude){
  
      const API_KEY = ''

      //If the user has not selected to send location, location values of 0 are sent. Checking for them.
      if(latitude !== 0 && longitude !==0){
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`
        console.log(url)
        return fetch(url,
        
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
      })
      .then((response) => {
        //if OK - no error
        if(response.ok){
          return response.json(); 
        }
        else{
          console.log('Error with response from Geocode server')
        }
      })
      .then((json) =>{
        const resultArray = (json)['results']
        const firstResult = resultArray[0]
        const resultAddress = firstResult['address_components']
        const streetObject = resultAddress[1]
        const cityObject = resultAddress[3]

        const streetName = streetObject['long_name']
        const cityName = cityObject['long_name']

        const finalName = `${streetName} , ${cityName}`
        return finalName
      })
      .catch((error) => {
        console.log(error);
      });    
    }
  }

  

  /**
  * Called when component is loaded and visible
  */
  componentDidMount(){
    //Get chits
    this.getChits();
    const {navigation} = this.props
    //Event listener listens to when navigation change causes a change in screen focus
    this.reloadChits = navigation.addListener('focus', () =>{ 
      //Load chits incase of change due to chit being posted
			this.getChits()
		});
  } 
  render(){
    const {navigation} = this.props

    if(this.state.isLoading){
      return(
      <View>
        <ActivityIndicator/>
      </View>
      )
    }

    return(
      <Container style = {styles.container}> 
        <FlatList style ={{marginBottom: 10}}
          data={this.state.chitData}
          renderItem={
            ({item,index}) => 
            
            <TouchableOpacity 
              onPress={() =>{this.profileNavigate(item.user.user_id)}}
              style= {{
              flexDirection: "row", alignItems: "center", marginBottom: 5, backgroundColor: '#3700B3'
            }}
            >
  
                <Image 
                style={styles.image}
                source={{uri: `http://10.0.2.2:3333/api/v0.0.5/chits/${item.chit_id}/photo/`}}
                />
                <View style={{flexDirection: 'column', alignItems: 'center'}}>
                <Text style={{
                  color: '#BB86FC'
                }}>{item.chit_content}</Text>
                <Text style={{
                  color: '#BB86FC'
                }}>Posted By: {item.user.given_name}, {item.user.family_name}</Text>

                <Text style={{
                  color: '#BB86FC'
                  }}>
                  {this.convertToDate(item.timestamp)}
                </Text> 

                <Text style={{
                  color: '#BB86FC'
                  }}>
                  
                  {item.locationname}
                </Text> 
  
              </View>
            </TouchableOpacity>
          }
          keyExtractor={(item, index) => index.toString()}
        /> 

      <Footer style={styles.footer}>
        <Button
          color = '#3700B3'
          onPress={() => {
            navigation.navigate('Post')
          }}
        title='Post a Chit'
        />
        <Button
          color = '#3700B3'
          onPress={() => {
            this.profileNavigate(-1)
          }}
        title='View Profile'
        />

        <Button
          color = '#3700B3'
          onPress={() => {
            navigation.navigate('Search')
          }}
        title='User Search'
        />
        </Footer>  
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1,backgroundColor: '#121212'},
  titleText: {color: '#BB86FC',textAlign: 'center',fontSize: 40,marginTop: 10},
  text: {color: '#BB86FC',textAlign: 'center',fontSize: 15,marginTop: 10},
  image: {height: 75,width: 75,justifyContent: 'center',alignItems: 'center'},
  footer: {height: 30,backgroundColor: '#121212'}

});

export default Chits