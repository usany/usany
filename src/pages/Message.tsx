import { useState, useEffect } from 'react'
import { auth, onSocialClick, dbservice, storage } from 'src/baseApi/serverbase'
import { collection, query, where, orderBy, addDoc, getDocs, doc, onSnapshot, deleteDoc, updateDoc } from 'firebase/firestore';
// import Btn from 'src/pages/Btn';
// import Avatars from 'src/muiComponents/Avatars';
// import FastRewindIcon from '@mui/icons-material/FastRewind';
// import { BrowserRouter, Routes, Route, useNavigate, Link } from 'react-router-dom'
// import Papers from 'src/muiComponents/Papers';
import Cards from 'src/muiComponents/Cards';
// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import Avatar from '@mui/material/Avatar';
// import { blue } from '@mui/material/colors';

function Message({ msgObj, isOwner, userObj }) {
  const [num, setNum] = useState(null)
  const [points, setPoints] = useState(null)

  // useEffect(() => {
  //   onSnapshot(query(doc(dbservice, `members/${msgObj.creatorId}`)), (snapshot) => {
  //       const number = snapshot.data()?.points
  //       setNum(number)
  //     }
  //   )
  // }, [])
  // useEffect(() => {
  //   if (msgObj.connectedId !== null) {
  //     onSnapshot(query(doc(dbservice, `members/${msgObj.connectedId}`)), (snapshot) => {
  //       const element = snapshot.data()?.points
  //       setPoints(element)
  //     })
  //   }
  // })
  console.log(msgObj)
  return (
    <div>
      <Cards msgObj={msgObj} isOwner={isOwner} userObj={userObj} num={num} points={points} />
      {/* {msgObj.creatorId === userObj.uid && 
      }
      {msgObj.connectedId === userObj.uid && msgObj.round !== 1} */}
    </div>
  )
}

export default Message
