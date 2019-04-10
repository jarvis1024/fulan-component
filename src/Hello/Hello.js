import React, { useEffect, useState } from 'react';


function Hello({ changeText = null, changeAfter = 5e3, children }) {
  const [text, setText] = useState(children || 'World');

  if (changeText) {
    useEffect(() => {
      setTimeout(() => {
        setText(changeText);
      }, changeAfter);
    });
  }

  return (
    <div>
      {text}
    </div>
  )
}

export default Hello;
