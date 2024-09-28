import { useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { collection, query, where, orderBy, addDoc, getDoc, getDocs, doc, onSnapshot, deleteDoc, updateDoc } from 'firebase/firestore';
import { auth, onSocialClick, dbservice, storage } from 'src/baseApi/serverbase'
import { Link, useLocation } from 'react-router-dom'
import { webSocket, onClick } from 'src/webSocket.tsx'

// const webSocket = io("http://localhost:5000");
function Chatting({ userObj }) {
  const messagesEndRef = useRef(null);
  const [userId, setUserId] = useState("");
  const [msg, setMsg] = useState("");
  const [msgList, setMsgList] = useState([]);
  const [changeMessage, setChangeMessage] = useState(true)
  const [privateTarget, setPrivateTarget] = useState("");
  const [user, setUser] = useState(null)
  const [selectUser, setSelectUser] = useState(false)
  const {state} = useLocation()
  const conversation = state.conversation
  console.log(conversation)
  useEffect(() => {
    if (!webSocket) return;
    function sMessageCallback(msg) {
      const { data, id, target } = msg;
      setMsgList((prev) => [
        ...prev,
        {
          msg: data,
          type: target ? "private" : "other",
          id: id,
        },
      ]);
    }
    webSocket.on("sMessage", sMessageCallback);
    return () => {
      webSocket.off("sMessage", sMessageCallback);
    };
  }, []);

  // useEffect(() => {
  //   if (!webSocket) return;
  //   function sLoginCallback(msg) {
  //     setMsgList((prev) => [
  //       ...prev,
  //       {
  //         msg: `${msg} joins the chat`,
  //         type: "welcome",
  //         id: "",
  //       },
  //     ]);
  //   }
  //   webSocket.on("sLogin", sLoginCallback);
  //   return () => {
  //     webSocket.off("sLogin", sLoginCallback);
  //   };
  // }, []);
  useEffect(() => {
    scrollToBottom();
  }, [msgList]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // const onSubmitHandler = (e) => {
  //   e.preventDefault();
  //   webSocket.emit("login", { userId: userId, roomNumber: roomNumber });
  //   setIsLogin(true);
  // };
  // const onChangeUserIdHandler = (e) => {
  //   setUserId(e.target.value);
  // };
  const onSendSubmitHandler = (e) => {
    e.preventDefault();
    const sendData = {
      data: msg,
      id: userId,
      // target: privateTarget,
    };
    webSocket.emit("message", sendData);
    if (msg) {
      // if (!conversation) {
      //   onForm()
      // } else {
      //   onFormConversation()
      // }
      onFormConversation()
    }
    setMsg("");
  };
  const onChangeMsgHandler = (e) => {
    setMsg(e.target.value);
  };
  const onSetPrivateTarget = async (userUid) => {
    const userRef = doc(dbservice, `members/${userUid}`)
    const userDoc = await getDoc(userRef)
    const userElement = userDoc.data()
    setUser(userElement)
    setSelectUser(true)
  };
  // const handleClose = () => {
  //   setSelectUser(false)
  // }
  // const onForm = async () => {
  //   const message = msg
  //   try {
  //     const userUid = userObj.uid
  //     const userName = userObj.displayName
  //     const messageClock = Date.now()
  //     const newMessage = await addDoc(collection(dbservice, 'chats_group'), {
  //       // userUid: userUid,
  //       userName: userName,
  //       message: message,
  //       messageClock: messageClock
  //     })
  //     setMsgList((prev) => [...prev, { msg: message, type: "me", userUid: userObj.uid, id: userObj.displayName, messageClock: messageClock }]);
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  const onFormConversation = async () => {
    const message = msg
    try {
      const userUid = userObj.uid
      const userName = userObj.displayName
      const messageClock = Date.now()
      await addDoc(collection(dbservice, `chats_${conversation}`), {
        userUid: userUid,
        userName: userName,
        message: message,
        messageClock: messageClock
      })
      setMsgList((prev) => [...prev, { msg: message, type: "me", userUid: userObj.uid, id: userObj.displayName, messageClock: messageClock }]);
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    // const messageList = async () => {
    //   const messageRef = collection(dbservice, 'chats_group')
    //   const messagesCollection = query(messageRef, orderBy('messageClock'))
    //   const messages = await getDocs(messagesCollection);
    //   messages.forEach((doc) => {
    //     const message = doc.data().message
    //     const userUid = doc.data().userUid
    //     const userName = doc.data().userName
    //     const messageClock = doc.data().messageClock
    //     setMsgList((prev) => [...prev, { msg: message, type: "me", userUid: userUid, id: userName, messageClock: messageClock }]);
    //   });
    // }
    const messageListMembers = async (conversation) => {
      const messageRef = collection(dbservice, `chats_${conversation}`)
      const messagesCollection = query(messageRef, orderBy('messageClock'))
      const messages = await getDocs(messagesCollection);
      const messagesArray = []
      messages.forEach((doc) => {
        const message = doc.data().message
        const userUid = doc.data().userUid
        const userName = doc.data().userName
        const messageClock = doc.data().messageClock
        messagesArray.push({ msg: message, type: "me", userUid: userUid, id: userName, messageClock: messageClock })
        setMsgList(messagesArray)
        // setMsgList((prev) => [...prev, { msg: message, type: "me", userUid: userUid, id: userName, messageClock: messageClock }]);
      });
    }
    if (changeMessage) { 
      // if (!conversation) {
      //   messageList()
      // } else {
      //   messageListMembers(conversation)
      // }
      messageListMembers(conversation)
      setChangeMessage(false)
    }
  }, [changeMessage, conversation])
  console.log(msgList)
  return (
    <div className="app-container">
      <div className="wrap">
          <div className="chat-box">
            <h3>
              개인 대화
            </h3>
            <ul className="chat">
              {msgList.map((v, i) => {
                if (v.type === "welcome") {
                  // return (
                  //   <li className="welcome">
                  //   <div className="line" />
                  //   <div>{v.msg}</div>
                  //   <div className="line" />
                  // </li>
                  // )
                } else {
                  let userDirection
                  if (v.userUid === userObj.uid) {
                    userDirection = 'me'
                  } else {
                    userDirection = 'other'
                  }
                  return (
                      <li
                        className={userDirection}
                        key={`${i}_li`}
                        name={v.id}
                        data-id={v.id}
                        onClick={() => onSetPrivateTarget(v.userUid)}
                      >
                        <div
                          className={
                            v.id === privateTarget ? "private-user" : "userId"
                          }
                          data-id={v.id}
                          name={v.id}
                        >
                          {v.id}
                        </div>
                        {v.userUid !== userObj.uid ? 
                        <div className='flex justify-start'>
                        <div className={'other'} data-id={v.id} name={v.id}>
                          {v.msg}
                        </div>
                        <div data-id={v.id} name={v.id}>
                          {v.messageClock}
                        </div>
                        </div>
                        :
                        <div className='flex justify-end'>
                        <div data-id={v.id} name={v.id}>
                          {v.messageClock}
                        </div>
                        <div className={'me'} data-id={v.id} name={v.id}>
                          {v.msg}
                        </div>
                        </div>
                        }
                      </li>
                  )
                }
                  }
                )
              }
              <li ref={messagesEndRef} />
            </ul>
            <form className="send-form" onSubmit={onSendSubmitHandler}>
              <input
                placeholder="Enter your message"
                onChange={onChangeMsgHandler}
                value={msg}
              />
              <button type="submit">send</button>
            </form>
          </div>
      </div>
    </div>
  );
}

export default Chatting;
