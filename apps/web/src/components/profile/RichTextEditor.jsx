import React, { useRef, useCallback, useEffect } from "react";

const toolbarBtnStyle = {
  background: "none",
  border: "1px solid #E2DDD5",
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: "13px",
  color: "#475569",
  fontWeight: 600,
  transition: "all 0.2s",
  minWidth: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const RichTextEditor = ({ value, onChange, label = "Description", placeholder = "Write your content here...", minHeight = 200 }) => {
  const editorRef = useRef(null);
  const isInternalChange = useRef(false);

  useEffect(() => {
    if (editorRef.current && !isInternalChange.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
    isInternalChange.current = false;
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isInternalChange.current = true;
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const execCommand = useCallback((command, val = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, val);
    handleInput();
  }, [handleInput]);

  const isActive = (command) => {
    try {
      return document.queryCommandState(command);
    } catch {
      return false;
    }
  };

  return (
    <div>
      {label && (
        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#0A1628", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.3px" }}>
          {label}
        </label>
      )}
      {/* Toolbar */}
      <div style={{ display: "flex", gap: "4px", padding: "8px 10px", border: "1px solid #E2DDD5", borderBottom: "none", background: "#F8FAFC" }}>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCommand("bold"); }}
          style={{ ...toolbarBtnStyle, fontWeight: 800, fontStyle: "normal" }}
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCommand("italic"); }}
          style={{ ...toolbarBtnStyle, fontStyle: "italic", fontFamily: "Georgia, serif" }}
          title="Italic"
        >
          I
        </button>
        <div style={{ width: "1px", background: "#E2DDD5", margin: "0 4px" }} />
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCommand("insertUnorderedList"); }}
          style={toolbarBtnStyle}
          title="Bullet List"
        >
          <i className="fas fa-list-ul" style={{ fontSize: "12px" }}></i>
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCommand("insertOrderedList"); }}
          style={toolbarBtnStyle}
          title="Numbered List"
        >
          <i className="fas fa-list-ol" style={{ fontSize: "12px" }}></i>
        </button>
      </div>
      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        data-placeholder={placeholder}
        style={{
          width: "100%",
          minHeight: `${minHeight}px`,
          padding: "14px",
          border: "1px solid #E2DDD5",
          fontSize: "14px",
          lineHeight: "1.7",
          color: "#0A1628",
          outline: "none",
          background: "#FFFFFF",
          overflowY: "auto",
        }}
        suppressContentEditableWarning
      />
      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #94A3B8;
          font-style: italic;
          pointer-events: none;
        }
        [contenteditable] ul, [contenteditable] ol {
          padding-left: 24px;
          margin: 8px 0;
        }
        [contenteditable] li {
          margin-bottom: 4px;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
