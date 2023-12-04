import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, FlatList } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Dropdown } from "react-native-element-dropdown";
import { Icon } from "react-native-paper";

const AddTransaction = ({navigation}) => {
    const [value, setValue] = useState(null);
    const [customer, setCustomer] = useState([]);
    const [service, setService] = useState([]);
    const [selectedItems, setSelectedItems] = useState({});
    const [counts, setCounts] = useState({});
    useEffect(() =>{
        axios.get("https://kami-backend-5rs0.onrender.com/customers")
        .then(response =>{
            setCustomer(response.data);
        })
        .catch(error => {
            console.error(error);
        })
    },[]);
    useEffect(() =>{
        axios.get("https://kami-backend-5rs0.onrender.com/services")
        .then(response =>{
            setService(response.data);
        })
        .catch(error => {
            console.error(error);
        })
    },[]);
    const handleCheckboxPress = (itemId) => {
        setSelectedItems(prevState => ({
            ...prevState,
            [itemId]: !prevState[itemId]
        }));
    };
    const handleQuantityChange = (itemId, operation) => {
        setCounts(prevCounts => ({
            ...prevCounts,
            [itemId]: operation === 'decrement' ? Math.max((prevCounts[itemId] || 0) - 1, 0) : (prevCounts[itemId] || 0) + 1
        }));
    };
    const calculateTotalPayment = () => {
        let total = 0;
        for (const itemId in counts) {
            const item = service.find(item => item._id === itemId);
            if (item) {
                total += (item.price || 0) * counts[itemId];
            }
        }
        return total;
    };
    async function authToken() {
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null) {
                return JSON.parse(value);
            }
        } catch (error) {
            console.log(error);
        }
    }
    async function userID() {
        try {
            const value = await AsyncStorage.getItem('user');
            if (value !== null) {
                return JSON.parse(value);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const doAddTransaction = async () => {
        const token = await authToken();
        const userId = await userID();
        const services = Object.keys(counts).map(itemId => ({
            _id: itemId,
            quantity: counts[itemId],
            userID: userId
        }));
        const postData = {
            customerId: value,
            services: services,
        };
        console.log(token)
        axios.post('https://kami-backend-5rs0.onrender.com/transactions', postData, {
            headers:{
                Authorization: `Bearer ${token}`,
            }
        })
        .then(response =>{
            console.log("Response: ", response.data);
            navigation.goBack();
        })
        .catch(error=>{
            console.error("Error: ", error);
        })
    }
    const renderItem = ({ item }) => {
        const isSelected = selectedItems[item._id] || false;
        return (
            <View>
                <BouncyCheckbox
                    size={20}
                    isChecked={isSelected}
                    text={item.name}
                    onPress={() => handleCheckboxPress(item._id)}
                    textStyle={{
                        textDecorationLine: "none"
                    }}
                />
                {isSelected && (
                    <View>
                        <View style={styles.hiddenbox}>
                            <View style={styles.chooseQuantity}>
                                <TouchableOpacity style={styles.operation} onPress={() => handleQuantityChange(item._id, 'decrement')}>
                                    <Text style={styles.txt}>-</Text>
                                </TouchableOpacity>
                                <Text style={[styles.count, styles.txt]}>{counts[item._id] || 0}</Text>
                                <TouchableOpacity style={styles.operation} onPress={() => handleQuantityChange(item._id, 'increment')}>
                                    <Text style={styles.txt}>+</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.smdropdown}>
                                <Text>Executor</Text>
                                <Text><Icon source="chevron-down" size={16} color="#000"/></Text>
                            </View>
                        </View>
                        <Text>Price: <Text style={styles.price}>{item.price*(counts[item._id] || 0)} ₫</Text></Text>
                    </View>
                )}
            </View>
        );
    };
    const totalPayment = calculateTotalPayment();
    return (
        <SafeAreaView style={styles.addTrans}>
            <Text>Customer *</Text>
            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                data={customer.map(item => ({ label: item.name, value: item._id }))}
                search
                placeholder="Select customer"
                searchPlaceholder="Search"
                labelField="label"
                valueField="value"
                maxHeight={300}
                value={value}
                onChange={item => {
                setValue(item.value);
                }}
            />
            <FlatList
                data={service}
                renderItem={renderItem}
                keyExtractor={(item) => item._id.toString()}
            />
            <TouchableOpacity style={styles.btnAdd} onPress={doAddTransaction}><Text style={styles.txtAdd}>See summary: ({totalPayment} ₫)</Text></TouchableOpacity>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    addTrans: {
        padding: 10,
        flex: 1
    },
    dropdown: {
        margin: 16,
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 10,
        padding: 20
    },
    smdropdown: {
        flexDirection: "row",
        width: 150,
        height: 40,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 10,
        padding: 10,
        justifyContent: "space-between"
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    hiddenbox: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 20,
        marginLeft: 15
    },
    chooseQuantity: {
        flexDirection: "row"
    },
    operation: {
        width: 40,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
    },
    count:{
        width: 50,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
    },
    price: {
        color: "#EF506B",
        fontWeight: "bold"
    },
    txt: {
        textAlign: "center",
        lineHeight: 40
    },
    btnAdd:{
        position: "absolute",
        left: 25,
        right: 25,
        bottom: 10,
        alignItems: "center",
        backgroundColor: "#EF506B",
        height: 50,
        width: 350,
        borderRadius: 10,
        marginTop: 30,
        margin: 10
    },
    txtAdd: {
        color: "#FFF",
        fontWeight: "900",
        fontSize: 20,
        textAlign: "center",
        lineHeight: 50
    }
})
export default AddTransaction;