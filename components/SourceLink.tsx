
import React from 'react';
import { GroundingChunk } from '../types';
import LinkIcon from './icons/LinkIcon';

interface SourceLinkProps {
  source: GroundingChunk;
}

const SourceLink: React.FC<SourceLinkProps> = ({ source }) => {
  if (!source.web || !source.web.uri) {
    return null;
  }

  return (
    <a
      href={source.web.uri}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start p-3 -mx-3 space-x-3 transition-colors duration-200 bg-slate-800/50 hover:bg-slate-800 rounded-lg group"
    >
      <div className="flex-shrink-0 mt-1">
        <LinkIcon className="w-5 h-5 text-slate-500 group-hover:text-sky-400" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-sky-400 group-hover:underline">
          {source.web.title || 'Untitled Source'}
        </p>
        <p className="text-xs text-slate-500 truncate">{source.web.uri}</p>
      </div>
    </a>
  );
};

export default SourceLink;
