import React from 'react';
import { useDirector } from '../../context/DirectorContext';

export const NowPlaying = ({ visible }) => {
  const { content, updateField, dirOn } = useDirector();

  return (
    <div id="now-playing" className={visible ? 'show' : ''} role="status">
      <div className="np-dot" aria-hidden="true" />
      <div className="np-text">
        <span className="np-label">Now Playing</span>
        <span
          className="np-title"
          data-edit
          contentEditable={dirOn}
          suppressContentEditableWarning
          onBlur={(e) => updateField('now_playing_title', e.currentTarget.textContent)}
          tabIndex={dirOn ? 0 : -1}
          role={dirOn ? 'textbox' : undefined}
          aria-label="Experience Title"
        >
          {content.now_playing_title}
        </span>
      </div>
    </div>
  );
};

export default NowPlaying;
