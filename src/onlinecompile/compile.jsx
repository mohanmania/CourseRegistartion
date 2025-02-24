import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

const Compile = () => {
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("// Code here...");
  const [output, setOutput] = useState("Waiting for execution...");

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch("https://emkc.org/api/v2/piston/runtimes");
        const data = await response.json();
        setLanguages(data);
        setSelectedLanguage(data[0]?.language || "javascript");
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };
    fetchLanguages();
  }, []);

  const executeCode = async () => {
    setOutput("Running...");
    const payload = {
      language: selectedLanguage,
      version: "*",
      files: [{ content: code }],
    };
    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      setOutput(result.run.output || "No output");
    } catch (error) {
      setOutput("Error executing code");
      console.error(error);
    }
  };

  return (
    
    <div style={styles.container}>
     <h3  style={{backgroundColor:"Highlight"}}>just start Don't wait for perfection, just start the work & make perfect </h3>
       
      <div style={styles.header}>
        <select
          style={styles.select}
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          {languages.map((lang) => (
            <option key={lang.language} value={lang.language}>
              {lang.language} ({lang.version})
            </option>
          ))}
        </select>
        <button style={styles.button} onClick={executeCode}>Run Code</button>
      </div>
      <div style={styles.content}>
        <Editor
          height="400px"
          defaultLanguage={selectedLanguage}
          value={code}
          onChange={(value) => setCode(value)}
          options={{ theme: "vs-dark" }}
          style={styles.editor}
        />
        <p style={{color:"red"}}>OUTPUT:</p>
        <pre style={styles.output}>{output}</pre>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    height: "100vh",
    background: "rgba(66, 8, 8, 0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  },
  header: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    marginBottom: "10px",
    flexWrap: "wrap",
  },
  select: {
    padding: "8px",
    marginRight: "10px",
    borderRadius: "5px",
    background: "rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(5px)",
    border: "none",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "calc(100vh - 80px)",
  },
  editor: {
    flexGrow: 1,
    minHeight: "300px",
    width: "100%",
  },
  output: {
    background: "rgba(0, 0, 0, 0.7)",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    width: "100%",
    marginTop: "10px",
    minHeight: "150px",
    overflow: "auto",
  },
};

export default Compile;
