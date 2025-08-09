import React, { useState, useEffect } from "react";
import { Input, List } from "antd";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";

interface SearchBarAntdProps {
  onSearch: (term: string, results: any[]) => void;
  products: any[];
  className?: string;
}

export const SearchBarAntd: React.FC<SearchBarAntdProps> = ({
  onSearch,
  products,
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Generar sugerencias
  const generateSuggestions = (term: string) => {
    if (!term.trim()) return [];

    const allTerms = new Set<string>();

    products.forEach((product) => {
      if (product.name.toLowerCase().includes(term.toLowerCase())) {
        allTerms.add(product.name);
      }

      const words = product.name.toLowerCase().split(" ");
      words.forEach((word: string) => {
        if (word.includes(term.toLowerCase()) && word.length > 2) {
          allTerms.add(word);
        }
      });

      if (
        product.category &&
        product.category.toLowerCase().includes(term.toLowerCase())
      ) {
        allTerms.add(product.category);
      }
    });

    return Array.from(allTerms)
      .filter((suggestion) =>
        suggestion.toLowerCase().includes(term.toLowerCase())
      )
      .sort((a, b) => {
        const aStartsWith = a.toLowerCase().startsWith(term.toLowerCase());
        const bStartsWith = b.toLowerCase().startsWith(term.toLowerCase());
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        return a.length - b.length;
      })
      .slice(0, 6);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (term.trim()) {
      const newSuggestions = generateSuggestions(term);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const performSearch = (term: string) => {
    if (!term.trim()) return;

    const results = products.filter(
      (product) =>
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        (product.category &&
          product.category.toLowerCase().includes(term.toLowerCase()))
    );

    onSearch(term, results);
    setShowSuggestions(false);
  };

  const selectSuggestion = (suggestion: string) => {
    setSearchTerm(suggestion);
    performSearch(suggestion);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setShowSuggestions(false);
    setSuggestions([]);
  };

  // Cerrar sugerencias si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".search-container")) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative search-container ${className}`}>
      <div className="relative">
        <Input
          value={searchTerm}
          placeholder="Buscador"
          prefix={<SearchOutlined className="text-gray-400" />}
          suffix={
            searchTerm && (
              <CloseOutlined
                onClick={clearSearch}
                className="cursor-pointer text-gray-400 hover:text-gray-600"
              />
            )
          }
          onChange={(e) => handleSearch(e.target.value)}
          onPressEnter={() => performSearch(searchTerm)}
          onFocus={() => searchTerm && setShowSuggestions(true)}
          className="!pl-10 !pr-10 w-full border-gray-300 focus:border-gray-500 focus:ring-gray-500"
        />
      </div>

      {/* Dropdown de sugerencias */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1 max-h-64 overflow-y-auto">
          <List
            dataSource={suggestions}
            renderItem={(suggestion) => (
              <List.Item
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => selectSuggestion(suggestion)}
              >
                <SearchOutlined className="text-gray-400 mr-2" />
                <span className="truncate">
                  {suggestion
                    .split(new RegExp(`(${searchTerm})`, "gi"))
                    .map((part, idx) =>
                      part.toLowerCase() === searchTerm.toLowerCase() ? (
                        <span key={idx} className="font-semibold text-gray-900">
                          {part}
                        </span>
                      ) : (
                        part
                      )
                    )}
                </span>
              </List.Item>
            )}
          />
        </div>
      )}

      {/* No hay sugerencias */}
      {showSuggestions && searchTerm && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1">
          <div className="p-4 text-center text-gray-500">
            <SearchOutlined className="text-xl mb-2 opacity-50" />
            <p className="text-sm">
              No se encontraron sugerencias para "{searchTerm}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
