import { useState } from 'react';

function BadHook({ flag }) {
  return <div>{flag ? 'Hook route active' : 'Hook route idle'}</div>;
}

export default function Page() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Bad Hook Example</h1>
      <BadHook flag={count % 2 === 0} />
      <button onClick={() => setCount(count + 1)}>Toggle Hook</button>
    </div>
  );
}
