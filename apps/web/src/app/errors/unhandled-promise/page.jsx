import { useEffect } from 'react';

export default function Fetcher() {
  useEffect(() => {
    fetch('/unknown').catch(() => undefined);
  }, []);
  return <div>unhandled promise</div>;
}
