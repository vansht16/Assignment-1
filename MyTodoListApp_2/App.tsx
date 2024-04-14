import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Button, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather'; // Assuming you are using Feather icons

// Home screen component
function HomeScreen({ navigation }) {
  const todos = [
    {id: '1', text: 'Buy milk'},
    {id: '2', text: 'Buy bread'},
    {id: '3', text: 'Buy eggs'},
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Todo List</Text>
      <FlatList
        data={todos}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <Text style={styles.todoText}>{item.text}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTodo')}>
        <Icon name="plus" size={24} color="white" />
        <Text style={styles.addButtonText}>Add New Todo</Text>
      </TouchableOpacity>
    </View>
  );
}

// Add Todo screen component
function AddTodoScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Title"
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        style={[styles.input, styles.inputDescription]}
        multiline
      />
      <View style={styles.buttonContainer}>
        <Button title="Cancel" onPress={() => navigation.goBack()} />
        <Button title="Save" onPress={() => {/* Handle saving logic */}} />
      </View>
    </View>
  );
}

// Stack navigator setup
const Stack = createStackNavigator();

// Main app component
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home Screen' }} />
        <Stack.Screen name="AddTodo" component={AddTodoScreen} options={{ title: 'Add New Todo' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  todoItem: {
    backgroundColor: 'skyblue',
    padding: 10,
    borderRadius: 5,
    marginVertical: 4,
  },
  todoText: {
    fontSize: 18,
  },
  addButton: {
    backgroundColor: 'blue',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    fontSize: 18,
  },
  inputDescription: {
    height: 100, // Adjust the height for multiline input
    textAlignVertical: 'top', // Align text to the top for multiline input
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});

export default App;
