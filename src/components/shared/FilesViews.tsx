'use client';

import { FileUploader } from '@/components/chat/FileUploader';
import { useState } from 'react';
import { FileText, Image as ImageIcon } from 'lucide-react';
import { formatFileSize } from '@/lib/utils';

export function FilesView() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div style={{ padding: 24, maxWidth: 700 }}>
      <p style={{ color: 'var(--text-3)', fontSize: 14, marginBottom: 20 }}>
        Attach files to send in a conversation, or browse previously shared files.
      </p>

      <div style={{
        padding: 20, borderRadius: 12,
        border: '1px dashed var(--border)', background: 'var(--bg-2)',
        marginBottom: 24,
      }}>
        <FileUploader onFilesChange={setFiles} maxFiles={10} maxSizeMB={10} />
        {files.length > 0 && (
          <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 8 }}>
            {files.length} file{files.length > 1 ? 's' : ''} selected
          </p>
        )}
      </div>

      {files.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {files.map((file, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 10,
              background: 'var(--bg-2)', border: '1px solid var(--border)',
            }}>
              {file.type.startsWith('image/')
                ? <ImageIcon size={16} style={{ color: 'var(--green)' }} />
                : <FileText size={16} style={{ color: 'var(--accent-2)' }} />
              }
              <span style={{ flex: 1, fontSize: 13, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {file.name}
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-3)', flexShrink: 0 }}>
                {formatFileSize(file.size)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}