import { useState, type FormEvent } from 'react';
import { ArrowRight, Eye, EyeOff, LoaderCircle, Lock, User } from 'lucide-react';

const REMEMBER_KEY = 'zhixi-login-account';
const INITIAL_ACCOUNT = 'zhixi666';
const INITIAL_PASSWORD = '123456';

function readRememberedAccount() {
  try {
    return localStorage.getItem(REMEMBER_KEY) ?? '';
  } catch {
    return '';
  }
}

export default function LoginPage({ onLogin }: { onLogin: (account: string) => void }) {
  const [account, setAccount] = useState(readRememberedAccount);
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [hint, setHint] = useState('');

  function submit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return;
    const name = account.trim();
    if (!name) {
      setError('请输入账号');
      return;
    }
    if (!password) {
      setError('请输入密码');
      return;
    }
    if (name !== INITIAL_ACCOUNT || password !== INITIAL_PASSWORD) {
      setError('账号或密码不正确');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      if (remember) localStorage.setItem(REMEMBER_KEY, name);
      else localStorage.removeItem(REMEMBER_KEY);
    } catch {
      /* 存储不可用时不影响本次登录 */
    }
    // 演示版未接入账号服务：保留短暂的提交反馈后进入工作台。
    window.setTimeout(() => onLogin(name), 480);
  }

  return (
    <div className="login-page">
      <div className="login-aura login-aura-mint" />
      <div className="login-aura login-aura-blue" />
      <div className="login-aura login-aura-violet" />
      <div className="login-shard login-shard-left" />
      <div className="login-shard login-shard-right" />

      <div className="login-card" role="main">
        <div className="login-brand">
          <svg className="login-logo" viewBox="0 0 34 24" role="img" aria-label="智析 AI">
            <defs>
              <linearGradient id="login-logo-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#3ee0ef" />
                <stop offset=".52" stopColor="#3f8dfb" />
                <stop offset="1" stopColor="#3f5bf2" />
              </linearGradient>
            </defs>
            <path d="M1.6 21.6 9.2 4.5c1-2.2 3.4-2.2 4.4 0l4 9-5 8.1Z" fill="url(#login-logo-gradient)" />
            <path d="M16.4 21.6 24 4.5c1-2.2 3.4-2.2 4.4 0l4 9-5 8.1Z" fill="url(#login-logo-gradient)" opacity=".78" />
          </svg>
          <span>智析 <b>AI</b></span>
        </div>

        <h1>登录</h1>
        <p className="login-subtitle">欢迎回来！登录智析 AI，继续使用你的智能生产力平台。</p>

        <form className="login-form" onSubmit={submit} noValidate>
          <label className="login-field">
            <User size={17} aria-hidden="true" />
            <input
              value={account}
              onChange={event => { setAccount(event.target.value); setError(''); }}
              placeholder="请输入账号"
              aria-label="账号"
              autoComplete="username"
              autoFocus
            />
          </label>

          <label className="login-field">
            <Lock size={17} aria-hidden="true" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={event => { setPassword(event.target.value); setError(''); }}
              placeholder="请输入密码"
              aria-label="密码"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="login-eye"
              aria-label={showPassword ? '隐藏密码' : '显示密码'}
              onClick={() => setShowPassword(value => !value)}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </label>

          <div className="login-options">
            <button
              type="button"
              className="login-remember"
              role="checkbox"
              aria-checked={remember}
              onClick={() => setRemember(value => !value)}
            >
              <span className={remember ? 'login-checkbox checked' : 'login-checkbox'} aria-hidden="true">
                {remember && <svg viewBox="0 0 12 10"><path d="M1 5.2 4.3 8.5 11 1.5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </span>
              记住我
            </button>
            <button type="button" className="login-link" onClick={() => setHint('演示环境暂未接入找回密码服务，请联系管理员重置。')}>忘记密码？</button>
          </div>

          {error && <p className="login-error" role="alert">{error}</p>}
          {!error && hint && <p className="login-hint" role="status">{hint}</p>}

          <button type="submit" className="login-submit" disabled={submitting}>
            {submitting ? <LoaderCircle size={18} className="spin" /> : null}
            {submitting ? '正在登录' : '登录'}
            {!submitting && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="login-divider"><span>还没有账号？</span></div>

        <button type="button" className="login-create" onClick={() => setHint('演示环境暂未开放注册，请联系管理员创建账号。')}>创建账号</button>
      </div>
    </div>
  );
}
