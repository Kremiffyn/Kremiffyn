/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Text,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Bingo from './src/components/BingoGrid';
import Sezony from './src/json/Motywy.json';

function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const isDarkMode = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();

  const date = new Date();

  let Bg;

  if (
    date.getMonth() === 0 ||
    date.getMonth() === 1 ||
    date.getMonth() === 11
  ) {
    Bg = Sezony.Zima[0].Tlo;
  } else if (date.getMonth() >= 2 && date.getMonth() <= 4) {
    Bg = Sezony.Wiosna[0].Tlo;
  } else if (date.getMonth() >= 5 && date.getMonth() <= 7) {
    Bg = Sezony.Lato[0].Tlo;
  } else if (date.getMonth() >= 8 && date.getMonth() <= 10) {
    Bg = Sezony.Jesien[0].Tlo;
  }

  const styles = StyleSheet.create({
    Page: {
      flex: 1,
      backgroundColor: Bg,
    },
    Author: {
      marginLeft: 5,
      marginBottom: 10,
      fontFamily: 'FunnelSans-Regular',
    },
    AuthorView: {
      flex: 1,
      justifyContent: 'flex-end',
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
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Bingo />
      <View style={styles.AuthorView}>
        <Text style={styles.Author}>Kremiffyn</Text>
      </View>
    </View>
  );
}

export default App;
