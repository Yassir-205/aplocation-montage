
import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { supabase } from '../../../lib/supabase';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password
        });

      if (loginError) throw loginError;

      const { data: admin, error: adminError } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', data.user.id)
        .maybeSingle();

      if (adminError || !admin) {
        await supabase.auth.signOut();
        throw new Error('This account is not an administrator.');
      }

      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f7f3ff'
    }}>
      <form onSubmit={login} style={{
        background: 'white',
        padding: 32,
        borderRadius: 18,
        width: 'min(400px, 90%)'
      }}>
        <h2>Neditiw Admin</h2>
        <p>Connect to manage your portfolio.</p>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: 12, marginBottom: 12 }}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: 12, marginBottom: 12 }}
        />

        {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}

        <button type="submit" disabled={loading}
          style={{
            width: '100%',
            padding: 12,
            background: '#8738f5',
            color: 'white',
            border: 0,
            borderRadius: 10
          }}>
          {loading ? 'Connecting...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
