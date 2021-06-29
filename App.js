import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Modal, FlatList, Alert } from 'react-native';
import ComponentList from './components/ComponentList';
import AsyncStorage from '@react-native-async-storage/async-storage';

let valueInput;

let valueWord;
let valueTranslate;
let valuePhsrase;

export default function App() {

  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const [list, setList] = useState([]);
  const [searchFilter, setSearchFilter] = useState(false);
  const [edit, setEdit] = useState(false);

  const [borderPhsrase, setBorderPhrase] = useState(false)

  const [inputWord, setInputWord] = useState('');
  const [inputTranslate, setInputTranslate] = useState('');
  const [inputPhsrase, setInputPhsrase] = useState('');

  function addWord() {
    if (borderPhsrase) {
      Alert.alert('Aviso!', 'A frase deve conter a palavra ' + inputWord + '!')
    }
    else if(inputWord==''|| inputPhsrase==''|| inputTranslate==''){
      Alert.alert('Aviso!','Preencha todos os campos')
    }
    else if(list.find((value)=>inputWord.toLocaleLowerCase()==(value.key).toLocaleLowerCase())){
      Alert.alert('Aviso!','Essa palavra já foi cadastrada!')
    }
    else {
      const listAdd = { key: inputWord, words: inputWord, translates: inputTranslate, phrases: inputPhsrase }
      setList([...valueInput, listAdd])
      setOpen(false)
      setInput('')
      setInputWord('')
      setInputTranslate('')
      setInputPhsrase('')
      setSearchFilter(false)
    }

  }

  useEffect(() => {
    async function loadList() {
      const lista = await AsyncStorage.getItem('@list');
      if (lista) {
        setList(JSON.parse(lista))
        valueInput = list;
      }
    }
    loadList()
  }, [])

  useEffect(() => {
    if (searchFilter) return;
    else {
      async function addItem() {
        await AsyncStorage.setItem('@list', JSON.stringify(list))
      }
      addItem()
      valueInput = list;
    }
  }, [list])

  useEffect(() => {
    if (open && inputWord != '') {
      const findWord = (inputPhsrase.toLocaleLowerCase()).indexOf(inputWord.toLocaleLowerCase())
      if (findWord >= 0) {
        setBorderPhrase(false)
      }
      else {
        setBorderPhrase(true)
      }
    }
    else {
      return
    }
  }, [open, inputPhsrase])

  function editItem(value) {
    setEdit(true)
    setInputWord(value.words)
    setInputTranslate(value.translates)
    setInputPhsrase(value.phrases)
    valueWord = value.words;
    valueTranslate = value.translates;
    valuePhsrase = value.phrases;
  }

  function close() {
    setOpen(false)
    setEdit(false)
    setInput('')
    setInputWord('')
    setInputTranslate('')
    setInputPhsrase('')
    setBorderPhrase(false)
  }

  function changeWord() {
    if (inputWord != valueWord || inputTranslate != valueTranslate || inputPhsrase != valuePhsrase) {
      const wordChange = { key: inputWord, words: inputWord, translates: inputTranslate, phrases: inputPhsrase }
      const wordC = list.filter((result) => result.key !== valueWord)
      valueInput = wordC
      setList([...valueInput, wordChange])
      setEdit(false)

      setInputWord('')
      setInputTranslate('')
      setInputPhsrase('')
    }
    else {
      return
    }
  }

  function search() {
    valueInput = list;
    setSearchFilter(true)
    const filterList = list.filter((value) => (value.words).toLocaleLowerCase() == input.toLocaleLowerCase())
    console.log('Filter ' + filterList)
    setList(filterList)
  }

  function deleteItem(value) {
    Alert.alert('Aviso!','Você tem certeza que quer deletar essa palavra?',[{text:'Cancelar'},{text:'Sim', onPress: ()=> delet()}])
    function delet(){
      const deleteItemList = list.filter((result) => result.words !== value)
      setList(deleteItemList)
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Dictionary</Text>
      <View style={styles.containerSearch}>
        <TextInput
          style={styles.input}
          placeholder='Buscar palavras já cadastradas...'
          placeholderTextColor='#000'
          value={input}
          onChangeText={(text) => setInput(text)}
        />
        <TouchableOpacity style={styles.buttonSearch} onPress={search}>
          <Image style={styles.imgSearch} source={require('./src/images/search.png')} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.buttonAdd} onPress={() => setOpen(true)}>
        <Image style={styles.imgAdd} source={require('./src/images/button-add.png')} />
      </TouchableOpacity>
      <Modal visible={open}>
        <View style={styles.containerModal}>
          <View style={styles.headerModal}>
            <TouchableOpacity onPress={() => close()}>
              <Image style={{ width: 45, height: 45 }} source={require('./src/images/arrow-back.png')} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Incluir Palavra</Text>
          </View>
          <View style={styles.modalBody}>
            <Text style={styles.labelInput}>Palavra:</Text>
            <TextInput
              style={styles.inputModal}
              color="#000"
              value={inputWord}
              onChangeText={(text) => setInputWord(text)}
            />
            <Text style={styles.labelInput}>Tradução:</Text>
            <TextInput
              style={styles.inputModal}
              color="#000"
              value={inputTranslate}
              onChangeText={(text) => setInputTranslate(text)}
            />
            <Text style={styles.labelInput}>Frase:</Text>
            <TextInput
              style={[styles.inputModal, borderPhsrase ? { borderColor: 'red' } : { borderColor: '#236E96' }]}
              color="#000"
              multiline={true}
              value={inputPhsrase}
              onChangeText={(text) => setInputPhsrase(text)}
            />
            {borderPhsrase && <Text style={styles.alertPhrase}>A frase deve incluir a palavra {inputWord}</Text>}
          </View>
          <TouchableOpacity style={styles.buttonAddWord} onPress={addWord}>
            <Text style={styles.textButtonAddWord}>ADICIONAR</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal visible={edit}>
        <View style={styles.containerModal}>
          <View style={styles.headerModal}>
            <TouchableOpacity onPress={() => close()}>
              <Image style={{ width: 45, height: 45 }} source={require('./src/images/arrow-back.png')} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Editar Palavra</Text>
          </View>
          <View style={styles.modalBody}>
            <Text style={styles.labelInput}>Palavra:</Text>
            <TextInput
              style={styles.inputModal}
              color="#000"
              value={inputWord}
              onChangeText={(text) => setInputWord(text)}
            />
            <Text style={styles.labelInput}>Tradução:</Text>
            <TextInput
              style={styles.inputModal}
              color="#000"
              value={inputTranslate}
              onChangeText={(text) => setInputTranslate(text)}
            />
            <Text style={styles.labelInput}>Frase:</Text>
            <TextInput
              style={styles.inputModal}
              color="#000"
              value={inputPhsrase}
              multiline={true}
              onChangeText={(text) => setInputPhsrase(text)}
            />
          </View>
          <TouchableOpacity style={styles.buttonAddWord} onPress={changeWord}>
            <Text style={styles.textButtonAddWord}>Alterar Palavra</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View style={styles.containerLists}>
        <FlatList
          style={styles.list}
          data={list}
          keyExtractor={(item) => String(item.key)}
          renderItem={({ item }) => <ComponentList data={item} deleteItem={deleteItem} editItem={editItem} />}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A64D6'
  },
  title: {
    fontSize: 24,
    marginTop: 15,
    color: '#FFF',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    width: 280
  },
  containerSearch: {
    backgroundColor: '#659CF1',
    padding: 18,
    borderRadius: 5,
    marginTop: 25,
    flexDirection: 'row',
    marginRight: 15,
    marginLeft: 15,
  },
  imgAdd: {
    width: 30,
    height: 30
  },
  buttonAdd: {
    position: 'absolute',
    right: 25,
    bottom: 25,
    zIndex: 9,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 50
  },
  imgSearch: {
    width: 45,
    height: 45
  },
  buttonSearch: {
    backgroundColor: '#005CFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 10,
    marginLeft: 15
  },
  containerModal: {
    backgroundColor: '#1A64D6',
    flex: 1,
  },
  headerModal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 26,
    marginLeft: 70,
    color: '#FFF',
    fontWeight: 'bold'
  },
  labelInput: {
    fontSize: 18,
    color: '#FFF',
    marginTop: 10,
    marginLeft: 20,
    marginBottom: 5
  },
  alertPhrase: {
    fontSize: 16,
    color: '#FF0000',
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 5
  },
  modalBody: {
    marginTop: 20
  },
  inputModal: {
    backgroundColor: '#FFF',
    width: 380,
    height: 40,
    alignSelf: 'center',
    borderRadius: 10,
    padding: 10,
    borderWidth: 2,
    borderColor: '#236E96'
  },
  buttonAddWord: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
    padding: 12,
    backgroundColor: '#009BFF',
    marginBottom: 10,
    width: 380,
    borderRadius: 10,
  },
  textButtonAddWord: {
    fontSize: 17,
    color: '#FFF',
    textAlign: 'center'
  },
  list: {
    width: 360,
    padding: 5,
    marginRight: 15,
    marginLeft: 15,
  },
  containerLists: {
    backgroundColor: '#659CF1',
    marginTop: 30,
    alignItems: 'center',
    padding: 20,
    marginRight: 15,
    marginLeft: 15,
    borderRadius: 5,
    height: 580
  }
})