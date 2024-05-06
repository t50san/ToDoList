import React, {useState, useEffect } from 'react';
import {View, Text, TextInput, Button, FlatList, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './style/estilo';

export default function App() {
  const [tarefa, definirTarefa] = useState('');
  const[tarefas,abrirTarefas] = useState([]);
  useEffect(() => {
    carregarTarefas();
  }, []);

  const carregarTarefas = async () => {
    try {
      const salvarTarefas = await AsyncStorage.getItem('tarefas');
      if (salvarTarefas !== null) {
        definirTarefas(JSON.parse(salvarTarefas));
      }
    } catch (error) {
      console.error('Erro ao carregar as tarefas:', error);
    }
  };

  const salvarTarefa = async () => {
    try{
      const novaTarefa = [...tarefas, {texto: tarefa, feito: false}];
      await AsyncStorage.setItem('tarefas', JSON.stringify(novaTarefa));
      definirTarefas(novaTarefa);
      definirTarefa('');
    } catch (error) {
      console.error('Erro ao salvar a tarefa: ', error);
    }
  };

  const apagarTarefa = async (index) => {
    try {
      const novasTarefas = [...tarefas];
      novasTarefas.splice(index,1);
      await AsyncStorage.setItem('tarefas', JSON.stringify(novasTarefas));
      definirTarefas(novasTarefas);
    } catch (error) {
      console.error('Erro ao apagar a tarefa: ', error);
    }
  };

  const marcarTarefaComoFeita = async (index) => {
    try {
      const novasTarefas = [...tarefas];
      novasTarefas[index].feito =!novasTarefas[index].feito;
      await AsyncStorage.setItem('tarefas', JSON.stringify(novasTarefas));
      definirTarefas(novasTarefas);
    } catch (error) {
      console.error('Erro ao marcar tarefa como feita: ', error);
    }
  };

return (
  <View style={styles.container}>
    <Text style={style.titlie}>Lista de Tarefas</Text>
    <View style={styles.inputContainer}>
      <TextInput
      placeholder="Digite uma tarefa"
      value={tarefa}
      onChangeText={(texto) => definirTarefa(texto)}
      style={styles.input}
      />
      <Button title="Adicionar tarefa" onPress={salvarTarefa} />
    </View>
    <FlatList
    data={tarefas}
    keyExtractor={(_,index) => index.toString ()}
    renderItem={({ item, index }) => (
      <View style = {styles.taskContainer}>
        <TouchableOpacity onPress={() => marcarTarefaComoFeita(index)}>
          <Text
          style={[
            styles.taskText,
            item.feito ? styles.taskTextDone : null,
          ]}
          >
            {item.texto}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => apagarTarefa(index)}>
          <Text style={styles.deleteText}>Apagar</Text>
        </TouchableOpacity>
 </View>
 )}
/>
</View>
);
}
