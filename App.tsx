// app.tsx
import React from "react";
import { StatusBar, StyleSheet, useColorScheme, View, Text } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./src/components/HomeScreen";
import LoginScreen from "./src/components/LoginScreen";
import RegisterScreen from "./src/components/RegisterScreen";
import Bingo from "./src/components/BingoGrid";
import Sezony from "./src/json/Motywy.json";
import RankingScreen from "./src/components/RankingScreen";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const isDarkMode = useColorScheme() === "dark";
  const insets = useSafeAreaInsets();

  const date = new Date();

  let Bg;
  if (date.getMonth() === 0 || date.getMonth() === 1 || date.getMonth() === 11) Bg = Sezony.Zima[0].Tlo;
  else if (date.getMonth() >= 2 && date.getMonth() <= 4) Bg = Sezony.Wiosna[0].Tlo;
  else if (date.getMonth() >= 5 && date.getMonth() <= 7) Bg = Sezony.Lato[0].Tlo;
  else Bg = Sezony.Jesien[0].Tlo;

  const styles = StyleSheet.create({
    Page: {
      flex: 1,
      backgroundColor: Bg,
    },
    Author: {
      marginLeft: 5,
      marginBottom: 10,
      fontFamily: "FunnelSans-Regular",
    },
    AuthorView: {
      flex: 1,
      justifyContent: "flex-end",
    },
  });

  return (
    <View
      style={[
        styles.Page,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingRight: insets.right,
          paddingLeft: insets.left,
        },
      ]}
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Bingo" component={Bingo} />
        <Stack.Screen name="Ranking" component={RankingScreen} />
      </Stack.Navigator>
      <View style={styles.AuthorView}>
        <Text style={styles.Author}>Kremiffyn</Text>
      </View>
    </View>
  );
}

export default App;