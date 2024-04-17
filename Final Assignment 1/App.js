import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Button, TextInput, Alert, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const generateId = () => Math.random().toString(36).substr(2, 9);

function HomeScreen({ navigation }) {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const loadTodos = async () => {
      const savedTodos = await AsyncStorage.getItem('todos');
      if (savedTodos) {
        const todosWithExtraProps = JSON.parse(savedTodos).map(todo => ({
          ...todo,
          isExpanded: false
        }));
        setTodos(todosWithExtraProps);
      }
    };

    loadTodos();
  }, []);

  const toggleExpand = (id) => {
    setTodos(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, isExpanded: !todo.isExpanded } : todo
      )
    );
  };

  const collapseTodo = (id) => {
    setTodos(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, isExpanded: false } : todo
      )
    );
  };

  const markAsComplete = async (id) => {
    const newTodos = todos.map(todo => {
      if (todo.id === id) {
      return { ...todo, finished: true, isExpanded: false };
      }
      return todo;
    });
    setTodos(newTodos);
    await AsyncStorage.setItem('todos', JSON.stringify(newTodos));
    collapseTodo(id);
  };

  const deleteTodo = async (id) => {
    const newTodos = todos.filter(todo => todo.id !== id);
    setTodos(newTodos);
    await AsyncStorage.setItem('todos', JSON.stringify(newTodos));
    
  };

  const renderTodoItem = ({ item }) => (
    <View style={styles.todoContainer}>
      <TouchableOpacity
        style={styles.todoItem}
        onPress={() => toggleExpand(item.id)}
      >
        <Text style={[styles.todoText, item.finished && styles.todoTextFinished]}>{item.text}</Text>
        <Ionicons name={item.isExpanded ? "caret-up-outline" : "caret-down-outline"} size={24} color="green" />
      </TouchableOpacity>
      {item.isExpanded && (
        <>
          <Text style={styles.todoDescription}>{item.description}</Text>
          <View style={styles.todoActions}>
            {!item.finished && (
              <TouchableOpacity onPress={() => markAsComplete(item.id)}>
                <Ionicons name="cloud-done" size={24} color="green" />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => deleteTodo(item.id)} style={styles.deleteButton}>
              <Ionicons name="trash" size={24} color="red" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Todo List</Text>
      <View style={styles.separator} />
      <FlatList
        data={todos}
        renderItem={renderTodoItem}
        keyExtractor={item => item.id}
      />
      <View style={styles.separator} />
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTodo', { setTodos })}
      >
        <Icon name="plus-circle" size={24} color="green" />
        <Text style={styles.addButtonText}>Add New Todo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function AddTodoScreen({ navigation, route }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { setTodos } = route.params;

  const handleSave = async () => {
    if (title.trim() === '' || description.trim() === '') {
      return;
    }

    const newTodo = {
      id: generateId(),
      text: title,
      description: description,
      finished: false,
      isExpanded: false
    };

    try {
      const savedTodos = await AsyncStorage.getItem('todos');
      const todos = savedTodos ? JSON.parse(savedTodos) : [];
      const updatedTodos = [newTodo, ...todos];
      await AsyncStorage.setItem('todos', JSON.stringify(updatedTodos));
      setTodos(updatedTodos);
      Alert.alert('Success', 'Todo Added Successfully');
      setTitle('');
      setDescription('');
    } catch (error) {
     
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.screenTitle}>Add New Todo</Text>
      <View style={styles.separator} />
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.inputDescription]}
        multiline
        value={description}
        onChangeText={setDescription}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="backspace" size={24} color="green" />
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Ionicons name="save" size={24} color="green" />
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home Screen' }} />
        <Stack.Screen name="AddTodo" component={AddTodoScreen} options={{ title: 'Add New Todo' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  
  todoActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
  },
  todoContainer: {
    marginBottom: 10,
    backgroundColor: 'lightblue',
    borderRadius: 5,
  },
  backButton: {
    backgroundColor: 'lightblue',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 5,
    flex: .2,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: 'lightblue',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 5,
    flex: .2,
    marginLeft: 1,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 5,
  },
  todoDescription: {
    fontSize: 16,
    backgroundColor: 'lightblue',
    padding: 5,
    paddingBottom: 3,
  },
  todoIcon: {
    position: 'center',
    right: 10,
    bottom: 10,
  },
  container: {
    flex: 1,
    marginTop: 50,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  todoItem: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    marginVertical: 4,
  },
  todoText: {
    fontSize: 18,
  },
  addButton: {
    backgroundColor: 'skyblue',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  addButtonText: {
    color: 'black',
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
    height: 70, 
    textAlignVertical: 'top', 
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 300,
  },
  separator: {
    borderBottomColor: 'black',
    borderBottomWidth: 3,
    marginVertical: 4,
    marginHorizontal: 6,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    marginVertical: 4,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default App;
