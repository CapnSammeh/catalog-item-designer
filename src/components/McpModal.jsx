import { useState } from 'react'

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      onClick={copy}
      className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors shrink-0"
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

function CodeBlock({ code }) {
  return (
    <div className="flex items-start gap-2">
      <pre className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-md p-3 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed text-gray-700 font-mono">
        {code}
      </pre>
      <CopyButton text={code} />
    </div>
  )
}

function deriveUrls(repoUrl) {
  // Accept various GitHub URL formats
  const match = repoUrl.trim()
    .replace(/\.git$/, '')
    .match(/github\.com[/:]([^/]+)\/([^/\s]+)/)
  if (!match) return null
  const [, owner, repo] = match
  const mcpUrl = `https://gitmcp.io/${owner}/${repo}`
  const config = JSON.stringify({
    mcpServers: {
      "catalog-designer": {
        type: "http",
        url: mcpUrl,
      }
    }
  }, null, 2)
  return { mcpUrl, config, owner, repo }
}

export default function McpModal({ onClose }) {
  const [repoUrl, setRepoUrl] = useState('')
  const derived = repoUrl.includes('github.com') ? deriveUrls(repoUrl) : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">Connect via MCP</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Let Claude generate catalog item designs for you directly
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-5 p-5 overflow-y-auto">

          {/* Step 1 */}
          <div className="flex gap-3">
            <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 mb-1">Push this repo to GitHub</p>
              <CodeBlock code={`git init && git add .\ngit commit -m "Initial commit"\ngh repo create catalog-item-designer --public --push`} />
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-3">
            <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 mb-1">Enter your GitHub repo URL</p>
              <input
                className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-400"
                placeholder="https://github.com/your-username/catalog-item-designer"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
              />
              {repoUrl && !derived && (
                <p className="text-xs text-red-500 mt-1">Doesn't look like a GitHub URL — try https://github.com/username/repo</p>
              )}
            </div>
          </div>

          {/* Step 3 — shown once URL is valid */}
          {derived && (
            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 mb-1">Add to Claude's MCP config</p>
                <p className="text-xs text-gray-500 mb-2">
                  Add this to <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">~/.claude/settings.json</code> or run{' '}
                  <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">/mcp</code> inside Claude Code.
                </p>
                <CodeBlock code={derived.config} />
              </div>
            </div>
          )}

          {/* Step 4 */}
          {derived && (
            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">4</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 mb-2">Ask Claude to generate a design</p>
                <CodeBlock code={`Using the catalog-designer MCP, generate a catalog item for [describe your form]. Return it as JSON I can import.`} />
                <p className="text-xs text-gray-400 mt-2">
                  Claude will read the schema from your repo and return a ready-to-import JSON design.
                </p>
              </div>
            </div>
          )}

          {/* Divider + gitmcp link */}
          <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Powered by{' '}
              <a
                href="https://gitmcp.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                gitmcp.io
              </a>
              {derived && (
                <> · <a href={derived.mcpUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View your MCP endpoint ↗</a></>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
