import { StyleSheet } from "react-native";

import React from "react-native";
const { Dimensions } = React;

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  },
  /* CATEGORY MENU */

  MenuActivator: {
    borderWidth: 4,
    borderColor: "rgba(90, 224, 65,0.6)",
    alignItems: "center",
    justifyContent: "center",
    width: (deviceWidth / 100) * 14,
    height: (deviceWidth / 100) * 14,
    flexDirection: "column",
    marginLeft: "11%",
    backgroundColor: "#fff",
    borderRadius: 100,
    zIndex: 999
  },

  DelButton: {
    justifyContent: "flex-end",
    textAlign: "center"
  },

  LogoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },

  CategoryContainer: {
    flex: 1
  },

  category_wrapper: {
    flex: 1,
    flexDirection: "row",
    padding: 5,
    height: 60
  },

  category: {
    padding: 5,
    backgroundColor: "#10D8A7",
    fontSize: 18,
    textAlign: "center"
  }
});
