import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, FlatList} from 'react-native';

const App = () => {
  
  const todos = [
    {id: '1', text: 'Buy milk'},
    {id: '2', text: 'Buy bread'},
    {id: '3', text: 'Buy eggs'},
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Todo List</Text>
      <View style={styles.separator} />
      <FlatList
        data={todos}
        renderItem={({item}) => (
          <View style={styles.todoItem}>
            <Text style={styles.todoText}>{item.text}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
      />
      <View style={styles.separator} />
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>ADD NEW TODO</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  todoItem: {
    backgroundColor: 'skyblue',
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  todoText: {
    fontSize: 18,
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 15,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
  },
  separator: {
    borderBottomColor: 'black',
    borderBottomWidth: 3,
    marginVertical: 4,
    marginHorizontal: 6,
  },
});

export default App;
