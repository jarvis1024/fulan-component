import React, { ReactNode, useEffect, useState } from 'react';
import PropTypes from 'prop-types';


export interface HelloProps {
  changeAfter: number;
  changeText?: ReactNode;
  children?: ReactNode;
}

function Hello({ changeText, changeAfter, children }: HelloProps) {
  const [text, setText] = useState(children || 'World');

  useEffect(() => {
    const timer = setTimeout(() => {
      setText(changeText || text);
    }, changeAfter);

    return () => {
      clearTimeout(timer);
    };
  });

  return <div>{text}</div>;
}

Hello.propTypes = {
  changeAfter: PropTypes.number,
  changeText: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
};

Hello.defaultProps = {
  changeAfter: 5e3,
};

export default Hello;
