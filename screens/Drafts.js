import React, { Component } from 'react';
import { TextInput,FlatList, ActivityIndicator, Text, View, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

var RNFS = require('react-native-fs');

class Drafts extends Component {
  constructor(props){
    super(props);
    this.state ={
    isLoading: true,
    drafts: [],
    content: '',
    currentDraft: '',
    index: 0
    }
   }

  readDraft(){
    RNFS.readDir(RNFS.DocumentDirectoryPath +"/config/") // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
    .then((result) => {
      console.log('GOT RESULT', result);

      // stat the first file
      return Promise.all([RNFS.stat(result[0].path), result[0].path]);
    })
    .then((statResult) => {
      if (statResult[0].isFile()) {
        // if we have a file, read it
        return RNFS.readFile(statResult[1], 'utf8');
      }

      return 'no file';
    })
    .then((contents) => {  

      if(contents == ''){
        Alert.alert("No Drafts Current Saved")
        this.props.navigation.navigate("Post")
      }
      this.setState({drafts : contents.split("\n")})
      this.setState({isLoading: false})
      
      
    })
    .catch((err) => {
      console.log(err.message)
    });
  }  

  deleteDraft(index){
    var currentDrafts = this.state.drafts
    currentDrafts.splice(index,1)

    var newDrafts = ''
    for(var i = 0; i < currentDrafts.length; i++){

      if(i == 0){
        newDrafts += currentDrafts[i]
      }
      else{
        newDrafts += "\n"  + currentDrafts[i]
      }
    }

    this.saveDraft(newDrafts)
    this.readDraft()

  }

  updateDraft(){
    var currentDrafts = this.state.drafts
    currentDrafts.splice(this.state.index)
    
    currentDrafts.push(this.state.content)

    var newDrafts = ''
    for(var i = 0; i < currentDrafts.length; i++){

      if(i == 0){
        newDrafts += currentDrafts[i]
      }
      else{
        newDrafts += "\n"  + currentDrafts[i]
      }
    }

    this.saveDraft(newDrafts)
    this.readDraft()
  }

  saveDraft(draft){
    var path = RNFS.DocumentDirectoryPath + '/config/drafts.txt';

    console.log(draft)

    RNFS.writeFile(path, draft, 'utf8')
      .then((success) => {
      Alert.alert("Drafts Updated")
    })
      .catch((err) => {
      console.log(err.message);
    });
  }

  componentDidMount(){
    this.readDraft()
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
      <View style = {{flex: 1,backgroundColor: '#121212'}}> 
        <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1,color: 'white' }} 
          defaultValue = {this.state.currentDraft}
          onChangeText={content => this.setState({content: content})}
        />

        <Button
        onPress={() => {
          this.updateDraft()
          
        }}
        title="Update Draft"
      />


        <FlatList
          data={this.state.drafts}
          renderItem={
            ({item,index}) => 
            <View style= {{
              flexDirection: "column", alignItems: "center", marginBottom: 5, backgroundColor: '#3700B3'
            }}>
              
              <Text style={{
                color: '#BB86FC'
              }}>{item}</Text>
              
              <Button
                color = '#3700B3'
                onPress={() => {
                  this.setState({currentDraft : item})
                  this.setState({index: index})    
               }}
              title="Edit Draft"
             />  

              <Button
                color = '#3700B3'
                onPress={() => {
                  this.deleteDraft(index)    
               }}
              title="Delete Draft"
             />  
            </View>
          }
          keyExtractor={(item, index) => index.toString()}
        /> 
      </View>
    );
  }
}

export default Drafts