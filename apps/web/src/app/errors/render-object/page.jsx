export default function Page() {
  const data = { name: 'test', value: 42 };
  return <div>{data.name}: {data.value}</div>;
}
