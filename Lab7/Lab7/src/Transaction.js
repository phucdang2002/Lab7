import axios from "axios";
import { useState, useEffect } from "react";
import { View, FlatList, TouchableHighlight, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native-paper";
import moment from "moment";

const Transaction = ({navigation}) =>{
    const [data, setData] = useState([]);
    const filePath = "https://kami-backend-5rs0.onrender.com/transactions";
    useEffect(() =>{
        axios.get(filePath)
        .then(response =>{
            setData(response.data);
        })
        .catch(error => {
            console.error(error);
        })
    })
    return (
        <SafeAreaView>
            <FlatList
                data={data}
                renderItem={({item})=>(
                    <TouchableHighlight onPress={()=>{navigation.navigate('TransactionDetail', {transaction: item})}}>
                        <View style={styles.container}>
                            <View>
                                <Text style={styles.header}>{item.id} - {moment(item.createdAt).format('MM/DD/YYYY h:mm')} <Text style={styles.cancel}>{item.status==="cancelled"?" - "+item.status:""}</Text></Text>
                                <View style={styles.serviceprice}>
                                    <View style={{width: 300}}>
                                        <FlatList data={item.services} renderItem={({item: service})=>(
                                            <Text numberOfLines={1} ellipsizeMode="tail">- {service.name}</Text>
                                        )}/>
                                    </View>
                                    <Text style={styles.price}>{item.price} ₫</Text>
                                </View>
                                <Text style={styles.customer}>Customer: {item.customer && item.customer.name}</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                )}
            />
            <TouchableOpacity style={styles.btnAdd} onPress={()=>{navigation.navigate('AddTransaction')}}><Text style={styles.txtAdd}>+</Text></TouchableOpacity>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 10,
        margin: 10,
        padding: 10,
    },
    serviceprice: {
        justifyContent: "space-between",
        flexDirection: "row",
        position: "relative",
    },
    header: {
        fontWeight: "bold"
    },
    cancel: {
        color: "#E81123",
        fontWeight: "bold"
    },
    price: {
        color: "#EF506B",
        fontWeight: "bold"
    },
    customer: {
        color: "#7d7d7d"
    },
    btnAdd: {
        position: "absolute",
        bottom: 20, 
        right: 30,
        width: 50,
        height: 50,
        backgroundColor: "#EF506C",
        borderRadius: 50,
    },
    txtAdd: {
        fontSize: 40,
        textAlign: "center",
        lineHeight: 50,
        color: "#FFF"
    }
})
export default Transaction;