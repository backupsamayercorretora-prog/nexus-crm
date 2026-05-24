import { useState, FormEvent } from 'react';
import { Sparkles, Mail, Lock, Check, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('contato@nexus.com');
  const [password, setPassword] = useState('nexus123');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    setIsLoading(true);
    setError('');

    // Simulando tempo de resposta do servidor de CRM
    setTimeout(() => {
      setIsLoading(false);
      onLogin(email);
    }, 750);
  };

  const handleDemoAccess = () => {
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      setIsLoading(false);
      onLogin('diretor@vancouver.com');
    }, 450);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-50 font-sans text-slate-800 antialiased overflow-y-auto">
      
      {/* Lado Esquerdo - Branding & Mock da Plataforma (Sleek Interface) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-indigo-950 via-indigo-900 to-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden shrink-0">
        {/* Gráfico / Círculos luminosos decorativos modernos */}
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>
        
        {/* Logo */}
        <div className="flex items-center space-x-3 relative z-10">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-indigo-500/30">
            N
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight">Nexus<span className="text-indigo-400 font-extrabold">CRM</span></span>
            <span className="text-[10px] ml-1.5 uppercase bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-semibold tracking-widest">PRO</span>
          </div>
        </div>

        {/* Mensagem e Proposição de Valor */}
        <div className="my-auto max-w-lg relative z-10 py-12">
          <div className="inline-flex items-center space-x-1 px-3 py-1 bg-indigo-500/15 text-indigo-300 rounded-full text-xs font-bold mb-6 border border-indigo-400/20">
            <Sparkles className="h-3.5 w-3.5 text-indigo-300 animate-pulse" />
            <span>CRM comercial de altíssima performance</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
            Monitore suas vendas de forma <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-300">inteligente</span>.
          </h1>
          <p className="text-slate-350 text-sm md:text-base mt-4 leading-relaxed">
            Acesse o NexusCRM, a plataforma completa para gestão comercial e CRM de alta performance. Faça login para gerenciar o funil de vendas, prospectar contatos, acompanhar empresas parceiras e automatizar propostas comerciais com inteligência artificial.
          </p>

          {/* KPI Minis para enriquecer a experiência de forma sleek */}
          <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-800">
            <div>
              <p className="text-slate-400 text-xs">Aceleração de Negócios</p>
              <p className="text-xl font-bold mt-1 text-emerald-400">+28% Conversão</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Eficácia Comercial</p>
              <p className="text-xl font-bold mt-1 text-cyan-400">CoPilot Ativo</p>
            </div>
          </div>
        </div>

        {/* Rodapé Interno */}
        <div className="text-xs text-slate-500 flex items-center justify-between relative z-10">
          <span>&copy; 2026 NexusCRM S.A.</span>
          <a href="#" className="hover:text-slate-300 transition-colors">Termos de Uso</a>
        </div>
      </div>

      {/* Lado Direito - Formulário de Login */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-16 lg:px-24 bg-white relative">
        <div className="w-full max-w-md mx-auto space-y-8">
          
          {/* Logo mobile */}
          <div className="flex md:hidden items-center justify-center space-x-2 mb-4">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-extrabold text-lg">
              N
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-950">NexusCRM</span>
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Acesso ao Sistema</h2>
            <p className="text-xs text-slate-500 mt-1.5">
              Utilize o usuário padrão abaixo ou insira seus dados para continuar.
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-250 text-rose-700 rounded-xl text-xs flex items-center space-x-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 tracking-wider uppercase mb-1.5">
                E-mail de Operador
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail className="h-4.5 w-4.5" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@empresa.com"
                  className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-450 transition-all focus:outline-none focus:ring-4 focus:ring-indigo-100/50"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 tracking-wider uppercase">
                  Senha de Acesso
                </label>
                <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                  Esqueceu a senha?
                </a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock className="h-4.5 w-4.5" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Insera sua senha de acesso"
                  className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-450 transition-all focus:outline-none focus:ring-4 focus:ring-indigo-100/50"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center space-x-2.5 select-none cursor-pointer">
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all ${
                    rememberMe 
                      ? 'bg-indigo-600 border-indigo-600 text-white' 
                      : 'border-slate-300 hover:border-slate-400 bg-white'
                  }`}
                >
                  {rememberMe && <Check className="h-3 w-3 stroke-[3]" />}
                </button>
                <span className="text-slate-650 font-medium font-sans">Mantenha-me conectado</span>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-850 text-white py-3 px-4 rounded-xl text-sm font-bold transition-all shadow-md shadow-indigo-500/10 cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center space-x-1.5">
                    <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                    <span>Autenticando...</span>
                  </span>
                ) : (
                  <>
                    <span>Entrar no Sistema</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Login de demonstração / Quick Access */}
          <div className="border-t border-slate-150 pt-6 space-y-4">
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-slate-400 font-medium">Não possui uma conta corporativa?</span>
            </div>

            <button
              onClick={handleDemoAccess}
              disabled={isLoading}
              className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 hover:border-indigo-200 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-75"
            >
              <ShieldCheck className="h-4.5 w-4.5 text-indigo-600" />
              <span>Experimentar com Acesso Demonstrativo</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 text-center leading-relaxed max-w-sm mx-auto">
            Ao se conectar, você declara aceitar as políticas de segurança de dados e monitoramento em conformidade com as diretrizes do NexusCRM.
          </div>

        </div>
      </div>

    </div>
  );
}
