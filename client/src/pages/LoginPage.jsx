import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isRegister
      ? 'http://localhost:5000/api/register'
      : 'http://localhost:5000/api/login';
    try {
      const body = isRegister ? { username, email, password } : { username, password };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        throw new Error('Server error: Invalid response. Check server logs.');
      }
      if (!res.ok) throw new Error(data.message || 'Error');
      if (!isRegister) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        navigate('/chat');
      } else {
        setIsRegister(false);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app-container" style={{justifyContent:'center',alignItems:'center',display:'flex',height:'100vh'}}>
      <form onSubmit={handleSubmit} style={{background:'#fff',padding:24,borderRadius:8,boxShadow:'0 2px 8px #0001',width:'100%',maxWidth:340}}>
        <h2 style={{marginBottom:16}}>{isRegister ? 'Register' : 'Login'}</h2>
        <input type="text" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} required style={{width:'100%',marginBottom:12,padding:8}} />
        {isRegister && (
          <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required style={{width:'100%',marginBottom:12,padding:8}} />
        )}
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required style={{width:'100%',marginBottom:12,padding:8}} />
        {error && <div style={{color:'red',marginBottom:8}}>{error}</div>}
        <button type="submit" style={{width:'100%',padding:10,background:'#1976d2',color:'#fff',border:'none',borderRadius:4}}>{isRegister ? 'Register' : 'Login'}</button>
        <div style={{marginTop:12,textAlign:'center'}}>
          <span style={{fontSize:14}}>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
            <button type="button" style={{marginLeft:8,background:'none',border:'none',color:'#1976d2',cursor:'pointer'}} onClick={()=>setIsRegister(r=>!r)}>
              {isRegister ? 'Login' : 'Register'}
            </button>
          </span>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
