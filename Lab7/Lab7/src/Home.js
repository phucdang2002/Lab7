import { useEffect, useState } from "react";
import axios from "axios";
import { FlatList, SafeAreaView, View, Text, StyleSheet, TouchableOpacity, TouchableHighlight, Image } from "react-native";

const Home = ({navigation}) => {
    const [data, setData] = useState([]);
    const filePath = "https://kami-backend-5rs0.onrender.com/services";
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
            <View style={{ alignItems: "center"}}>
                <Image style={{width: 100, height: 80}} source={{uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmU2iysLD2csgMAMAVpIOR3zeoqVeV72K1og&usqp=CAU"}}/>
            </View>
            <View style={styles.titleBox}>
                <Text style={styles.title}>Danh sách dịch vụ</Text>
                <TouchableOpacity style={styles.add} onPress={()=>{navigation.navigate('Add')}}>
                    <Text style={styles.txtAdd}>+</Text>
                </TouchableOpacity>
            </View>
            
            <FlatList
                data={data}
                renderItem={({item}) => (
                    <TouchableHighlight onPress={()=>{navigation.navigate("Detail", {service:item})}}>
                        <View style={styles.box} >
                            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>{item.name}</Text>
                            <Text style={styles.price}>{item.price} ₫</Text>
                        </View>
                    </TouchableHighlight>
                )}
            />
        </SafeAreaView>
    )
}
const styles= StyleSheet.create({
    titleBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 15,
        marginRight: 15
    },
    title: {
        fontWeight: "bold",
        fontSize: 18,
    },
    add:{
        width: 30,
        height: 30,
        backgroundColor: "#EF506B",
        borderRadius: 64
    },
    txtAdd: {
        fontSize:20,
        textAlign: "center",
        lineHeight: 30,
        color: "#fff"
    },
    price: {
        fontSize: 15,
    },
    box: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderWidth: 1,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 15,
        marginRight: 15,
        padding: 10,
        borderColor: "#b5b5b5",
        borderRadius: 10
    }
})
export default Home;