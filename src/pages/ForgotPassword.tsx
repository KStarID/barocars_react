import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setMessage('');
      setError('');
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setMessage('Tautan reset password telah dikirim ke email Anda. Silakan periksa kotak masuk atau folder spam Anda.');
    } catch (err: any) {
      setError('Gagal mengirim email reset. Pastikan email yang Anda masukkan benar dan sudah terdaftar.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
        </motion.div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-6 text-center text-3xl font-extrabold text-foreground"
        >
          Reset your password
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-2 text-center text-sm text-muted-foreground"
        >
          Masukkan email akun Anda untuk menerima tautan reset password.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-card py-8 px-4 shadow-xl shadow-emerald-100/50 dark:shadow-none sm:rounded-2xl sm:px-10 border border-border">
          <form className="space-y-6" onSubmit={handleResetPassword}>
            {error && (
              <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 p-3 rounded-lg text-sm text-center border border-emerald-200 dark:border-emerald-900">
                {message}
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-foreground">Email address</Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200"
              disabled={loading}
            >
              {loading ? "Sending link..." : "Send Reset Link"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-500">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
