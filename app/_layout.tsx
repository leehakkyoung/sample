import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import "react-native-reanimated";

import { WebView } from "react-native-webview";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { usePushNotifications } from "@/hooks/usePushNotification";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const webViewRef = useRef(null);

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [inputText, setInputText] = useState<string>("");
  const [recievedData, setRecievedData] = useState<string>("");

  //expo
  const { expoPushToken } = usePushNotifications();

  const data = JSON.stringify(notification, undefined, 2);

  const handleTextChange = (newText: string) => {
    setInputText(newText);
  };

  const handleButtonPress = () => {
    if (webViewRef.current) {
      console.log("보냄");
      // webViewRef?.current?.postMessage(inputText);
      console.log(expoPushToken);
      webViewRef?.current?.postMessage(expoPushToken?.data);
    }
  };

  const onMessage = (event: any) => {
    const message = event.nativeEvent.data;
    setRecievedData(message);
  };

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            flex: 1,
          }}
        >
          <View
            style={{
              width: "100%",
              backgroundColor: "#e0e0e0",
              borderRadius: 20,
              alignItems: "center",
              padding: 20,
            }}
          >
            <Text>RN 화면</Text>
            <View
              style={{
                marginTop: 20,
                justifyContent: "center",
                alignItems: "center",
                gap: 20,
                flexDirection: "row",
              }}
            >
              <Text>전달 받은 데이터</Text>
              <TextInput value={recievedData} style={styles.input} />
            </View>
            <View
              style={{
                marginTop: 20,
                justifyContent: "center",
                alignItems: "center",
                gap: 20,
                flexDirection: "row",
              }}
            >
              <TextInput
                style={styles.input}
                onChangeText={handleTextChange}
                value={inputText}
              />
              <Button
                onPress={handleButtonPress}
                title="리액트로 전송"
                color="#000"
              />
            </View>
          </View>
        </View>
        <WebView
          ref={webViewRef}
          source={{ uri: "http://192.168.10.56:5173/" }}
          style={styles.webview}
          onMessage={onMessage}
          javaScriptEnabled={true}
        />
      </SafeAreaView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    width: 200,
  },
});
