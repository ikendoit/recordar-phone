import React, { Component } from "react";
import {
  TouchableOpacity,
  Alert,
  AsyncStorage,
  Button,
  View
} from "react-native";
import { styles } from "../style/style.js";

export default class LogoutButton extends Component<Props> {
  constructor(props) {
    super(props);
  }

  async doOut() {
    await this.props.context.reset("");
    this.props.context.loadUser(null);
  }

  async onOut(e) {
    let confirmation = Alert.alert(
      "warning",
      "Would you like to Log Out, deleting all stored local data",
      [
        { text: "No, Cancel", style: "cancel" },
        { text: "Yes, Log Out", onPress: () => this.doOut() }
      ]
    );
  }

  render() {
    return (
      <View style={{ flex: 1, marginTop: 7 }}>
        <Button
          key={"out"}
          style={styles.LogoutButton}
          onPress={this.onOut.bind(this)}
          title="Log Out"
        />
      </View>
    );
  }
}
