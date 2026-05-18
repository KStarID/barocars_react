import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile, updatePassword, deleteUser } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminProfile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Profile State
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setUpdatingProfile(true);
    setProfileMessage(null);
    try {
      await updateProfile(currentUser, { displayName });
      setProfileMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (error: any) {
      setProfileMessage({ type: 'error', text: error.message || 'Failed to update profile.' });
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    setUpdatingPassword(true);
    setPasswordMessage(null);
    try {
      await updatePassword(currentUser, newPassword);
      setPasswordMessage({ type: 'success', text: 'Password updated successfully.' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        setPasswordMessage({ type: 'error', text: 'Please log out and log in again before updating your password for security reasons.' });
      } else {
        setPasswordMessage({ type: 'error', text: error.message || 'Failed to update password.' });
      }
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    try {
      await deleteUser(currentUser);
      navigate('/');
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        alert('For security reasons, please log out and log in again before deleting your account.');
        await logout();
        navigate('/login');
      } else {
        alert('Failed to delete account: ' + error.message);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-10">

      {/* Profile Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="text-xl font-semibold text-foreground">Profile Information</h4>
          <p className="text-sm text-muted-foreground mt-2">
            Update your account's profile information.
          </p>
        </div>
        <div className="md:col-span-2">
          <div className="bg-card shadow rounded-lg p-6 border border-border">
            {profileMessage && (
              <div className={`p-4 rounded-lg mb-6 flex items-start gap-3 text-sm ${profileMessage.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'}`}>
                {profileMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                <p>{profileMessage.text}</p>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="displayName">Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your Full Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={currentUser?.email || ''}
                  disabled
                  className="bg-muted text-muted-foreground cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">Email is linked to your Firebase identity and cannot be changed here.</p>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 w-32" disabled={updatingProfile}>
                  {updatingProfile ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-border"></div>

      {/* Update Password Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="text-xl font-semibold text-foreground">Update Password</h4>
          <p className="text-sm text-muted-foreground mt-2">
            Ensure your account is using a long, random password to stay secure.
          </p>
        </div>
        <div className="md:col-span-2">
          <div className="bg-card shadow rounded-lg p-6 border border-border">
            {passwordMessage && (
              <div className={`p-4 rounded-lg mb-6 flex items-start gap-3 text-sm ${passwordMessage.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'}`}>
                {passwordMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                <p>{passwordMessage.text}</p>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 w-32" disabled={updatingPassword}>
                  {updatingPassword ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-border"></div>

      {/* Delete Account Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="text-xl font-semibold text-foreground">Delete Account</h4>
          <p className="text-sm text-muted-foreground mt-2">
            Permanently delete your account.
          </p>
        </div>
        <div className="md:col-span-2">
          <div className="bg-card shadow rounded-lg p-6 border border-border">
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please ensure you are absolutely certain.
              </p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-red-600">Delete Account</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you absolutely sure you want to delete your account? This action cannot be undone and you will lose access to all your data immediately.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                    Yes, Delete My Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

    </div>
  );
}
