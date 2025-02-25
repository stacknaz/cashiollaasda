import React, { useState } from 'react';
import { simulatePostback } from '../services/testPostback';
import { AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import type { TestResult } from '../types/postback';

const TestPostback = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    try {
      setLoading(true);
      setError(null);
      const testResult = await simulatePostback();
      setResult(testResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-900/20 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Postback Test</h2>
        <button
          onClick={handleTest}
          disabled={loading}
          className="bg-yellow-400 hover:bg-yellow-500 text-blue-950 px-4 py-2 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Testing...
            </>
          ) : (
            'Run Test'
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-r-lg mb-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-red-500">Error</h4>
              <p className="text-white/80">{error}</p>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="bg-green-500/10 border-l-4 border-green-500 p-4 rounded-r-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-green-500">Test Completed</h4>
                <p className="text-white/80">Postback simulation successful</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-950/50 rounded-xl p-4">
            <h4 className="text-lg font-semibold text-white mb-2">Test Results</h4>
            <pre className="bg-blue-900/50 p-4 rounded-lg overflow-x-auto">
              <code className="text-white/80 text-sm">
                {JSON.stringify(result, null, 2)}
              </code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPostback;