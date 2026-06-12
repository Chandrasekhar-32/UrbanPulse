export default function Page() {
  const obj = { key: 'safe undefined fallback' };
  return <p>{obj.key}</p>;
}
