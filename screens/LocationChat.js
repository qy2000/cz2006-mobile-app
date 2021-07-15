import React, { useState, useCallback, useEffect, useContext } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import firebase from '../firebase/config'
import 'firebase/firestore'
import { UserContext } from '../context/UserContext';

export default function LocationChatScreen() {
  const db = firebase.firestore();
  const [messages, setMessages] = useState([]);
  const {chatid} = useContext(UserContext)

  const sendGroupMsg = (message) => {
    return db.collection(chatid).add(message);
  };
  const bruh = async () => {
    const doc = await db.collection(chatid).orderBy('message.createdAt').get();    return doc;

  }

  useEffect(() => {
    const docg = bruh().then((response) => {
      response.forEach(doc => {
        console.log(doc.id, '=1', doc.data()['message']);
        var data = [doc.data()['message']];
        data[0].createdAt = data[0].createdAt.toDate();
        // doc.data()['message:'][0].createdAt = doc.data()['message:'][0].createdAt.toDate();
        setMessages(previousMessages => GiftedChat.append(previousMessages, data));
        console.log(doc.id, '=4', data);

        // setMessages(previousMessages  => ({
        //   messages: GiftedChat.append(previousMessages, doc.data()['message:'])
        // }))

      })
    }

    );

    /**
     * Append new messages to previous ones
     */
    setMessages(previousMessages => GiftedChat.prepend(previousMessages, [
      {
        _id: 1,
        text: "Hey! Welcome to the " +chatid+ " chatgroup! You can discuss, share, and talk to neighbours close to you.",
        createdAt: new Date().getTime(),
        user: {
          _id: 2,
          name: 'Befit',
          avatar: require('../assets/images/onboarding.png'),

        },
      },
    ]))
  }, [])


  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    console.log(messages[0].createdAt)
    console.log(messages)

    sendGroupMsg({ "message": messages[0] })
  }, [])

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  )
}