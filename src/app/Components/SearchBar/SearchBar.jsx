import React from 'react';

const SearchBar = ({ placeholder }) => {
    const handleSearch = (e) => {
        e.preventDefault();
        // Add lógica de pesquisa 
    };

    return (
        <form onSubmit={handleSearch} className="flex items-center justify-left ">
            <input
                type="text"
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
