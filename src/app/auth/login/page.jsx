"use client";

import "../../globals.css";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [errorMessage, setErrorMessage] = useState(null); 
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false); // Estado de carregamento

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Ativa o estado de carregamento
        
        try {
            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, senha }),
            });
            if (response.ok) {
                router.push('/ERP/Agendamento');
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Erro ao fazer login. Verifique suas credenciais.");
            }
        } catch (error) {
            setErrorMessage("Erro de conexão com o servidor.");
        } finally {
            setIsLoading(false); // Desativa o estado de carregamento
        }
    };

    return (
        <div className="flex flex-col h-screen bg-blue-100 w-full">
            <div className="flex flex-col items-center justify-center h-full p-5">
                <h1 className="text-6xl mb-10 font-orbitron text-blue-900">T-Solution</h1>
                <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-5 rounded-lg shadow-md">
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-2 text-sm text-blue-900">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 text-lg border border-blue-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-2 text-sm text-blue-900">Senha:</label>
                        <input
                            type="password"
                            id="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            className="w-full p-2 text-lg border border-blue-300 rounded-md"
                            required
                        />
                    </div>
                    {errorMessage && <p className="mb-4 text-sm text-red-500">{errorMessage}</p>}
                    <button type="submit" className="w-full py-2 text-lg text-white bg-blue-900 rounded-md cursor-pointer transition-colors duration-300 hover:bg-indigo-400">
                        Entrar
                    </button>
                </form>
                {/* <p className="mt-5 text-sm text-blue-900 text-center">
                    Não tem uma conta? <a href="/auth/register" className="text-blue-900 font-bold">Cadastre-se</a>
                </p>
                <p className="mt-2 text-sm text-blue-900 text-center">
                    Esqueceu sua senha? <a href="/auth/forgot-password" className="text-blue-900 font-bold">Clique aqui</a>
                </p> */}
            </div>
        </div>
    );
};

export default Login;
