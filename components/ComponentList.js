import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

export default function ComponentList({ data, deleteItem, editItem }) {
    return (
        <View style={styles.containerList}>
            <Text style={styles.textWord}>{data.words} <Image style={styles.imgList} source={require('../src/images/arrow-right.png')} /> {data.translates}</Text>
            <View style={styles.phrase}>
                <Text style={styles.titlePhrase}>Frase:</Text>
                <Text style={styles.textPhrase}>{data.phrases}</Text>
            </View>
            <TouchableOpacity style={styles.edit} onPress={() => editItem(data)}>
                <Image style={{ width: 35, height: 35 }} source={require('../src/images/edit.png')} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.trash} onPress={() => deleteItem(data.key)}>
                <Image style={{ width: 40, height: 40 }} source={require('../src/images/trash.png')} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    textWord: {
        color: '#000',
        fontSize: 17,
        fontWeight: 'bold',
        marginLeft: 15,
        marginTop: 15
    },
    titlePhrase: {
        color: '#000',
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 15,
    },
    textPhrase: {
        marginLeft: 10,
        fontSize: 15,
        marginBottom: 10,
        width: 190
    },
    phrase: {
        flexDirection: 'row'
    },
    imgList: {
        width: 15,
        height: 15
    },
    containerList: {
        flex: 1,
        marginBottom: 18,
        backgroundColor: '#FFF',
        borderRadius: 5,
        justifyContent: 'center',
    },
    trash: {
        position:'absolute',
        right:5
    },
    edit:{
        position:'absolute',
        right:50
    }
})