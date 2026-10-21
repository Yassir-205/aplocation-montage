
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function ProtectedAdmin() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkAccess() {
      setLoading(true);

      try {
        const { data, error } = await supabase.auth.getUser();

        if (error || !data.user) {
          if (active) setAuthorized(false);
          return;
        }

        const { data: admin, error: adminError } = await supabase
          .from('admins')
          .select('user_id')
          .eq('user_id', data.user.id)
          .maybeSingle();

        if (active) setAuthorized(!adminError && !!admin);
      } catch {
        if (active) setAuthorized(false);
      } finally {
        if (active) setLoading(false);
      }
    }

    checkAccess();

    const { data: subscription } =
      supabase.auth.onAuthStateChange(() => {
        checkAccess();
      });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <p style={{ padding: 30 }}>Checking access...</p>;

  return authorized
    ? <Outlet />
    : <Navigate to="/admin/login" replace />;
}
