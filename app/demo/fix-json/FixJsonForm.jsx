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
          Fixing...
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Fix JSON
        </>
      )}
    </button>
  );
}

export default function FixJsonForm({ action, inputJson, error, success, fixedJson, EXAMPLE_JSON }) {
  return (
    <form action={action} method="POST">
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="json" className="block text-sm font-medium text-slate-300">
              Malformed JSON
            </label>
            <a
              href={`/demo/fix-json?json=${encodeURIComponent(EXAMPLE_JSON)}`}
              className="text-sm text-brand-purple hover:text-brand-blue transition-colors"
            >
              Load Example
            </a>
          </div>
          <textarea
            id="json"
            name="json"
            defaultValue={inputJson}
            placeholder="Paste your malformed JSON here..."
            className="w-full h-48 px-4 py-3 bg-brand-dark border border-white/10 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all resize-none"
            spellCheck={false}
            required
          />
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {success && fixedJson && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Fixed JSON
            </label>
            <div className="relative">
              <textarea
                value={fixedJson}
                readOnly
                className="w-full h-48 px-4 py-3 bg-green-500/5 border border-green-500/30 rounded-lg font-mono text-sm text-green-300 resize-none"
              />
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <SubmitButton />
          <a
            href="/demo/fix-json"
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg font-semibold text-slate-300 hover:bg-white/10 transition-colors"
          >
            Clear
          </a>
        </div>
      </div>
    </form>
  );
}
