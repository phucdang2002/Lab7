import axios from 'axios';
import {SafeAreaView, TextInput, StyleSheet, View, Alert} from 'react-native';
import {Text, Button} from 'react-native-paper';
import {useState} from 'react';
import Add from './AddService';
import Home from './Home';
import Detail, { DetailHeader } from './ServiceDetail';
import {createStackNavigator} from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Edit from './EditService';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import Customer from './Customer';
import AddCustomer from './AddCustomer';
import Setting from './Setting';
import Transaction from './Transaction';
import TransactionDetail, { TransactionHeader } from './TransactionDetail';
import CustomerDetail, { CustomerHeader } from './CustomerDetail';
import EditCustomer from './EditCustomer';
import AddTransaction from './AddTransaction';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const Login = ({navigation}) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const authentication = () => {
    const filePath = 'https://kami-backend-5rs0.onrender.com/auth';
    const auth = {
      phone: phone,
      password: password,
    };
    axios.post(filePath, auth)
      .then(response => {
        navigation.navigate('TabScreen', {
          screen: 'HomeScreen',
          params: {user: response.data},
        });
      })
      .catch(error => {
        console.error(error);
      });
  };
  return (
    <SafeAreaView style={styles.login}>
      <Text variant="displayMedium" style={styles.label}>
        Login
      </Text>
      <TextInput
        style={styles.textField}
        placeholder="Phone"
        keyboardType="numeric"
        onChangeText={text => setPhone(text)}></TextInput>
      <TextInput
        style={styles.textField}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={text => setPassword(text)}></TextInput>
      <Button
        mode="contained"
        style={styles.btnLogin}
        onPress={authentication}
        textColor="#fff">
        Login
      </Button>
    </SafeAreaView>
  );
};
const saveToken = async(token) =>{
    try {
        await AsyncStorage.setItem('token', JSON.stringify(token))
      } catch (error) {
        console.error(error);
      }
  }
const saveUserId = async(token) =>{
  try {
      await AsyncStorage.setItem('user', JSON.stringify(token))
    } catch (error) {
      console.error(error);
    }
}
export const ServiceScreen = ({navigation, route}) => {
  const auth = route.params;
  const {user} = auth;
  const {_id, name, token} = user;
  saveToken(token);
  saveUserId(_id);
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerTintColor: '#fff',
        headerStyle: {backgroundColor: '#EF506B'},
      }}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{title: name.toUpperCase(), headerLeft: () => null, headerRight:()=><Text style={{margin: 10}}><FontAwesomeIcon name="user-circle-o" size={25} color="#fff"/></Text>}}
      />
      <Stack.Screen name="Add" component={Add} options={{title: 'Service'}} />
      <Stack.Screen
        name="Detail"
        component={Detail}
        options={{
          title: 'Service Detail',
          headerRight: () => (
              <DetailHeader navigation={navigation}/>
          )
        }}
      />
      <Stack.Screen name="Edit" component={Edit} options={{title: 'Service'}} />
    </Stack.Navigator>
  );
};
export const CustomerScreen=({navigation})=> {
  return (
    <Stack.Navigator
      initialRouteName="Customer"
      screenOptions={{
        headerTintColor: '#fff',
        headerStyle: {backgroundColor: '#EF506B'},
      }}>
        <Stack.Screen name="Customer" component={Customer} options={{title: "Customer", headerLeft:() => null}}/>
        <Stack.Screen name="AddCustomer" component={AddCustomer} options={{ title: "Add customer"}}/>
        <Stack.Screen name="CustomerDetail" component={CustomerDetail} 
        options={{
          title: "Customer detail",
          headerRight: () => (
            <CustomerHeader navigation={navigation}/>
          )
        }}/>
        <Stack.Screen name="EditCustomer" component={EditCustomer} options={{title: "Update customer"}}/>
      </Stack.Navigator>
  )
}
export const TransactionScreen = ({navigation}) => {
  return (
    <Stack.Navigator
      initialRouteName="Transaction"
      screenOptions={{
        headerTintColor: '#fff',
        headerStyle: {backgroundColor: '#EF506B'},
      }}>
      <Stack.Screen name='Transaction' component={Transaction} options={{title: "Transaction", headerLeft:() => null}}/>
      <Stack.Screen name='AddTransaction' component={AddTransaction} options={{title: "Add transaction"}}/>
      <Stack.Screen name='TransactionDetail' component={TransactionDetail} options={{title: "Transaction detail", headerRight: ()=>(<TransactionHeader navigation={navigation}/>)}}/>
    </Stack.Navigator>
    )
}
export const TabScreen = () => {
  return (
    <Tab.Navigator
          initialRouteName="HomeScreen"
          barStyle={{backgroundColor: "#fff"}}
          labeled={true}
          activeColor={"#EF506B"}
          inactiveColor={"#000"}
          >
      <Tab.Screen name="HomeScreen" component={ServiceScreen} options={{title: "Home", tabBarIcon: 'home-outline'}}/>
      <Tab.Screen name="TransactionScreen" component={TransactionScreen} options={{title: "Transaction", tabBarIcon: 'cash'}}/>
      <Tab.Screen name="CustomerScreen" component={CustomerScreen} options={{title: "Customer", tabBarIcon: 'account-supervisor-outline'}}/>
      <Tab.Screen name="Setting" component={Setting} options={{title: "Setting", tabBarIcon: "cog-outline"}}/>
    </Tab.Navigator>
  )
}
const styles = StyleSheet.create({
  login: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  label: {
    color: '#EF506B',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  textField: {
    margin: 5,
    padding: 10,
    textAlign: 'left',
    borderColor: '#b5b5b5',
    borderWidth: 1,
    borderRadius: 10,
    width: 300,
  },
  btnLogin: {
    backgroundColor: '#EF506B',
    width: 300,
    height: 50,
    borderRadius: 10,
    
    marginTop: 30,
    fontSize: 30,
  },
  txtLogin: {
    color: '#fff',

    lineHeight: 50,
    fontWeight: 'bold',
  },
});
export default Login;
