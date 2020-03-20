import React, { Component } from 'react';
import { StyleSheet,Button} from 'react-native';
import { Container,Body,Text } from 'native-base';


class Home extends Component {

   render(){
    const {navigation} = this.props
    return(
      <Container style={styles.container}>
        <Text style={styles.titleText}>Welcome to Chittr</Text>

        <Text style={styles.text}>Please Select An Option</Text>
          <Body style={{marginTop: 200}}>
            <Button
              color = '#3700B3'
              
              onPress={() => {
                navigation.navigate('Create')
              }}
            title='Create New Account'
          />

          <Button
            color = '#3700B3'
            onPress={() => {
              navigation.navigate('Login')
            }}
          title='Login To Account'
          />
        </Body>
    </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {flex: 1,backgroundColor: '#121212',justifyContent: 'center', flexDirection: 'column'},
  titleText: {color: '#BB86FC',textAlign: 'center',fontSize: 40,marginTop: 10},
  text: {color: '#BB86FC',textAlign: 'center',fontSize: 15,marginTop: 10}

});


export default Home