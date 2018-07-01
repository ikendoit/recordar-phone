import React, { Component } from "react";
import { TouchableOpacity, Alert } from "react-native";
import { styles } from "../style/style.js";

//COMPONENTS
import { push } from "../utils/notes_query_manager";

export default class PushButton extends Component<Props> {
  constructor(props) {
    super(props);
  }

  async doPush() {
    let result = await push(
      this.props.context.state.notes,
      true,
      this.props.context.state.userID
    );
    this.props.context.loadConflicts([]);
    Alert.alert("success", "push completed");
  }

  async onPush(e) {
    //with new change, this is unecessary
    //await this.props.context.saveNotes(null, this.props.context.state.content);
    let confirmation = await Alert.alert(
      "warning",
      "Would you like to override server",
      [
        { text: "No, Cancel", style: "cancel" },
        { text: "Yes, Override", onPress: () => this.doPush() }
      ]
    );
  }

  render() {
    return (
      <TouchableOpacity
        key={"conflict"}
        style={styles.MenuActivator}
        onPress={this.onPush.bind(this)}
      >
        {this.props.icon}
      </TouchableOpacity>
    );
  }
}
