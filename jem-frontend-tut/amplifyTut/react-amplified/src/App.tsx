/* src/App.js */
import React, { useEffect, useState } from 'react';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { createTodo } from './graphql/mutations';
import { listTodos } from './graphql/queries';

import awsExports from './aws-exports';

Amplify.configure(awsExports);

const initialState = { name: '', description: '', id: '' };

type Todo = {
  name: string;
  description: string;
  id: string;
};

type Todos = Array<Todo>;

type ListTodosQuery = {
  ListTodos: {
    items: Todos;
  };
};

const styles = {
  container: {
    width: 400,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20,
  } as React.CSSProperties,
  todo: { marginBottom: 15 },
  input: {
    border: 'none',
    backgroundColor: '#ddd',
    marginBottom: 10,
    padding: 8,
    fontSize: 18,
  },
  todoName: { fontSize: 20, fontWeight: 'bold' } as React.CSSProperties,
  todoDescription: { marginBottom: 0 },
  button: {
    backgroundColor: 'black',
    color: 'white',
    outline: 'none',
    fontSize: 18,
    padding: '12px 0px',
  },
};

const App = () => {
  const [formState, setFormState] = useState(initialState);
  const [todos, setTodos] = useState<Todos>([]);

  // Uses the Amplify API category to call the AppSync GraphQL API with the `listTodos` query
  // Once the data is returned, the items array is passed in to the `setTodos` function to update the local state
  async function fetchTodos() {
    try {
      const todoData = (await API.graphql(
        graphqlOperation(listTodos),
      )) as GraphQLResult<ListTodosQuery>;
      const todosLocal = todoData.data?.ListTodos.items;
      if (todosLocal) {
        setTodos(todosLocal);
      }
    } catch (err) {
      console.log('error fetching todos');
    }
  }

  // When the component loads, the `useEffect` hook is called and it invokes the `fetchTodos` function
  useEffect(() => {
    fetchTodos();
  }, []);

  function setInput(key: string, value: string) {
    setFormState({ ...formState, [key]: value });
  }

  // Uses the Amplify API category to call the AppSync GraphQL API with the `createTodo` mutation
  // A difference between the `listTodos` wuery and the `createTodo` mutation is that `createTodo` accepts an argument containing the variables needed for the mutation
  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return;
      const todo = { ...formState };
      // `...` Spread syntax
      // Allows an iterable such as an array expression or string to be expanded in places where zero or more arguments (for function calls) or elements (for array literals) are expected
      // Or an object expression to be expanded in places where zero or more key-value pairs (for object literals) are expected
      setTodos([...todos, todo]);
      setFormState(initialState);
      await API.graphql(graphqlOperation(createTodo, { input: todo }));
    } catch (err) {
      console.log('error creating todo:', err);
    }
  }

  return (
    <div style={styles.container}>
      <h2>Amplify Todos</h2>
      <input
        onChange={(event) => setInput('name', event.target.value)}
        style={styles.input}
        value={formState.name}
        placeholder="Name"
      />
      <input
        onChange={(event) => setInput('description', event.target.value)}
        style={styles.input}
        value={formState.description}
        placeholder="Description"
      />
      <button style={styles.button} onClick={addTodo}>
        Create Todo
      </button>
      {todos.map((todo, index) => (
        <div key={todo.id ? todo.id : index} style={styles.todo}>
          <p style={styles.todoName}>{todo.name}</p>
          <p style={styles.todoDescription}>{todo.description}</p>
        </div>
      ))}
    </div>
  );
};

export default withAuthenticator(App);
// import logo from "./logo.svg";
// import "./App.css";
// import React from "react";

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
