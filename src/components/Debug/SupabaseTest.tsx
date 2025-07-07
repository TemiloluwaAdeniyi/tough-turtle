"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SupabaseTest() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult('Testing connection...');
    
    try {
      // Test 1: Basic connection
      const { data, error } = await supabase.from('users').select('count').limit(1);
      
      if (error) {
        setResult(`❌ Database Error: ${error.message}\nDetails: ${JSON.stringify(error, null, 2)}`);
        return;
      }

      // Test 2: Auth connection
      const { data: authData, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        setResult(`❌ Auth Error: ${authError.message}`);
        return;
      }

      setResult(`✅ Connection successful!\n- Database: Connected\n- Auth: ${authData.session ? 'Authenticated' : 'Not authenticated'}\n- Data: ${JSON.stringify(data, null, 2)}`);
      
    } catch (error) {
      setResult(`❌ Network Error: ${error instanceof Error ? error.message : 'Unknown error'}\n${error instanceof Error ? error.stack : ''}`);
    } finally {
      setLoading(false);
    }
  };

  const testSignup = async () => {
    setLoading(true);
    setResult('Testing signup process...');
    
    try {
      // Test signup with a dummy user
      const testEmail = `test-${Date.now()}@example.com`;
      const testPassword = 'TestPassword123!';
      const testUsername = `testuser${Date.now()}`;
      
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: { username: testUsername }
        }
      });
      
      if (error) {
        setResult(`❌ Signup Error: ${error.message}\nCode: ${error.status}\nDetails: ${JSON.stringify(error, null, 2)}`);
        return;
      }
      
      setResult(`✅ Signup test successful!\nUser ID: ${data.user?.id}\nEmail: ${data.user?.email}\nConfirmation sent: ${data.user?.email_confirmed_at ? 'No' : 'Yes'}`);
      
    } catch (error) {
      setResult(`❌ Signup Test Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-modern glass p-6 rounded-xl max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-white mb-4">🔧 Supabase Debug Panel</h3>
      
      <div className="space-y-4">
        <div className="flex gap-3">
          <button
            onClick={testConnection}
            disabled={loading}
            className="btn-modern px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors border border-blue-500/30"
          >
            Test Connection
          </button>
          
          <button
            onClick={testSignup}
            disabled={loading}
            className="btn-modern px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors border border-green-500/30"
          >
            Test Signup
          </button>
        </div>
        
        {loading && (
          <div className="flex items-center gap-2 text-gray-300">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Testing...</span>
          </div>
        )}
        
        {result && (
          <div className="glass rounded-lg p-4 mt-4">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono overflow-x-auto">
              {result}
            </pre>
          </div>
        )}
        
        <div className="text-xs text-gray-400 mt-4">
          <p><strong>Environment Check:</strong></p>
          <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
          <p>URL Value: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'undefined'}</p>
          <p>Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
          <p>Key Preview: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...` : 'undefined'}</p>
          <p>Environment: {typeof window !== 'undefined' ? 'Client' : 'Server'}</p>
          <p>Domain: {typeof window !== 'undefined' ? window.location.origin : 'Server-side'}</p>
        </div>
      </div>
    </div>
  );
}