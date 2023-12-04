import { createStackNavigator } from "@react-navigation/stack";
import Login, { CustomerScreen, TabScreen } from "./src/Login";
import { NavigationContainer } from "@react-navigation/native";
import AddTransaction from "./src/AddTransaction";

const Stack = createStackNavigator();

function LoginScreen() {
  return(
    <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={Login}/>
      <Stack.Screen name="TabScreen" component={TabScreen}/>
    </Stack.Navigator>
  )
  
}

function App() {
  return(
      <NavigationContainer>
         <LoginScreen/>
      </NavigationContainer>
      // <AddTransaction/>
  );
}
export default App;
