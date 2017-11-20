import React, { Component } from 'react';
import { ImageBackground, Alert, StyleSheet, Text, View, Modal, TouchableOpacity, Image, FormLabel, TextInput, Button } from 'react-native';
// External dependencies
import _ from 'lodash';
import SocketIOClient from 'socket.io-client';
import { Col, Row, Grid } from "react-native-easy-grid";

// We Import our Stylesheet
import GeneralStyle from "./js/GeneralStyle";

// Websocket
const ip = '192.168.1.64';
const port = 80;

class App extends Component {
  state = {
    modalVisible: false,
    ip,
    counterG1: 0,
    counterG2: 0,
    disabled: false,
    buttons: [],
  }

  buttons = [];

  constructor(props) {
    super(props);
    // Open Modal
    setTimeout(() => {
      this._setModalVisible(true);
    }, 2000);
    // TODO
    console.ignoredYellowBox = ['Setting a timer'];
  }

  _connectToWebSocket() {
    // Creating the socket-client instance will automatically connect to the server.
    const options = {
      path: '/turns',
    };
    this.socket = SocketIOClient(`http://${this.state.ip}:${port}`, options);
    // Subscribe to the events
    this.socket.on('turn-created', (payload) => {
      this._setAlertVisible(payload);
    });
    // Get the buttons
    this.socket.emit('get-buttons', {});
    this.socket.on('set-buttons', (payload) => {
      this.setState({buttons: payload});
    });
  }

  /**
   * Shows the modal component
   * 
   * @param {Boolean} visible
   */
  _setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  /**
   * Shows the alert component
   * 
   * @param {object} payload
   */
  _setAlertVisible = (payload) => {
    Alert.alert(
      'Turno',
      `Se ha impreso su turno #${payload.groupName}${payload.counter}`,
      [
        {text: 'Aceptar', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    );
  }

  /**
   * Change the state of the button
   */
  _setDisabled = () => {
    this.setState({disabled: !this.state.disabled});
  }

  /**
   * Emit to the WebSocket server
   */
  _postCreateTurn = (group, stateName) => {
    this.socket.emit('create-turn', {groupName: this._getButtonGroup(group), stateName});
  }

  _getButtonTitle(order) {
    const button = _.find(this.state.buttons, function(o) { return o.order == order; });
    if (!_.isUndefined(button)) {
      return button.title;
    }
    return '';
  }

  _getButtonGroup(order) {
    const button = _.find(this.state.buttons, function(o) { return o.order == order; });
    if (!_.isUndefined(button)) {
      return button.group;
    }
    return '';
  }

  render() {
    return (
      <ImageBackground source={require('./assets/bg-main-grid.png')} style={GeneralStyle.bgImage}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => { this._connectToWebSocket()}}
          >
         <View style={{marginTop: 22}}>
          <View>
            <Text>Ingresa la IP del Panel de Control</Text>
            <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              onChangeText={(ip) => this.setState({ip})}
              value={this.state.ip}
            />
            <Button
              onPress={() => {this._setModalVisible(false); this._connectToWebSocket();}}
              title="Guardar"
              color="#841584"
              accessibilityLabel="Guardar"
            />
          </View>
         </View>
        </Modal>
        <Grid>
          <Row size={20}>
            <Col size={35}>
              <Image source={require('./assets/logo-motorola.png')} style={{ flex: 1, width: undefined, height: undefined, marginLeft: 10 }} resizeMode="contain" />
            </Col>
            <Col size={65}></Col>
          </Row>
          <Row size={20}>
            <Col size={30}></Col>
            <Col size={40}>
              <Image source={require('./assets/btn-takeyourturn.png')} style={{ flex: 1, width: undefined, height: undefined, marginLeft: 0 }} resizeMode="contain" />
            </Col>
            <Col size={30}></Col>
          </Row>
          <Row size={60}>
            <Col size={5}></Col>
            <Col size={30}>
              <Row size={50}>
                <Col size={45}>
                  <TouchableOpacity onPress={() => this._postCreateTurn(0, 'counterG1')}>
                    <Image source={require('./assets/btn-yellow.png')} />
                  </TouchableOpacity>
                </Col>
                <Col size={55}>
                  <Text style={styles.title}>{ this._getButtonTitle(0) }</Text>
                </Col>
              </Row>
              <Row size={50}>
                <Col size={45}>
                  <TouchableOpacity onPress={() => this._postCreateTurn(1, 'counterG2')}>
                    <Image source={require('./assets/btn-blue.png')} />
                  </TouchableOpacity>
                </Col>
                <Col size={55}>
                  <Text style={styles.title}>{ this._getButtonTitle(1) }</Text>
                </Col>
              </Row>
            </Col>
            <Col size={15}></Col>
            <Col size={10}></Col>
            <Col size={35}>
              <Row size={50}>
                <Col size={45}>
                  <TouchableOpacity onPress={() => this._postCreateTurn(2, 'counterG1')}>
                    <Image source={require('./assets/btn-red.png')} />
                  </TouchableOpacity>
                </Col>
                <Col size={55}>
                  <Text style={styles.title}>{ this._getButtonTitle(2) }</Text>
                </Col>
              </Row>
              <Row size={50}>
                <Col size={45}>
                  <TouchableOpacity onPress={() => this._postCreateTurn(3, 'counterG2')}>
                    <Image source={require('./assets/btn-pink.png')} />
                  </TouchableOpacity>
                </Col>
                <Col size={55}>
                  <Text style={styles.title}>{ this._getButtonTitle(3) }</Text>
                </Col>
              </Row>
            </Col>
            <Col size={5}></Col>
          </Row>
        </Grid>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    marginTop: 22,
    marginRight: 22,
    marginBottom: 22,
    marginLeft: 22
  },
  title: {
    fontSize: 30,
    color: 'white'
  }
});

export default App;
