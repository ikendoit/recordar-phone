import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  Form,
  TextInput,
  KeyboardAvoidingView,
  AsyncStorage
} from "react-native";
import { logIn, signUp } from "../utils/user_query_manager";
import { clone } from "../utils/notes_query_manager";

export default class Reception extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      in_username: "",
      in_password: "",
      up_username: "",
      up_password: "",
      up_email: ""
    };
  }

  async onSignIn(e) {
    //TODO: change back to state.in_username and state.in_password
    let response = await logIn("1", "1");
    if (response === 1 || response.flag !== "true") {
      //TODO: message
      console.log("tell user they had it wrong");
      console.log(response);
      return;
    }
    this.props.context.loadUser(response.token);
    let server = await clone(response.token);
    this.props.context.initClient(server);
    this.props.context.renderContent(null);
  }

  async onSignUp(e) {
    let response = await signUp(
      this.state.up_username,
      this.state.up_password,
      this.state.up_email
    );
    if (response === 1 || response.flag !== "true") {
      //TODO: name taken or internet
      console.log("check internet or use different name");
      return;
    }
    this.props.context.loadUser(response.token);
    let server = await clone(response.token);
    this.props.context.initClient(server);
    this.props.context.renderContent(null);
  }

  render() {
    return (
      <KeyboardAvoidingView behavior={"height"} enabled>
        <ScrollView>
          <Text style={{ textAlign: "center", fontSize: 25 }}>
            {" "}
            Receptionist{" "}
          </Text>
          <View key={"signin"}>
            <TextInput
              type="text"
              name="username"
              placeholder="username"
              onChangeText={input => this.setState({ in_username: input })}
            />
            <TextInput
              type="text"
              name="password"
              placeholder="password"
              secureTextEntry={true}
              onChangeText={input => this.setState({ in_password: input })}
            />

            <Button onPress={this.onSignIn.bind(this)} title="Sign In" />
          </View>
          <Text style={{ textAlign: "center" }}> Or </Text>
          <View key={"signup"}>
            <TextInput
              type="text"
              name="UpUsername"
              placeholder="username"
              onChangeText={input => this.setState({ up_username: input })}
            />
            <TextInput
              type="password"
              name="UpPassword"
              placeholder="password"
              secureTextEntry={true}
              onChangeText={input => this.setState({ up_password: input })}
            />
            <TextInput
              type="text"
              name="UpEmail"
              placeholder="email"
              onChangeText={input => this.setState({ up_email: input })}
            />

            <Button onPress={this.onSignUp.bind(this)} title="Sign Up" />
          </View>
          <View style={{ height: 25 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
