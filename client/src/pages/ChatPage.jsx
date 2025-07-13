import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const SERVER_URL = 'http://localhost:5000';

function ChatPage() {
  const [room, setRoom] = useState('general');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState('');
  const [read, setRead] = useState('');
  const [rooms] = useState(['general', 'random', 'tech']);
  const socketRef = useRef();
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!username) return navigate('/');
    socketRef.current = io(SERVER_URL);
    socketRef.current.emit('join', { room, user: username });
    fetch(`/api/messages/${room}`)
      .then(res => res.json())
      .then(setMessages);
    socketRef.current.on('message', msg => setMessages(m => [...m, msg]));
    socketRef.current.on('users', setUsers);
    socketRef.current.on('notification', note => setMessages(m => [...m, { username: 'System', text: note, time: new Date().toLocaleTimeString() }]));
    socketRef.current.on('typing', ({ username: u }) => setTyping(u !== username ? `${u} is typing...` : ''));
    socketRef.current.on('read', ({ username: u }) => setRead(u !== username ? `${u} read messages` : ''));
    return () => socketRef.current.disconnect();
    // eslint-disable-next-line
  }, [room]);

  const sendMessage = e => {
    e.preventDefault();
    if (!message.trim()) return;
    socketRef.current.emit('message', { room, text: message, time: new Date().toLocaleTimeString() });
    setMessage('');
    socketRef.current.emit('read', { room });
  };

  const handleTyping = () => {
    socketRef.current.emit('typing', { room });
  };

  const handleRoomChange = r => {
    setRoom(r);
    setMessages([]);
    setTyping('');
    setRead('');
  };

  return (
    <div className="app-container" style={{display:'flex',flexDirection:'column',height:'100vh'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 16px',background:'#1976d2',color:'#fff'}}>
        <div>Socket.io Chat</div>
        <div>{username} <button onClick={()=>{localStorage.clear();navigate('/')}} style={{marginLeft:8,background:'none',border:'none',color:'#fff',cursor:'pointer'}}>Logout</button></div>
      </div>
      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        <div style={{width:120,background:'#f0f0f0',padding:8,display:'flex',flexDirection:'column',gap:8}}>
          {rooms.map(r => (
            <button key={r} onClick={()=>handleRoomChange(r)} style={{padding:8,background:r===room?'#1976d2':'#fff',color:r===room?'#fff':'#333',border:'none',borderRadius:4,cursor:'pointer'}}>{r}</button>
          ))}
        </div>
        <div style={{flex:1,display:'flex',flexDirection:'column',height:'100%'}}>
          <div style={{flex:1,overflowY:'auto',padding:12,background:'#fff'}}>
            {messages.map((msg,i) => (
              <div key={i} style={{marginBottom:8,textAlign:msg.username===username?'right':'left'}}>
                <span style={{fontWeight:'bold',color:msg.username===username?'#1976d2':'#333'}}>{msg.username}: </span>
                <span>{msg.text}</span>
                <span style={{fontSize:12,color:'#888',marginLeft:8}}>{msg.time}</span>
              </div>
            ))}
            {typing && <div style={{color:'#1976d2',fontStyle:'italic'}}>{typing}</div>}
            {read && <div style={{color:'#388e3c',fontStyle:'italic'}}>{read}</div>}
          </div>
          <form onSubmit={sendMessage} style={{display:'flex',padding:8,background:'#f4f6fb'}}>
            <input value={message} onChange={e=>setMessage(e.target.value)} onKeyDown={handleTyping} placeholder="Type a message..." style={{flex:1,padding:10,border:'1px solid #ccc',borderRadius:4}} />
            <button type="submit" style={{marginLeft:8,padding:'0 18px',background:'#1976d2',color:'#fff',border:'none',borderRadius:4}}>Send</button>
          </form>
        </div>
        <div style={{width:140,background:'#f0f0f0',padding:8,display:'flex',flexDirection:'column',gap:8}}>
          <div style={{fontWeight:'bold',marginBottom:8}}>Online Users</div>
          {users.map(u => (
            <div key={u} style={{padding:4,color:'#1976d2'}}>{u}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
