import React, { ReactNode, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export interface HelloProps {
  changeAfter: number;
  changeText?: ReactNode;
  children?: ReactNode;
}

function Hello({ changeText, changeAfter, children }: HelloProps) {
  const [text, setText] = useState(children);

  useEffect(() => {
    const timer = setTimeout(() => {
      setText(changeText);
    }, changeAfter);

    return () => {
      clearTimeout(timer);
    };
  });

  return <div>{text}</div>;
}

Hello.propTypes = {
  changeAfter: PropTypes.number,
  changeText: PropTypes.node,
  children: PropTypes.node,
};

Hello.defaultProps = {
  changeAfter: 5e3,
  changeText: 'World',
  children: 'Hello',
};

export default Hello;
