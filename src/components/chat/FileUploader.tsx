'use client';

import { useRef, useState } from 'react';
import { Paperclip, X, FileText, Image as ImageIcon } from 'lucide-react';
import { formatFileSize } from '@/lib/utils';

interface FileUploaderProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

export function FileUploader({ onFilesChange, maxFiles = 5, maxSizeMB = 10 }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files ?? []);
    const maxBytes = maxSizeMB * 1024 * 1024;
    const valid = incoming.filter((f) => f.size <= maxBytes).slice(0, maxFiles - selectedFiles.length);
    const next = [...selectedFiles, ...valid].slice(0, maxFiles);
    setSelectedFiles(next);
    onFilesChange(next);
    // Reset input so same file can be re-selected
    if (inputRef.current) inputRef.current.value = '';
  };

  const remove = (index: number) => {
    const next = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(next);
    onFilesChange(next);
  };

  return (
    <div>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        title="Attach file"
        style={{
          width: 36, height: 36, borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', background: selectedFiles.length > 0 ? 'rgba(108,99,255,0.2)' : 'none',
          color: selectedFiles.length > 0 ? 'var(--accent-2)' : 'var(--text-2)',
          cursor: 'pointer', transition: 'all .15s',
        }}
      >
        <Paperclip size={17} />
      </button>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip"
        onChange={handleChange}
        style={{ display: 'none' }}
        aria-label="Attach files"
      />

      {/* Preview list */}
      {selectedFiles.length > 0 && (
        <div
          style={{
            position: 'absolute', bottom: '100%', left: 0, right: 0,
            padding: '10px 16px', background: 'var(--bg-2)',
            borderTop: '1px solid var(--border)', display: 'flex', gap: 8, flexWrap: 'wrap',
          }}
        >
          {selectedFiles.map((file, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '5px 10px', borderRadius: 8,
                background: 'var(--bg-3)', border: '1px solid var(--border-2)', fontSize: 12,
              }}
            >
              {file.type.startsWith('image/') ? (
                <ImageIcon size={13} style={{ color: 'var(--green)', flexShrink: 0 }} />
              ) : (
                <FileText size={13} style={{ color: 'var(--accent-2)', flexShrink: 0 }} />
              )}
              <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-1)' }}>
                {file.name}
              </span>
              <span style={{ color: 'var(--text-3)', flexShrink: 0 }}>{formatFileSize(file.size)}</span>
              <button
                type="button"
                onClick={() => remove(i)}
                style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', display: 'flex', padding: 0 }}
                aria-label={`Remove ${file.name}`}
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
