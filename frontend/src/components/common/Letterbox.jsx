import React from 'react';

export const Letterbox = ({ isIntro }) => {
  return (
    <>
      <div
        className="letterbox-top"
        id="lbt"
        style={{ height: isIntro ? '60px' : '0px' }}
      />
      <div
        className="letterbox-bot"
        id="lbb"
        style={{ height: isIntro ? '60px' : '0px' }}
      />
    </>
  );
};

export default Letterbox;
