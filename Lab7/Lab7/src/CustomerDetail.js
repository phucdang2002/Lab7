import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { Alert, FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import Icon from 'react-native-vector-icons/Entypo';
import { Text } from "react-native-paper";
import {Menu, MenuTrigger, MenuOption, MenuOptions, MenuProvider} from "react-native-popup-menu";
export const CustomerHeader = ({navigation}) => {
    const handleMenuSelect = (option) => {
      if (option==="Edit") {
        navigation.navigate("EditCustomer");
      }else {
        Alert.alert("Warning", "Are you sure you want to remove this client? This will not be possible to return", [{
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {text: 'Delete', onPress: deleteCustomer()}
      ])
      }
    };
  
    return (
      <MenuProvider>
        <Menu onSelect={value => handleMenuSelect(value)}>
          <MenuTrigger>
            <Text style={{marginTop: 16, marginRight: 10}}><Icon name="dots-three-vertical" size={25} color="#fff"/></Text>
          </MenuTrigger>
          <MenuOptions optionsContainerStyle={{marginRight: 50}}>
            <MenuOption value="Edit" text="Edit"/>
            <MenuOption value="Delete" text="Delete"/>
          </MenuOptions>
        </Menu>
      </MenuProvider>
    );
    };
    const Id = async () => {
        try {
        const value = await AsyncStorage.getItem('id');
        if (value !== null) {
            return JSON.parse(value);
        }
        } catch (error) {
            console.log(error);
        }
    };
    const saveId = async(_id) =>{
    try {
        await AsyncStorage.setItem('id', JSON.stringify(_id));
        } catch (error) {
        console.error(error);
        }
    }
    async function authToken() {
        try {
          const value = await AsyncStorage.getItem('token');
          if (value !== null) {
              return JSON.parse(value);
          }
        } catch (error) {
            console.log(error);
        }
    };
    const deleteCustomer = async () =>{
        const _id = await Id();
        const token = await authToken()
        const filePath = "https://kami-backend-5rs0.onrender.com/customers/"+_id;
        axios.delete(filePath,{
            headers: {
                Authorization: `Bearer ${token}`
            },
            })
            .then(() =>{
                Alert.alert("Delete successfully");
            })
            .catch(error => {
                console.error(error);
            })
    }
    
    const CustomerDetail = ({route}) => {
        const {customer} = route.params;
        const {_id} = customer;
        saveId(_id);
        const [data, setData] = useState([]);
        const filePath = "https://kami-backend-5rs0.onrender.com/customers/"+_id;
        useEffect(() =>{
            axios.get(filePath)
            .then(response =>{
                setData(response.data);
            })
            .catch(error => {
                console.error(error);
            })
        },[]);

    return(
        <SafeAreaView>
            <View style={styles.container}>
                <Text style={styles.title}>General information</Text>
                <Text><Text variant="labelLarge">Name: </Text>{data.name}</Text>
                <Text><Text variant="labelLarge">Phone: </Text>{data.phone}</Text>
                <Text><Text variant="labelLarge">Total spent: </Text><Text style={styles.price}>{data.totalSpent} ₫</Text></Text>
                <Text variant="labelLarge">Time: </Text>
                <Text variant="labelLarge">Last update: </Text>
            </View>
            <View style={styles.container}>
                <Text style={styles.title}>Transaction history</Text>
                <FlatList
                data={data.transactions}
                renderItem={({item})=>(
                    <View style={styles.box}>
                        <Text variant="labelLarge">{item.id} - {moment(item.createdAt).format('DD/MM/YYYY h:mm:ss')}</Text>
                        <View style={styles.servicePrice}>
                            <FlatList
                            data={item.services}
                            renderItem={({item:service})=>(
                                <Text numberOfLines={1} ellipsizeMode="tail" style={{width: 250}}>- {service.name}</Text>
                            )}/>
                            <Text style={styles.price}>{item.price} ₫</Text>
                        </View>
                        
                    </View>
                )}/>
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    title: {
        fontWeight: "bold",
        color: "#EF506B",
        fontSize: 16,
        marginBottom: 10
    },
    container: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
        margin: 10
    },
    box: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#949494",
        margin: 5,
        borderRadius: 10
    },
    servicePrice: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    price: {
        fontWeight: "bold",
        color: "#EF506B"
    }
})
export default CustomerDetail;