import React, { Component } from 'react';
import { Alert, StyleSheet, Text, View, Button, CheckBox } from 'react-native';
// External dependencies
import SocketIOClient from 'socket.io-client';
import { Col, Row, Grid } from "react-native-easy-grid";

// We Import our Stylesheet
import GeneralStyle from "./js/GeneralStyle";

class App extends Component {
  state = {
    counterG1: 0,
    counterG2: 0,
    disabled: false,
  }

  constructor(props) {
    super(props);
    // Creating the socket-client instance will automatically connect to the server.
    const options = {
      path: '/turns',
    };
    this.socket = SocketIOClient('http://192.168.1.64:8000', options);
    // Subscribe to the events
    this.socket.on('turn-created', (payload) => {
      console.log('The turn has created!', JSON.stringify(payload));
      this._setAlertVisible({payload});
    });
    // TODO
    console.ignoredYellowBox = ['Setting a timer'];
  }

  /**
   * Shows the alert component
   * 
   * @param {string} groupName
   * @param {string} stateName
   * @param {string} counter
   */
  _setAlertVisible = (groupName, stateName, counter) => {
    Alert.alert(
      'Turno',
      `Se ha impreso su turno #${groupName} - ${counter}`,
      [
        {text: 'Aceptar', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    );
  }

  /**
   * Change the state of the checkbox
   */
  _setDisabled = () => {
    this.setState({disabled: !this.state.disabled});
  }

  /**
   * Emit to the WebSocket server
   */
  _postCreateTurn = (groupName, stateName) => {
    this.socket.emit('create-turn', {groupName, stateName});
  }

  render() {
    return (
      <Grid>
        <Row style={{marginTop: 22, marginBottom: 22, height: 40}}>
          <Col>
            <Text style={styles.h1}>Tome su turno</Text>
          </Col>
          <Col>
            <Row>
              <Col style={{ width: 35 }}>
                <CheckBox
                  onValueChange={this._setDisabled}
                  value={this.state.disabled} />
              </Col>
              <Col>
                <Text style={{ marginTop: 5 }}>Discapacitado</Text>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <Row style={styles.row}>
              <Button onPress={() => {
                  this._postCreateTurn('G1', 'counterG1')
                }}
                title="Moto A" />
            </Row>
          </Col>
          <Col>
            <Row style={styles.row}>
              <Button style={styles.btn} onPress={() => {
                  this._postCreateTurn('G2','counterG2')
                }}
                title="Moto B" />
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <Row style={styles.row}>
              <Button onPress={() => {
                  this._postCreateTurn('G1', 'counterG1')
                }}
                title="Moto C" />
            </Row>
          </Col>
          <Col>
            <Row style={styles.row}>
              <Button onPress={() => {
                  this._postCreateTurn('G2','counterG2')
                }}
                title="Moto D" />
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <Row style={styles.row}>
              <Button onPress={() => {
                  this._postCreateTurn('G1', 'counterG1')
                }}
                title="Moto E" />
            </Row>
          </Col>
          <Col>
            <Row style={styles.row}>
              <Button onPress={() => {
                  this._postCreateTurn('G2','counterG2')
                }}
                title="Moto F" />
            </Row>
          </Col>
        </Row>
      </Grid>
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
  h1: {
    fontSize: GeneralStyle.FONT_SIZE_TITLE,
    lineHeight: GeneralStyle.FONT_SIZE_TITLE * 1.5,
    textAlign: 'center',
  },
  row: {
    marginTop: 22,
    marginRight: 22,
    marginBottom: 22,
    marginLeft: 22
  },
  btn: {
    width: '100%',
  }
});

export default App;
