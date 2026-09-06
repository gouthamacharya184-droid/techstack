import React from 'react';

export const AchievementToast = ({ achievements = [] }) => {
  if (!achievements.length) return null;

  return (
    <div id="ach-wrap" role="region" aria-label="Achievements Notifications" aria-live="polite">
      {achievements.map((ach) => (
        <div key={ach.id} className="ach-badge" role="status">
          <span className="ach-icon" aria-hidden="true">{ach.icon}</span>
          <div>
            <div className="ach-t">Achievement Unlocked</div>
            <div className="ach-d">
              {ach.title} — {ach.desc}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AchievementToast;
