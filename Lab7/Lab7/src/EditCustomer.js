import axios from "axios";
import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, TextInput } from "react-native";
import { Button, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditCustomer = ({navigation}) =>{
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
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
    useEffect(()=>{
        authToken();
    },[])
    const getId = async ()=> {
        try {
            const value = await AsyncStorage.getItem('id');
            if (value !== null) {
                return JSON.parse(value);
            }
        } catch (error) {
            console.log(error);
        }
    }
    // async function getService() {
    //     try {
    //         const value = await AsyncStorage.getItem('service');
    //         if (value !== null) {
    //             return JSON.parse(value);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    const editCustomer = async ()=>{
        const _id = await getId();
        console.log(token)
        if (!token){
            await authToken();
        }
        const putData = {
            name: name,
            phone: phone
        };
        const filePath = 'https://kami-backend-5rs0.onrender.com/customers/'+_id;
        axios.put(filePath, putData, {
            headers:{
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response =>{
            console.log("Response: ", response.data);
            navigation.goBack();
        })
        .catch(error=>{
            console.error("Error: ", error);
        })
    }
    
    return (
        <SafeAreaView style={styles.addView}>
            <Text variant="labelLarge">Customer name</Text>
            <TextInput style={styles.textField} placeholder="Input a service name" onChangeText={(text)=>setName(text)} />
            <Text variant="labelLarge">Phone</Text>
            <TextInput style={styles.textField} keyboardType="numeric"  onChangeText={(text)=>setPhone(text)}/>
            <Button mode="contained" style = {styles.btnAdd} onPress={editCustomer}><Text style={styles.txtAdd}>Update</Text></Button>
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
export default EditCustomer;