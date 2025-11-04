
import React, { useState, useCallback, useMemo } from 'react';
import { marked } from 'marked';
import { getContrarianView, ContrarianView } from './services/geminiService';
import { GroundingChunk } from './types';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import SourceLink from './components/SourceLink';
import SearchIcon from './components/icons/SearchIcon';

const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ContrarianView | null>(null);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!topic.trim() || isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await getContrarianView(topic);
      setResult(response);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [topic, isLoading]);

  const parsedMarkdown = useMemo(() => {
    if (!result?.text) return { __html: '' };
    return { __html: marked.parse(result.text) as string };
  }, [result?.text]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 font-sans flex flex-col items-center p-4">
      <div className="w-full max-w-3xl mx-auto my-8 md:my-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
            The Contrarian
          </h1>
          <p className="mt-2 text-lg text-slate-400">
            Explore every angle of the story.
          </p>
        </header>

        <main>
          <form onSubmit={handleSubmit} className="relative mb-8">
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic, e.g., 'The future of remote work' or 'The pros and cons of AI in art'"
              className="w-full h-28 p-4 pr-28 bg-slate-800 border-2 border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none focus:border-sky-500 transition-colors duration-200 resize-none text-slate-200"
              disabled={isLoading}
              aria-label="Topic input"
            />
            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="absolute top-4 right-4 h-20 w-20 flex flex-col items-center justify-center bg-sky-600 text-white rounded-md font-semibold hover:bg-sky-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:scale-100"
              aria-label="Analyze topic"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin" aria-label="Loading"></div>
              ) : (
                <>
                  <SearchIcon className="w-6 h-6 mb-1" />
                  <span className="text-xs">Analyze</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8">
            {isLoading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}
            {result && (
              <div className="space-y-8 animate-fade-in">
                <section className="p-6 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <h2 className="text-2xl font-semibold mb-4 text-sky-400">Analysis</h2>
                  <div
                    className="prose prose-invert max-w-none text-slate-300 leading-relaxed"
                    dangerouslySetInnerHTML={parsedMarkdown}
                  />
                </section>

                {result.sources && result.sources.length > 0 && (
                  <section className="p-6 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <h2 className="text-2xl font-semibold mb-4 text-sky-400">Further Reading</h2>
                    <div className="space-y-3">
                      {result.sources.map((source, index) => (
                        <SourceLink key={index} source={source} />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
