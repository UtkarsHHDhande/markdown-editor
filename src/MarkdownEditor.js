import React, { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';


const MarkdownEditor = () => {
    const [value, setValue] = useState("## Write your markdown here!");
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [imageList, setImageList] = useState([]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Insert image markdown
                setValue((prev) => `${prev}\n![Image](${reader.result})\n`);
                setImageList((prev) => [...prev, reader.result]); // Store image
            };
            reader.readAsDataURL(file);
        }
    };

    const handleExport = () => {
        const blob = new Blob([value], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className={`container mx-auto p-5 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <h1 className="text-3xl font-bold mb-4">Markdown Editor</h1>
            <button 
                onClick={toggleTheme} 
                className="mb-4 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
                Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
            </button>
            <MDEditor 
                value={value} 
                onChange={setValue} 
                height={400} 
                className="border rounded-lg shadow-md"
                data-color-mode={isDarkMode ? "dark" : "light"}
            />
            <div className="mt-4">
    <h2 className="text-xl font-semibold">Preview</h2>
    <ReactMarkdown
        children={value}
        components={{
            code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                    <SyntaxHighlighter style={solarizedlight} language={match[1]} PreTag="div">
                        {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                ) : (
                    <code className={className} {...props}>
                        {children}
                    </code>
                );
            },
        }}
        className="mt-2 p-4 border rounded-lg shadow-md bg-gray-50"
    />
</div>
            <div className="mt-4">
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="mb-2"
                />
                <button 
                    onClick={handleExport} 
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                >
                    Export as .md
                </button>
            </div>
            {/* Render uploaded images */}
            <div className="mt-4">
                {imageList.map((src, index) => (
                    <div key={index} className="flex items-center mb-2">
                        <img src={src} alt={`uploaded-${index}`} className="w-16 h-auto mr-2" />
                        <button 
                            onClick={() => {
                                setImageList(imageList.filter((_, i) => i !== index));
                                setValue(value.replace(`![Image](${src})\n`, '')); // Remove image from markdown
                            }} 
                            className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarkdownEditor;