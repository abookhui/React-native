import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity
  ,TouchableWithoutFeedback
  , Pressable,
  Textinput,
  TextInput,
  ScrollView,
  Alert,
 } from 'react-native';

import {theme} from './colors'
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
const STORAGE_KEY = "@todo";

export default function App() {
  const [working, setWorking] = useState(true);
  const travel = () => setWorking(false);
  const work = () => setWorking(true); 
  const [todo,setTodo] = useState({});
  const [text, setText] = useState("");
  useEffect(()=>{
    loadTodo();
  },[]);
  const saveTodo = async (toSave) =>{
    await AsyncStorage.setItem(STORAGE_KEY,JSON.stringify(toSave));
  };
  const onChangeText = (payload) => {setText(payload);}
  const addTodo = async ()=> {
    if(text === "") return;

    // save to do 
    //const newtodo = Object.assign({},todo, {[Date.now()] : {text: text,work: working}});
    const newtodo = {
      ...todo, 
      [Date.now()] : {text: text,work: working}
    };
    setTodo(newtodo);
    await saveTodo(newtodo);
    setText("");

    }
  
  const loadTodo = async()=>{
    try{
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      setTodo(JSON.parse(s));
    }catch(e){console.log(e);}
    
  }
  const deleteTodo = (key)=>{
    const newTodo = {...todo}
    
    Alert.alert("Delete To Do", "Are You Sure?",[
      {
        text: "Cancel",
        onPress: ()=>{return;}
      },
      {
        text:"Sure", 
        onPress: async ()=>{
          delete newTodo[key];
          setTodo(newTodo);
          await saveTodo(newTodo);
      }}
    ]);
    
  }
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style = {{...styles.btnText , color : working ? "white":theme.grey} }>Work</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={travel}>
          <Text style = {{...styles.btnText , color : !working ? "white":theme.grey} }>Travel</Text>
        </TouchableOpacity>
      </View>
      <TextInput
       placeholder= {working ? "Add a to do" : "where do you wanna go"} 
       style = {styles.input}
       returnKeyType="done"
       onChangeText={onChangeText}
       onSubmitEditing={addTodo}
       value={text}
       ></TextInput>
      <ScrollView style = {{marginTop : 15,} }>
        {todo === null ? <View><Text>Nothing</Text></View>:
        Object.keys(todo).map((key)=>(
           working === todo[key].work ?
            <View style={styles.todo} key={key}>
              <Text style = {styles.todoText}>{todo[key].text}</Text>
              <TouchableOpacity onPress={()=>deleteTodo(key)}><Text>🗑️</Text></TouchableOpacity>
              
            </View>
            :null

          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 30,
  },
  header : {
    justifyContent: "space-between",
    flexDirection:"row",
    marginTop: 100,

  },
  btnText : {
    fontSize:40,  
    fontWeight:"600",
  },
  input:{
    backgroundColor: "white",
    paddingVertical:10,
    paddingHorizontal :20,
    borderRadius: 30,
    marginTop:20,
    fontSize:18,
  },
  todo:{
    marginBottom:10,
    paddingVertical : 14,
    paddingHorizontal:20,
    backgroundColor: "grey",
    borderRadius:12,
    flexDirection:"row",
    alignItems:"center",
    justifyContent: "space-between",
  },
  todoText: {
    color:"white",
    fontSize:20,
    fontWeight:"600",
  },
});
