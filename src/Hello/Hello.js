import React, { useEffect, useState } from 'react';


function Hello({ changeText = null, changeAfter = 5e3, children }) {
  const [text, setText] = useState(children || 'World');

  useEffect(() => {
    if (changeText) {
      const timer = setTimeout(() => {
        setText(changeText);
      }, changeAfter);

      return () => {
        clearTimeout(timer);
      }
    }
  });

  return (
    <div>
      {text}
    </div>
  )
}

export default Hello;
