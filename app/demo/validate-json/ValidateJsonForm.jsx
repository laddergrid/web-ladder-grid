'use client';

import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-purple to-brand-blue rounded-lg font-semibold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Validating...
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Validate
        </>
      )}
    </button>
  );
}

export default function ValidateJsonForm({
  action,
  inputJson,
  inputSchema,
  inputOperationId,
  errorMsg,
  validated,
  isValid,
  validationErrors,
  operations,
  EXAMPLE_JSON,
  EXAMPLE_SCHEMA
}) {
  return (
    <form action={action} method="POST">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Schema Input Panel */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="schema" className="block text-sm font-medium text-slate-300">
              OpenAPI Schema (JSON or YAML)
            </label>
            <a
              href={`/demo/validate-json?schema=${encodeURIComponent(EXAMPLE_SCHEMA)}&json=${encodeURIComponent(EXAMPLE_JSON)}`}
              className="text-sm text-brand-purple hover:text-brand-blue transition-colors"
            >
              Load Example
            </a>
          </div>
          <textarea
            id="schema"
            name="schema"
            defaultValue={inputSchema}
            placeholder="Paste your OpenAPI schema (JSON or YAML) here..."
            className="w-full h-48 px-4 py-3 bg-brand-dark border border-white/10 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all resize-none"
            spellCheck={false}
            required
          />
        </div>

        {/* JSON Input Panel */}
        <div className="space-y-2">
          <label htmlFor="json" className="block text-sm font-medium text-slate-300">
            JSON to Validate
          </label>
          <textarea
            id="json"
            name="json"
            defaultValue={inputJson}
            placeholder="Paste your JSON here..."
            className="w-full h-48 px-4 py-3 bg-brand-dark border border-white/10 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all resize-none"
            spellCheck={false}
            required
          />
        </div>
      </div>

      {/* Operation ID Selection */}
      <div className="mt-4 space-y-2">
        <label htmlFor="operationId" className="block text-sm font-medium text-slate-300">
          Operation ID
        </label>
        {operations.length > 0 ? (
          <select
            id="operationId"
            name="operationId"
            defaultValue={inputOperationId || operations[0]?.id}
            className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
            required
          >
            {operations.map((op) => (
              <option key={op.id} value={op.id}>
                {op.method} {op.path} - {op.id}{op.summary ? ` (${op.summary})` : ''}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            id="operationId"
            name="operationId"
            defaultValue={inputOperationId}
            placeholder="Enter operation ID (e.g., createProduct)"
            className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
            required
          />
        )}
        {operations.length === 0 && inputSchema.trim() && (
          <p className="text-xs text-yellow-500">
            Tip: Your OpenAPI spec needs paths with operationId fields. Enter the operation ID manually or update your schema.
          </p>
        )}
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Validation Result */}
      {validated && (
        <div className={`mt-4 p-4 rounded-lg border ${
          isValid
            ? 'bg-green-500/10 border-green-500/30'
            : 'bg-red-500/10 border-red-500/30'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {isValid ? (
              <>
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-semibold text-green-400">Valid JSON</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="font-semibold text-red-400">Validation Errors</span>
              </>
            )}
          </div>

          {validationErrors.length > 0 && (
            <ul className="space-y-2 mt-3">
              {validationErrors.map((err, index) => (
                <li key={index} className="text-sm text-red-300 flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>
                    <code className="text-brand-cyan">{err.field}</code>: {err.error}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="mt-6 flex gap-4">
        <SubmitButton />
        <a
          href="/demo/validate-json"
          className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg font-semibold text-slate-300 hover:bg-white/10 transition-colors"
        >
          Clear
        </a>
      </div>
    </form>
  );
}
