'use client';

import { useDebugStore } from '@/stores/debugStore';
import { useState } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import atomOneDark from 'react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark';

SyntaxHighlighter.registerLanguage('json', json);

export default function DebugPanel() {
  const [open, setOpen] = useState(false);
  const { logs, clearLogs } = useDebugStore();

  function safeStringify(obj: unknown) {
    try {
      return typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2);
    } catch {
      return '[Unserializable value]';
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 text-sm text-gray-300">
      <button
        onClick={() => setOpen(!open)}
        className="bg-black bg-opacity-70 backdrop-blur-md px-3 py-1 rounded-full shadow hover:bg-opacity-90"
      >
        {open ? '× Close Debugger' : '🧪 Debug'}
      </button>

      {open && (
        <div className="mt-2 bg-neutral-900 p-4 rounded shadow-xl max-h-[80vh] w-[400px] overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold">API Debugger</h2>
            <button
              onClick={clearLogs}
              className="text-red-400 text-xs hover:underline"
            >
              Clear
            </button>
          </div>

          {Array.isArray(logs) &&
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            logs?.map((log: any, idx) => (
              <div
                key={idx}
                className="mb-4 border border-gray-700 rounded p-2"
              >
                <div className="text-xs text-gray-400 mb-1">
                  SEB product: {log.product ?? ''}
                </div>
                {typeof log.apiUrl === 'string' && (
                  <div className="text-xs text-gray-400 mb-1">
                    SEB endpoint: {log.apiUrl}
                  </div>
                )}
                <div className="text-xs text-gray-400 mb-1">
                  {log.timestamp} • {log.method} {log.url}
                </div>
                {log.requestBody && (
                  <>
                    <div className="text-xs text-gray-500 mt-1">
                      Request Body:
                    </div>
                    <SyntaxHighlighter language="json" style={atomOneDark}>
                      {safeStringify(log.requestBody)}
                    </SyntaxHighlighter>
                  </>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  Response ({log.responseStatus}):
                </div>
                {log.responseBody && (
                  <>
                    <div className="text-xs text-gray-500 mt-1">
                      Response Body:
                    </div>
                    <SyntaxHighlighter language="json" style={atomOneDark}>
                      {safeStringify(log.responseBody)}
                    </SyntaxHighlighter>
                  </>
                )}
              </div>
            ))}

          {logs.length === 0 && (
            <div className="text-xs text-gray-500">No API calls yet</div>
          )}
        </div>
      )}
    </div>
  );
}
