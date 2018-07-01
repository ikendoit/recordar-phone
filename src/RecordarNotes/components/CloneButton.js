import React, { Component } from "react";
import { TouchableOpacity, Alert } from "react-native";
import { styles } from "../style/style.js";

//COMPONENTS
import { clone } from "../utils/notes_query_manager";

export default class CloneButton extends Component<Props> {
  constructor(props) {
    super(props);
  }

  async doClone() {
    let serverData = await clone(this.props.context.state.userID);
    await this.props.context.initClient(serverData);
    this.props.context.renderContent(null);
    Alert.alert("success", "clone completed");
  }

  async onClone(e) {
    let confirmation = Alert.alert(
      "warning",
      "Would you like to Clone From Server",
      [
        { text: "No, Cancel", style: "cancel" },
        { text: "Yes, Clone It", onPress: () => this.doClone() }
      ]
    );
  }

  render() {
    return (
      <TouchableOpacity
        key={"conflict"}
        style={styles.MenuActivator}
        onPress={this.onClone.bind(this)}
      >
        {this.props.icon}
      </TouchableOpacity>
    );
  }
}
