import React, { Component } from "react";
import {
  Text,
  Alert,
  ScrollView,
  View,
  Button,
  TouchableHighlight,
  TextInput,
  Modal
} from "react-native";
import { styles } from "../style/style.js";
import Icon from "react-native-vector-icons/FontAwesome";

export default class TypeNav extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = { modalVisible: false, addType: "" };
  }

  async onChangeType(type) {
    await this.props.context.renderContent(type);
  }

  async onDelete(type) {
    //TODO: alert ask comfirmation
    let notes = this.props.context.state.notes;
    for (let note of notes) {
      if (note.cat_name === this.props.context.state.category) {
        for (let i = 0; i < note.data.length; i++) {
          console.log("checking " + note.data[i].type);
          if (note.data[i].type === type) {
            note.data.splice(i, 1);
            await this.props.context.saveNotes(notes, null);
            this.props.context.renderContent(null);
            this.forceUpdate();
            return;
          }
        }
      }
    }
  }

  /*
        ask to confirm deleting a type
    */
  async askConfirm(type) {
    let confirmation = await Alert.alert(
      "warning",
      "Would you like to Delete Type: " + type,
      [
        { text: "No, Keep It", style: "cancel" },
        { text: "Yes, Kill It", onPress: () => this.onDelete(type) }
      ]
    );
  }

  async onAdd() {
    this.setState({ modalVisible: false });
    let value = this.state.addType;
    if (/^( )*$/.test(value)) {
      return;
    } else {
      let cur_notes = this.props.context.state.notes;
      for (let note of cur_notes) {
        if (note.cat_name === this.props.context.state.category) {
          for (let type of note.data) {
            if (type.type === value) {
              return;
            }
          }

          note.data.push({
            type: value,
            hash: "init hash",
            date: "2012-12-21 12:12:12",
            content: value + " new page at " + this.props.context.state.category
          });
          break;
        }
      }
      await this.props.context.saveNotes(cur_notes, null);
      this.onChangeType(value);
    }
  }

  renderList() {
    for (let note of this.props.context.state.notes) {
      if (note.cat_name === this.props.context.state.category) {
        return note.data.map(type => (
          <View key={type.type} style={styles.CategoryContainer}>
            <TouchableHighlight
              style={styles.category_wrapper}
              onPress={e => this.onChangeType(type.type)}
            >
              <Text style={styles.category}> {type.type} </Text>
            </TouchableHighlight>

            <Icon
              style={styles.DelButton}
              onPress={e => this.askConfirm(type.type)}
              name="times-circle"
              size={27}
              color="#01a699"
            />
          </View>
        ));
      }
    }
  }

  render() {
    return (
      <ScrollView
        ref={scrollView => {
          this.scrollView = scrollView;
        }}
        automaticallyAdjustInsets={true}
        horizontal={true}
        scrollEnabled={true}
        decelerationRate={0}
        snapToAlignment="center"
        scrollEventThrottle={16}
        style={styles.category_container}
      >
        {this.renderList()}
        <View key={"add new Type"} style={styles.category_wrapper}>
          <Icon
            onPress={e => this.setState({ modalVisible: true })}
            name="plus"
            size={27}
            color="#01a699"
          />
        </View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({ modalVisible: false });
          }}
        >
          <View style={{ marginTop: 100 }}>
            <TextInput
              placeholder={"New Type"}
              onChangeText={input => this.setState({ addType: input })}
            />
            <Button onPress={this.onAdd.bind(this)} title="Create new Type" />
          </View>
        </Modal>
      </ScrollView>
    );
  }
}
