import React, { Component } from 'react';
import { View, Animated }  from 'react-native';


//Simple animation of a ball going from one side to another 
export default class Ball  extends Component {
  componentWillMount() {
    //  this starter position is for android - on Ios need to be 0,0
    this.position = new Animated.ValueXY({x : 0, y : 0 });
    Animated.spring(this.position, {
      toValue: { x: 100, y: 100 }
    }).start();
  }

  render() {
    return (
      <Animated.View style={this.position.getLayout()}>
      <View style={styles.ball} />      
      </Animated.View>
    )
  }
};

const styles = {
    ball: {
        height: 60,
        width: 60,
        borderRadius: 30,
        borderWidth: 30,
        borderColor: 'black',        
    }
}
