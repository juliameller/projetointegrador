import React from 'react';

const SearchBar = ({ placeholder, value, onChange }) => {
    // Função correta para capturar as mudanças do input
    const handleInputChange = (e) => {
        onChange(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Previne o reload da página ao apertar Enter
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center justify-left">
            <input
                type="text"
                value={value}
                onChange={handleInputChange}
                placeholder={placeholder || "Search..."}
                className="px-4 py-2 border-2 border-blue-500 rounded-lg outline-none focus:border-blue-200"
            />
            <button type="submit" className="bg-transparent border-none text-blue-500 text-2xl ml-[-40px] cursor-pointer">
                🔍
            </button>
        </form>
    );
};

export default SearchBar;
