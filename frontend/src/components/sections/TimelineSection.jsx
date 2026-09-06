import React from 'react';
import { useDirector } from '../../context/DirectorContext';

export const TimelineSection = () => {
  const { content, updateField, dirOn } = useDirector();

  const chapters = [
    {
      year: 'Ch. I',
      left: false,
      titleKey: 'timeline_1_title',
      descKey: 'timeline_1_desc',
    },
    {
      year: 'Ch. II',
      left: true,
      titleKey: 'timeline_2_title',
      descKey: 'timeline_2_desc',
    },
    {
      year: 'Ch. III',
      left: false,
      titleKey: 'timeline_3_title',
      descKey: 'timeline_3_desc',
    },
    {
      year: 'Ch. IV',
      left: true,
      titleKey: 'timeline_4_title',
      descKey: 'timeline_4_desc',
    },
    {
      year: 'Ch. V',
      left: false,
      titleKey: 'timeline_5_title',
      descKey: 'timeline_5_desc',
    },
  ];

  return (
    <>
      <div className="scene-divider" aria-hidden="true" />
      <section className="timeline-section" aria-label="Friendship Timeline">
        <div className="sec-header rev in">
          <span className="sec-eyebrow">✦ &nbsp; Our Story &nbsp; ✦</span>
          <h2 className="sec-h2">
            A Friendship Timeline
            <span className="sec-h2-script">Every chapter, written in gold</span>
          </h2>
        </div>
        <div className="timeline-track">
          <div className="timeline-line" aria-hidden="true" />
          {chapters.map((ch, i) => (
            <div key={i} className={`tl-entry rev in ${ch.left ? 'left' : ''}`}>
              <div className="tl-dot" aria-hidden="true" />
              <div className="tl-card">
                <div className="tl-year" aria-hidden="true">{ch.year}</div>
                <div
                  className="tl-title"
                  data-edit
                  contentEditable={dirOn}
                  suppressContentEditableWarning
                  onBlur={(e) => updateField(ch.titleKey, e.currentTarget.textContent)}
                  tabIndex={dirOn ? 0 : -1}
                  role={dirOn ? 'textbox' : undefined}
                >
                  {content[ch.titleKey]}
                </div>
                <div
                  className="tl-desc"
                  data-edit
                  contentEditable={dirOn}
                  suppressContentEditableWarning
                  onBlur={(e) => updateField(ch.descKey, e.currentTarget.textContent)}
                  tabIndex={dirOn ? 0 : -1}
                  role={dirOn ? 'textbox' : undefined}
                >
                  {content[ch.descKey]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default TimelineSection;
