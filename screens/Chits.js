import React, { Component } from 'react';
import { Image,FlatList, ActivityIndicator, Text, View, Button,StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Footer,Container } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';

class Chits extends Component {
  constructor(props){
    super(props);
    this.state ={
    isLoading: true,
    chitData: []
    }
   }

  profileNavigate(user_id){
    this.getID().then((id) =>{
      if(id == user_id || user_id == -1){
        this.props.navigation.navigate('MyProfile',{
          user_id: id
        })
      }else{
        this.props.navigation.navigate('UserProfile',{
          user_id: id
        })
      }
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

  convertToDate(timestamp){
    console.log(timestamp)
    var date = new Date(timestamp).toString()
    return date
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
      <Container style = {styles.container}> 
        <FlatList style ={{marginBottom: 10}}
          data={this.state.chitData}
          renderItem={
            ({item}) => 
            <TouchableOpacity 
              onPress={() =>{this.profileNavigate(item.user.user_id)}}
              style= {{
              flexDirection: "column", alignItems: "center", marginBottom: 5, backgroundColor: '#3700B3'
            }}
            >
              <Image 
              style={styles.image}
              source={{uri: 'http://10.0.2.2:3333/api/v0.0.5/chits/' + item.chit_id + '/photo/'}}
              />

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
            </TouchableOpacity>
          }
          keyExtractor={({id}) => id}
        /> 

      <Footer style={styles.footer}>
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
            this.profileNavigate(-1)
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