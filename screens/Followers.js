import React, { Component } from 'react';
import { StyleSheet,FlatList, ActivityIndicator, Text, View, TouchableOpacity } from 'react-native';
import { Container } from 'native-base';

class Followers extends Component {
  constructor(props){
    super(props);
    this.state ={
        isLoading: true,
        followers: [],
        user_id: -1
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


  getFollowers(id){
    let url = "http://10.0.2.2:3333/api/v0.0.5/user/" +id+"/followers/"
    console.log(url)
    return fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
    this.setState({
      isLoading: false,
      followers: responseJson,
      });
    })
    .catch((error) =>{
      console.log(error);
    });
  }

  componentDidMount(){
    let id = this.props.route.params.id;
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
            ({item}) => 
            <TouchableOpacity 
              onPress={() =>{this.profileNavigate(item.user.user_id)}}
              style= {{
              flexDirection: "column", alignItems: "center", marginBottom: 5, backgroundColor: '#3700B3'
            }}
            >
              <Text style={styles.text}> {item.given_name} {item.family_name}  </Text>
            </TouchableOpacity>
          }
          keyExtractor={({id}, index) => id}
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