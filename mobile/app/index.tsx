import { Image } from "expo-image";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link href={"/about"}>About</Link>
      {/* <Image
        source={{
          uri: "https://media.istockphoto.com/id/2211409841/photo/typing-laptop.webp?a=1&b=1&s=612x612&w=0&k=20&c=LaVJ67eEunNDxVGs7oiRqQzPR1AUKH3KN5j8nkWbwtE=",
        }}
        style={{ width: 100, height: 100 }}
      /> */}
      <Image
        source={require("../assets/images/react-logo.png")}
        style={{ width: 100, height: 100 }}
      />
    </View>
  );
}
