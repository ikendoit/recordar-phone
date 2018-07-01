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

export default class CatNav extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = { modalVisible: false, addCat: "" };
  }

  /*
		generate cat ID
	*/
  gen_id(value) {
    let gen = "";
    let splits = value.split(" ");
    gen += splits.map(word => word[0]).join("");
    gen += value.length;
    gen += splits.map(word => word.length).join("");
    gen += value.charCodeAt(0) + "" + value.charCodeAt(value.length - 1);
    return gen;
  }

  async onChangeCat(cat) {
    await this.props.context.loadCategory(cat);
    await this.props.context.renderContent(null);
  }

  async onDelete(cat) {
    //TODO: alert confirm
    let notes = this.props.context.state.notes;
    for (let i = 0; i < notes.length; i++) {
      if (notes[i].cat_name === cat) {
        //remove this category
        notes.splice(i, 1);
        //reload the new notes data
        //reload new categories data list
        let categories = [];
        for (let note of notes) {
          categories.push(note.cat_name);
        }
        this.props.context.loadCategories(categories);
        //save this notes to redux and offline
        await this.props.context.saveNotes(notes, null);
        //load content of new notes
        this.props.context.renderContent(null);
        return;
      }
    }
  }

  /*
        ask to confirm deleting a category
    */
  async askConfirm(cat) {
    let confirmation = await Alert.alert(
      "warning",
      "Would you like to Delete Category: " + cat,
      [
        { text: "No, Keep It", style: "cancel" },
        { text: "Yes, Kill It", onPress: () => this.onDelete(cat) }
      ]
    );
  }

  async onAdd() {
    this.setState({ modalVisible: false });
    let value = this.state.addCat;
    if (/^( )*$/.test(value)) {
      console.log("empty");
      return;
    } else {
      //if this category already exists
      let cur_notes = this.props.context.state.notes;
      for (let note of cur_notes) {
        if (note.cat_name === value) return;
      }
      cur_notes.push({
        cat_name: value,
        cat_id: this.gen_id(value),
        data: [
          {
            type: value,
            hash: "init hash",
            date: "2012-12-21 12:12:12",
            content: "init note of " + value
          }
        ]
      });

      //save to redux
      await this.props.context.saveNotes(cur_notes, null);
      //reload new categories data list
      let categories = [];
      for (let note of cur_notes) {
        categories.push(note.cat_name);
      }
      this.props.context.loadCategories(categories);
      await this.onChangeCat(value);
    }
  }

  renderList() {
    return this.props.context.state.categories.map(cat => (
      <View key={cat} style={styles.CategoryContainer}>
        <TouchableHighlight
          style={styles.category_wrapper}
          onPress={e => this.onChangeCat(cat)}
        >
          <Text style={styles.category}> {cat} </Text>
        </TouchableHighlight>
        <Icon
          style={styles.DelButton}
          onPress={e => this.askConfirm(cat)}
          name="times-circle"
          size={27}
          color="#01a699"
        />
      </View>
    ));
  }

  render() {
    return (
      <ScrollView
        automaticallyAdjustInsets={false}
        horizontal={true}
        scrollEnabled={true}
        decelerationRate={0}
        snapToAlignment="center"
        scrollEventThrottle={16}
        style={styles.category_container}
      >
        {this.renderList()}
        <View key={"add new Category"} style={styles.category_wrapper}>
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
              placeholder={"New Category"}
              onChangeText={input => this.setState({ addCat: input })}
            />
            <Button
              onPress={this.onAdd.bind(this)}
              title="Create new Category"
            />
          </View>
        </Modal>
      </ScrollView>
    );
  }
}
