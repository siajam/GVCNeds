import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import Nexttogo from "./features/nexttogo";

export default function App() {
  return (
    <View style={styles.container}>
      {<Nexttogo></Nexttogo>}
      <Text>Siavash Moradijam GVC Neds technical test</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
