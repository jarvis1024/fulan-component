import Hello from './Hello';
import React from 'react';
import { act } from 'react-dom/test-utils';
import ReactDOM from 'react-dom';
import { mount,  shallow } from 'enzyme';


jest.useFakeTimers();

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});


it('should render default text', () => {
  const wrapper = mount(<Hello />);

  expect(wrapper.text()).toBe('World');
});

it('should render text from children', () => {
  const wrapper = mount(<Hello>React</Hello>);

  expect(wrapper.text()).toBe('React');
})

// doc: https://reactjs.org/docs/test-utils.html#reference
// 测试组件更新状态更新需要使用  react-dom/test-utils 的 act.
it('should change text', () => {
  act(() => {
    ReactDOM.render(
      <Hello changeText="React" changeAfter={1e3} />,
      container
    )
  });

  expect(container.textContent).toBe('World');
  act(() => {
    // 触发组件更新的操作也放在 act 里面
    jest.advanceTimersByTime(1e3);
  });
  expect(container.textContent).toBe('React');
});


it('shouldn\'t update after unmount', () => {
  act(() => {
    ReactDOM.render(
      <Hello changeText="React" changeAfter={5e3} />,
      container
    );

    ReactDOM.unmountComponentAtNode(container);
  });

  console._error = console.error;
  console.error = jest.fn();
  act(() => {
    jest.advanceTimersByTime(5e3);
  });

  expect(console.error).not.toHaveBeenCalled();

  console.error = console._error;
});
