'use client'

import { useState, useRef, useEffect } from 'react'
import yaml from 'js-yaml'
import Button from '../ui/Button'

const EXAMPLE_JSON = `{
  "id": 123,
  "name": "Widget Pro",
  "price": "29.99",
  "inStock": "yes",
  "category": "electronics"
}`

const EXAMPLE_SCHEMA = `{
  "openapi": "3.0.0",
  "info": {
    "title": "Product API",
    "version": "1.0.0"
  },
  "paths": {
    "/products": {
      "post": {
        "operationId": "createProduct",
        "summary": "Create a new product",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/Product"
              }
            }
          }
        }
      },
      "get": {
        "operationId": "listProducts",
        "summary": "List all products"
      }
    },
    "/products/{id}": {
      "get": {
        "operationId": "getProduct",
        "summary": "Get a product by ID"
      },
      "put": {
        "operationId": "updateProduct",
        "summary": "Update a product"
      }
    }
  },
  "components": {
    "schemas": {
      "Product": {
        "type": "object",
        "required": ["id", "name", "price"],
        "properties": {
          "id": {
            "type": "integer"
          },
          "name": {
            "type": "string",
            "minLength": 1
          },
          "price": {
            "type": "number"
          },
          "inStock": {
            "type": "boolean"
          },
          "category": {
            "type": "string",
            "enum": ["electronics", "clothing", "food"]
          }
        }
      }
    }
  }
}`

// Parse schema text as JSON or YAML
function parseSchema(schemaText) {
  const trimmed = schemaText.trim()

  // Try JSON first
  if (trimmed.startsWith('{')) {
    try {
      return JSON.parse(trimmed)
    } catch {
      // Fall through to YAML
    }
  }

  // Try YAML
  try {
    return yaml.load(trimmed)
  } catch {
    return null
  }
}

// Extract operationIds from OpenAPI spec (supports JSON and YAML)
function extractOperationIds(schemaText) {
  try {
    const schema = parseSchema(schemaText)
    if (!schema) return []

    const operations = []

    if (schema.paths) {
      for (const [path, methods] of Object.entries(schema.paths)) {
        for (const [method, operation] of Object.entries(methods)) {
          if (operation && typeof operation === 'object' && operation.operationId) {
            operations.push({
              id: operation.operationId,
              method: method.toUpperCase(),
              path: path,
              summary: operation.summary || ''
            })
          }
        }
      }
    }

    return operations
  } catch {
    return []
  }
}

export default function JsonValidatorDemo({ onValidate }) {
  const [jsonInput, setJsonInput] = useState(EXAMPLE_JSON)
  const [schemaInput, setSchemaInput] = useState(EXAMPLE_SCHEMA)
  const [operationId, setOperationId] = useState('')
  const [operations, setOperations] = useState([])
  const [validationResult, setValidationResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  // Parse operations when schema changes
  useEffect(() => {
    const ops = extractOperationIds(schemaInput)
    setOperations(ops)

    // Auto-select first operation if available and none selected
    if (ops.length > 0 && !operationId) {
      setOperationId(ops[0].id)
    }

    // Clear selection if current operationId is not in new operations
    if (operationId && ops.length > 0 && !ops.find(op => op.id === operationId)) {
      setOperationId(ops[0].id)
    }

    // Clear if no operations available
    if (ops.length === 0) {
      setOperationId('')
    }
  }, [schemaInput])

  const handleValidate = async () => {
    if (!schemaInput.trim()) {
      setError('Please provide an OpenAPI schema')
      return
    }

    if (!operationId) {
      setError('Please select an operation')
      return
    }

    if (!jsonInput.trim()) {
      setError('Please enter JSON to validate')
      return
    }

    setIsLoading(true)
    setError('')
    setValidationResult(null)

    try {
      const result = await onValidate(jsonInput, schemaInput, operationId)
      setValidationResult(result)
    } catch (err) {
      setError(err.message || 'Validation failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setSchemaInput(event.target?.result || '')
    }
    reader.onerror = () => {
      setError('Failed to read file')
    }
    reader.readAsText(file)
  }

  const handleClear = () => {
    setJsonInput('')
    setSchemaInput('')
    setOperationId('')
    setOperations([])
    setValidationResult(null)
    setError('')
  }

  const handleLoadExample = () => {
    setJsonInput(EXAMPLE_JSON)
    setSchemaInput(EXAMPLE_SCHEMA)
    setValidationResult(null)
    setError('')
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Schema Validator</h3>
        <div className="flex gap-2">
          <button
            onClick={handleLoadExample}
            className="text-sm text-brand-purple hover:text-brand-blue transition-colors"
          >
            Load Example
          </button>
          <button
            onClick={handleClear}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <p className="text-slate-400 text-sm mb-6">
        Validate JSON against an OpenAPI schema and see detailed validation errors.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Schema Input Panel - Now on the left */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-300">
              OpenAPI Schema
            </label>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-brand-cyan hover:text-brand-blue transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload File
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.yaml,.yml"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          <textarea
            value={schemaInput}
            onChange={(e) => setSchemaInput(e.target.value)}
            placeholder="Paste your OpenAPI schema (JSON or YAML) here or upload a file..."
            className="w-full h-48 px-4 py-3 bg-brand-dark border border-white/10 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all resize-none"
            spellCheck={false}
          />
        </div>

        {/* JSON Input Panel - Now on the right */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            JSON to Validate
          </label>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className="w-full h-48 px-4 py-3 bg-brand-dark border border-white/10 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all resize-none"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Operation ID Dropdown */}
      <div className="mt-4 space-y-2">
        <label className="block text-sm font-medium text-slate-300">
          Operation ID
        </label>
        <select
          value={operationId}
          onChange={(e) => setOperationId(e.target.value)}
          disabled={operations.length === 0}
          className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {operations.length === 0 ? (
            <option value="">No operations found in schema</option>
          ) : (
            operations.map((op) => (
              <option key={op.id} value={op.id}>
                {op.method} {op.path} - {op.id}{op.summary ? ` (${op.summary})` : ''}
              </option>
            ))
          )}
        </select>
        {operations.length === 0 && schemaInput.trim() && (
          <p className="text-xs text-yellow-500">
            Tip: Your OpenAPI spec needs paths with operationId fields to validate against.
          </p>
        )}
      </div>

      {/* Validation Result */}
      {validationResult && (
        <div className={`mt-4 p-4 rounded-lg border ${
          validationResult.valid
            ? 'bg-green-500/10 border-green-500/30'
            : 'bg-red-500/10 border-red-500/30'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {validationResult.valid ? (
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

          {validationResult.errors && validationResult.errors.length > 0 && (
            <ul className="space-y-2 mt-3">
              {validationResult.errors.map((err, index) => (
                <li key={index} className="text-sm text-red-300 flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>
                    <code className="text-brand-cyan">{err.path}</code>: {err.message}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <Button onClick={handleValidate} disabled={isLoading || operations.length === 0}>
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Validating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Validate
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
