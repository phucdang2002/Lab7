import axios from "axios";
import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, TextInput } from "react-native";
import { Button, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddCustomer = ({navigation}) =>{
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [token, setToken] = useState("");
    async function authToken() {
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null) {
                setToken(JSON.parse(value));
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        authToken();
      }, []);
    const addCustomer = async ()=>{
        if (!token) {
            await authToken();
        }
        const postData = {
            name: name,
            phone: phone
        };
        console.log(token)
        axios.post('https://kami-backend-5rs0.onrender.com/customers', postData, {
            headers:{
                Authorization: `Bearer ${token}`,
            }
        })
        .then(response =>{
            console.log("Response: ", response.data);
        })
        .catch(error=>{
            console.error("Error: ", error);
        })
        navigation.goBack();
    }

    return (
        <SafeAreaView style={styles.addView}>
            <Text variant="labelLarge">Customer name</Text>
            <TextInput style={styles.textField} placeholder="Input your customer's name" onChangeText={setName}></TextInput>
            <Text variant="labelLarge">Phone</Text>
            <TextInput style={styles.textField} placeholder="Input phone number" keyboardType="numeric" onChangeText={setPhone}></TextInput>
            <Button mode="contained" style = {styles.btnAdd} onPress={addCustomer}><Text style={styles.txtAdd}>Add</Text></Button>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    addView: {
        margin: 10,
    },
    btnAdd: {
        backgroundColor: "#EF506B",
        height: 50,
        borderRadius: 10,
        marginTop: 30
    },
    txtAdd: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold"
    },
    textField: {
        
        padding: 10,
        textAlign: "left",
        backgroundColor: "#ECECEC",
        borderRadius: 10,

    },
})
export default AddCustomer;