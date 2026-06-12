export default function Bug() {
  const obj = { key: 'safe null fallback' };
  return <p>{obj.key}</p>;
}
