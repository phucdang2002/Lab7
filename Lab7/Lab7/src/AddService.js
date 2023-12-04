import axios from "axios";
import { useState } from "react";
import { SafeAreaView, StyleSheet, TextInput } from "react-native";
import { Button, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Add = () =>{
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [token, setToken] = useState('');
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
    const addService = async ()=>{
        await authToken();
        const postData = {
            name: name,
            price: price
        };
        axios.post('https://kami-backend-5rs0.onrender.com/services', postData, {
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
    }

    return (
        <SafeAreaView style={styles.addView}>
            <Text variant="labelLarge">Service name</Text>
            <TextInput style={styles.textField} placeholder="Input a service name" onChangeText={setName}></TextInput>
            <Text variant="labelLarge">Price</Text>
            <TextInput style={styles.textField} keyboardType="numeric" onChangeText={setPrice}></TextInput>
            <Button mode="contained" style = {styles.btnAdd} onPress={addService}><Text style={styles.txtAdd}>Add</Text></Button>
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
export default Add;