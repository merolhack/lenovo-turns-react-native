import React, { Component } from 'react';
import { Image, StyleSheet } from 'react-native';

class BackgroundImage extends Component {
    render() {
      const resizeMode = 'center';
  
      return (
        <Image
          style={styles.backgroundImage}
          source={require('./assets/bg-main-grid.png')}
        />
      );
    }
}
let styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover', // or 'stretch'
    }
});
export default BackgroundImage;
