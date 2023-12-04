import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, StyleSheet, TouchableOpacity, Text} from "react-native";

const Setting = ({navigation}) =>{
    const logOut =async () =>{
        try {
            await AsyncStorage.clear();
            console.log('AsyncStorage cleared successfully.');
          } catch (error) {
            console.error('Error clearing AsyncStorage:', error);
          }
          navigation.navigate('Login');
    }
    return (
        <View>
            <View style={styles.header}>
                <Text style={styles.txtHeader}>Setting</Text>
            </View>
            <TouchableOpacity style = {styles.btnLogout} onPress={logOut}><Text style={styles.txtLogout}>Log out</Text></TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    header:{
        backgroundColor: "#EF506B",
    },
    txtHeader: {
        color: "#fff",
        fontSize: 22,
        margin: 12,
        fontWeight: "bold"
    },
    btnLogout:{
        backgroundColor: "#EF506B",
        height: 50,
        borderRadius: 10,
        marginTop: 30,
        margin: 10
    },
    txtLogout: {
        color: "#FFF",
        fontWeight: "900",
        fontSize: 20,
        textAlign: "center",
        lineHeight: 50
    }
})
export default Setting;