
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { User, Lock, Mail, ArrowLeft, Heart, History, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type ViewState = 'login' | 'register' | 'forgot';

const Account: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [view, setView] = useState<ViewState>('login');
  
  // State for login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State for Logged In User
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for Admin
    if (email === 'admin@comfort-asbl.com') {
        // Open admin dashboard in a new window/tab
        window.open('#/admin', '_blank');
    } else {
        // Mock Login for regular user
        setIsLoggedIn(true);
    }
  };

  const handleGoogleLogin = () => {
      // API call to Google would go here
      console.log('Logging in with Google');
      alert('Connexion avec Google (Simulation)');
      // Simulate success for user
      setIsLoggedIn(true);
  };

  const handleOneAccountLogin = () => {
      // API call to Oneaccount would go here
      console.log('Logging in with Oneaccount');
      alert('Connexion avec Oneaccount (Simulation)');
      // Simulate success for user
      setIsLoggedIn(true);
  };

  const handleResetPassword = (e: React.FormEvent) => {
      e.preventDefault();
      // Logic to send reset email to admins/user
      alert('Un lien de réinitialisation a été envoyé à votre adresse email (et aux administrateurs).');
      setView('login');
  };

  const handleLogout = () => {
      setIsLoggedIn(false);
      setEmail('');
      setPassword('');
  };

  /* --- LOGGED IN USER DASHBOARD --- */
  if (isLoggedIn) {
      return (
          <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
              <div className="max-w-4xl mx-auto">
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                      {/* Header */}
                      <div className="bg-comfort-blue px-6 py-8 text-white flex justify-between items-center">
                          <div className="flex items-center">
                              <div className="bg-white/20 p-4 rounded-full mr-4">
                                  <User size={40} className="text-white" />
                              </div>
                              <div>
                                  <h1 className="text-2xl font-serif font-bold">{t('account.my_space')}</h1>
                                  <p className="opacity-80">{email || "Utilisateur"}</p>
                                  <span className="text-xs bg-white/20 px-2 py-1 rounded mt-2 inline-block uppercase tracking-wider">{t('account.role_user')}</span>
                              </div>
                          </div>
                          <button onClick={handleLogout} className="flex items-center text-sm font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded transition-colors">
                              <LogOut size={16} className="mr-2" /> {t('account.logout')}
                          </button>
                      </div>

                      {/* Content Grid */}
                      <div className="p-8 grid md:grid-cols-2 gap-8">
                          {/* Donations History */}
                          <div className="border border-gray-100 rounded-lg p-6 hover:shadow-md transition-shadow">
                              <div className="flex items-center mb-4 text-comfort-blue">
                                  <Heart size={24} className="mr-3" />
                                  <h2 className="text-xl font-bold text-gray-800">{t('account.my_donations')}</h2>
                              </div>
                              <p className="text-gray-500 mb-4 text-sm">{t('account.no_donations')}</p>
                              <button className="text-comfort-blue text-sm font-bold hover:underline">{t('account.make_donation')} →</button>
                          </div>

                          {/* Profile Settings */}
                          <div className="border border-gray-100 rounded-lg p-6 hover:shadow-md transition-shadow">
                              <div className="flex items-center mb-4 text-comfort-blue">
                                  <Settings size={24} className="mr-3" />
                                  <h2 className="text-xl font-bold text-gray-800">{t('account.my_info')}</h2>
                              </div>
                              <div className="space-y-2 text-sm text-gray-600">
                                  <p><span className="font-bold">Email:</span> {email || "user@example.com"}</p>
                                  <p><span className="font-bold">{t('account.member_since')}:</span> 2024</p>
                              </div>
                              <button className="mt-4 text-comfort-blue text-sm font-bold hover:underline">{t('account.edit_profile')} →</button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  /* --- LOGIN / REGISTER / FORGOT VIEWS --- */
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
            <div className="bg-comfort-blue p-4 rounded-full">
                <User size={40} className="text-white" />
            </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-serif font-bold text-gray-900">
          {view === 'login' && t('account.title')}
          {view === 'register' && t('account.register_title')}
          {view === 'forgot' && t('account.reset_title')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
           {view === 'login' && t('account.login_title')}
           {view === 'register' && t('account.register_subtitle')}
           {view === 'forgot' && t('account.reset_subtitle')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
          
          {/* LOGIN VIEW */}
          {view === 'login' && (
            <form className="space-y-6" onSubmit={handleLogin}>
                <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    {t('account.email_label')}
                </label>
                <div className="mt-1 relative">
                    <input 
                        id="email" 
                        name="email" 
                        type="email" 
                        autoComplete="email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-comfort-blue focus:border-comfort-blue sm:text-sm" 
                    />
                </div>
                </div>

                <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    {t('account.password_label')}
                </label>
                <div className="mt-1 relative">
                    <input 
                        id="password" 
                        name="password" 
                        type="password" 
                        autoComplete="current-password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-comfort-blue focus:border-comfort-blue sm:text-sm" 
                    />
                </div>
                </div>

                <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-comfort-blue focus:ring-comfort-blue border-gray-300 rounded" />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Se souvenir de moi
                    </label>
                </div>

                <div className="text-sm">
                    <button type="button" onClick={() => setView('forgot')} className="font-medium text-comfort-blue hover:text-blue-900">
                    {t('account.forgot_password')}
                    </button>
                </div>
                </div>

                <div>
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-comfort-blue hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-comfort-blue uppercase tracking-wide">
                    {t('account.login_button')}
                </button>
                </div>
            </form>
          )}

          {/* REGISTER VIEW */}
          {view === 'register' && (
             <form className="space-y-6" action="#" method="POST">
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('account.fullname_label')}</label>
                    <div className="mt-1"><input type="text" required className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-comfort-blue focus:border-comfort-blue sm:text-sm" /></div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('account.email_label')}</label>
                    <div className="mt-1"><input type="email" required className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-comfort-blue focus:border-comfort-blue sm:text-sm" /></div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('account.password_label')}</label>
                    <div className="mt-1"><input type="password" required className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-comfort-blue focus:border-comfort-blue sm:text-sm" /></div>
                </div>
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-comfort-blue hover:bg-blue-900 uppercase tracking-wide">
                    {t('account.register')}
                </button>
             </form>
          )}

          {/* FORGOT PASSWORD VIEW */}
          {view === 'forgot' && (
              <form className="space-y-6" onSubmit={handleResetPassword}>
                  <div className="text-sm text-gray-500 mb-4 text-center">
                      {t('account.reset_subtitle')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('account.email_label')}</label>
                    <div className="mt-1"><input type="email" required className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-comfort-blue focus:border-comfort-blue sm:text-sm" /></div>
                  </div>
                  <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-comfort-blue hover:bg-blue-900 uppercase tracking-wide">
                    {t('account.reset_button')}
                  </button>
                  <button type="button" onClick={() => setView('login')} className="w-full flex items-center justify-center mt-4 text-sm font-medium text-gray-600 hover:text-comfort-blue">
                      <ArrowLeft size={16} className="mr-2" /> {t('account.back_login')}
                  </button>
              </form>
          )}

          {/* Social Logins (Visible on Login & Register) */}
          {view !== 'forgot' && (
            <>
                <div className="mt-6">
                    <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                    <div>
                        <button onClick={handleGoogleLogin} className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                            <span className="sr-only">Sign in with Google</span>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.48 10.92v3.28h7.88c-.3 1.6-1.2 2.92-2.52 3.84v.04l3.6 2.8A11.96 11.96 0 0 0 24 12.56c0-.96-.08-1.72-.24-2.48H12.48z" fill="#4285F4"/><path d="M5.64 14.56a6.8 6.8 0 0 1-.36-2.08c0-.76.12-1.48.36-2.16l-3.92-3.04A11.84 11.84 0 0 0 .56 12.48c0 1.96.48 3.8 1.28 5.4l3.8-3.32z" fill="#FBBC05"/><path d="M12.48 5.24c1.64 0 3.12.56 4.28 1.64l3.16-3.16C17.92 1.92 15.4.88 12.48.88 7.92.88 3.96 3.48 2 7.28l3.96 3.08C7 7.76 9.48 5.24 12.48 5.24z" fill="#EA4335"/><path d="M12.48 24.12a11.56 11.56 0 0 0 8.04-2.84l-3.8-3.04c-1.12.76-2.6 1.24-4.24 1.24-2.96 0-5.48-2.04-6.4-4.8L2.08 17.6a11.84 11.84 0 0 0 10.4 6.52z" fill="#34A853"/></svg>
                        </button>
                    </div>

                    <div>
                        <button onClick={handleOneAccountLogin} className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Sign in with Oneaccount</span>
                        {/* Placeholder Icon for OneAccount */}
                        <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">1</div>
                        </button>
                    </div>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    {view === 'login' ? (
                        <p className="text-sm text-gray-600">
                            {t('account.no_account')}{' '}
                            <button onClick={() => setView('register')} className="font-medium text-comfort-blue hover:text-blue-900">
                                {t('account.register')}
                            </button>
                        </p>
                    ) : (
                         <p className="text-sm text-gray-600">
                            Déjà un compte ?{' '}
                            <button onClick={() => setView('login')} className="font-medium text-comfort-blue hover:text-blue-900">
                                {t('account.login_button')}
                            </button>
                        </p>
                    )}
                </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
