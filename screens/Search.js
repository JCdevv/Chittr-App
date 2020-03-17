import React, { Component } from 'react';
import { TextInput, View, Button,Image,FlatList,Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class Search extends Component {
  constructor(props){
    super(props)
    this.state ={
      content: '',
      hasSearched: false,
      searchData: []
    }
  }

  search(){
    return fetch("http://10.0.2.2:3333/api/v0.0.5/search_user?q=" + this.state.content)
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
    this.setState({
      hasSearched: true,
      searchData: responseJson,
      
      });
    })
    .catch((error) =>{
      console.log(error);
    });
  }

   render(){

    if(this.state.hasSearched == true){
      return(

        <View>
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
        title="Search"
      />
    

        <FlatList
          data={this.state.searchData}
          renderItem={
            ({item}) => 
            <View style= {{
              flexDirection: "column", alignItems: "center", marginBottom: 5, backgroundColor: '#3700B3'
            }}>
              <Image 
              style={{
               height: 75,
               width: 75,
               justifyContent: 'center',
               alignItems: 'center',
 

            }}
            source={{uri: 'http://10.0.2.2:3333/api/v0.0.5/user/' + item.user_id + '/photo/'}}
          />
              <Text style={{
                color: '#BB86FC'
              }}>{item.given_name}, {item.family_name}</Text>
            </View>
          }
          keyExtractor={({id}) => id}
        /> 
        </View>
      )
    }

    return(

      <View>
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
        title="Search"
      />
    </View>
    );  
  }
}

export default Search