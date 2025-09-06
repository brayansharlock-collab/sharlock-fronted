import React, { useState } from "react";
import { Input, Dropdown } from "antd";
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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);

  // Generar sugerencias
  const generateSuggestions = (term: string) => {
    if (!term.trim()) return [];

    const allTerms = new Set<string>();

    products.forEach((product) => {
      if (product.name?.toLowerCase().includes(term.toLowerCase())) {
        allTerms.add(product.name);
      }

      const words = product.name?.toLowerCase().split(" ") || [];
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      const newSuggestions = generateSuggestions(value);
      setSuggestions(newSuggestions);
      setVisible(true);
    } else {
      setSuggestions([]);
      setVisible(false);
    }
  };

  const performSearch = (term: string) => {
    if (!term.trim()) return;

    const results = products.filter(
      (product) =>
        product.name?.toLowerCase().includes(term.toLowerCase()) ||
        (product.category &&
          product.category.toLowerCase().includes(term.toLowerCase()))
    );

    onSearch(term, results);
    setVisible(false);
  };

  const selectSuggestion = (suggestion: string) => {
    setSearchTerm(suggestion);
    performSearch(suggestion);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSuggestions([]);
    setVisible(false);
  };

  const handlePressEnter = () => {
    performSearch(searchTerm);
  };

  const handleVisibleChange = (flag: boolean) => {
    // No cerrar si el input está enfocado y hay texto
    if (!searchTerm) {
      setVisible(flag);
    } else {
      setVisible(flag && !!searchTerm);
    }
  };

  return (
    <Dropdown
      menu={{
        items: suggestions.length > 0
          ? suggestions.map((suggestion, index) => ({
            key: index,
            label: (
              <>
                <SearchOutlined style={{ marginRight: 8, color: "#bfbfbf" }} />
                <span>
                  {suggestion
                    .split(new RegExp(`(${searchTerm})`, "gi"))
                    .map((part, idx) =>
                      part.toLowerCase() === searchTerm.toLowerCase() ? (
                        <strong key={idx} style={{ fontWeight: 600 }}>
                          {part}
                        </strong>
                      ) : (
                        part
                      )
                    )}
                </span>
              </>
            ),
            onClick: () => selectSuggestion(suggestion),
          }))
          : [
            {
              key: "no-results",
              disabled: true,
              label: (
                <div style={{ textAlign: "center", color: "#ccc" }}>
                  <SearchOutlined style={{ marginBottom: 4, opacity: 0.5 }} />
                  <br />
                  <small> {searchTerm ? `No se encontraron sugerencias para ${searchTerm}`: "Escribe lo que deseas buscar" }</small>
                </div>
              ),
            },
          ],
      }}
      open={visible}
      onOpenChange={handleVisibleChange}
      placement="bottomLeft"
      overlayStyle={{ width: "auto" }}
      destroyOnHidden
    >
      <div
        className={className}
        style={{ display: "inline-block", width: "100%" }}
      >
        <Input
          placeholder="Buscador"
          value={searchTerm}
          onChange={handleSearchChange}
          onPressEnter={handlePressEnter}
          prefix={<SearchOutlined />}
          suffix={
            searchTerm ? (
              <CloseOutlined
                onClick={clearSearch}
                style={{ cursor: "pointer" }}
              />
            ) : null
          }
          style={{ width: "100%" }}
        />
      </div>
    </Dropdown>

  );
};