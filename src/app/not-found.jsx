// src/app/ERP/404.jsx
import Link from 'next/link';

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-100">
            <h1 className="text-6xl font-bold text-blue-600">404</h1>
            <p className="text-xl text-blue-800 mt-4">Oops! Página não encontrada.</p>
            <p className="text-md text-blue-700 mt-2">
                A página que você está procurando pode ter sido removida ou o link está incorreto.
            </p>
            <Link href="/">
                <button className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200">
                    Voltar para a Home
                </button>
            </Link>
        </div>
    );
};

export default NotFoundPage;
