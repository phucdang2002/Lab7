import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { Alert, SafeAreaView, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Text } from "react-native-paper";
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from "react-native-popup-menu";
import Icon from 'react-native-vector-icons/Entypo';
export const TransactionHeader = ({navigation}) => {
    const handleMenuSelect = (option) => {
        if (option==="Edit") {
        }else {
          Alert.alert("Warning", "Are you sure you want to cancel this transaction? This will affect the customer transaction information", [{
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {text: 'Yes', onPress: ()=>cancelTransaction({navigation})}
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
              <MenuOption value="Edit" text="See more details"/>
              <MenuOption value="Delete" text="Cancel transaction" customStyles={{ optionText: { color: 'red' } }}/>
            </MenuOptions>
          </Menu>
        </MenuProvider>
      );
}
const authToken = async () =>{
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
          return JSON.parse(value);
      }
    } catch (error) {
        console.log(error);
    }
  };
const Id = async () =>{
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
async function cancelTransaction({navigation}) {
    const _id = await Id();
    const token = await authToken();
    const filePath = "https://kami-backend-5rs0.onrender.com/transactions/"+_id;
    axios.delete(filePath,{
      headers: {
          Authorization: `Bearer ${token}`
      },
      })
      .then(() =>{
          Alert.alert("Cancelled successfully")
      })
      .catch(error => {
          console.error(error);
      })
    }
const TransactionDetail = ({route}) =>{
    const {transaction} = route.params;
    const {_id} = transaction;
    saveId(_id);
    const [data, setData] = useState([]);
    const filePath = "https://kami-backend-5rs0.onrender.com/transactions/"+_id;
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
        <SafeAreaView style={{flex: 1}}>
            <View style={[styles.box,{flex: 3}]}>
                <Text style={styles.title}>General information</Text>
                <View style={styles.content}>
                    <Text style={styles.contentTitle}>Transaction code</Text>
                    <Text style={styles.data}>{data.id}</Text>
                </View>
                <View style={styles.content}>
                    <Text style={styles.contentTitle}>Customer</Text>
                    <Text style={styles.data}>{data.customer && data.customer.name}</Text>
                </View>
                <View style={styles.content}>
                    <Text style={styles.contentTitle}>Creation time</Text>
                    <Text style={styles.data}>{moment(data.createdAt).format('DD/MM/YYYY h:mm:ss')}</Text>
                </View>
                
            </View>
            <View style={[styles.box, {flex: 4}]}>
                <Text style={styles.title}>Service list</Text>
                <FlatList data={data.services}
                renderItem={({item})=>(
                    <View style={styles.content}>
                        <Text style={{width: 180}}>{item.name}</Text>
                        <Text>x{item.quantity}</Text>
                        <Text style={styles.data}>{item.price*item.quantity} ₫</Text>
                    </View>
                )}/>
                <View style={{borderWidth: 1, borderColor: "#ebe8e8"}}/>
                <View style={styles.content}>
                    <Text style={styles.contentTitle}>Total:</Text>
                    <Text style={styles.data}>{data.priceBeforePromotion} ₫</Text>
                </View>
            </View>
            <View style={[styles.box,{flex: 3}]}>
                <Text style={styles.title}>Cost</Text>
                <View style={styles.content}>
                    <Text style={styles.contentTitle}>Account of money</Text>
                    <Text style={styles.data}>{data.priceBeforePromotion} ₫</Text>
                </View>
                <View style={styles.content}>
                    <Text style={styles.contentTitle}>Discount</Text>
                    <Text style={styles.data}>{data.priceBeforePromotion-data.price===0?0:-(data.priceBeforePromotion-data.price)} ₫</Text>
                </View>
                <View style={{borderWidth: 1, borderColor: "#ebe8e8"}}/>
                <View style={styles.content}>
                    <Text style={styles.data}>Total payment</Text>
                    <Text style={styles.payment}>{data.price} ₫</Text>
                </View>
            </View>
            <View style={{flex: 1}}/>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    box: {
        backgroundColor: "#fff",
        borderRadius: 10,
        borderColor: "#757575",
        padding: 10,
        margin: 10
    },
    title: {
        color: "#EF506B",
        fontWeight: "bold",
        paddingBottom: 10
    },
    content:{
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    contentTitle: {
        color: "#807e7e",
        fontWeight: "800"
    },
    data: {
        fontWeight: "900"
    },
    payment: {
        fontSize: 20,
        fontWeight: "900",
        color: "#EF506B"
    }
})
export default TransactionDetail;