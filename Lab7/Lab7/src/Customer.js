import axios from "axios";
import { useEffect, useState } from "react";
import { FlatList, TouchableHighlight, View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import Icon from "react-native-vector-icons/Foundation"
import { SafeAreaView } from "react-native-safe-area-context";

const Customer = ({navigation}) =>{
    const [data, setData] = useState([]);
    const filePath = "https://kami-backend-5rs0.onrender.com/customers";
    useEffect(() =>{
        axios.get(filePath)
        .then(response =>{
            setData(response.data);
        })
        .catch(error => {
            console.error(error);
        })
    });
    return (
        <SafeAreaView>
            <FlatList
                data={data}
                renderItem={({item}) => (
                    <TouchableHighlight onPress={()=>{navigation.navigate("CustomerDetail", {customer:item})}}>
                        <View style={styles.container}>
                            <View>
                                <Text><Text style={styles.title}>Customer: </Text>{item.name}</Text>
                                <Text><Text style={styles.title}>Phone: </Text>{item.phone}</Text>
                                <Text><Text style={styles.title}>Total money: </Text><Text style={styles.price}>{item.totalSpent} ₫</Text></Text>
                            </View>
                            <View style={{margin: 10}}>
                                <Text style={styles.right}><Icon name="crown" color="#EF506C" size={20}/></Text>
                                <Text style={styles.loyalty}>{item.loyalty}</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                )}
                />
                <TouchableOpacity style={styles.btnAdd} onPress={()=>{navigation.navigate("AddCustomer")}}><Text style={styles.txtAdd}>+</Text></TouchableOpacity>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        padding: 10,
        margin: 10,
        borderRadius: 10,
        borderColor: "#a3a3a3",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    title: {
        color: "#6e6e6e",
        fontWeight: "bold",
    },
    price: {
        color: "#EF506C",
        fontWeight: "bold"
    },
    right: {
        textAlign: "center"
    },
    loyalty: {
        color: "#EF506C",
        fontWeight: "bold",
        textTransform: "capitalize"
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
export default Customer;