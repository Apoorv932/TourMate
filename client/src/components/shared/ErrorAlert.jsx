export default function ErrorAlert({ messages = [] }) {
  if (!messages.length) {
    return null;
  }

  return (
    <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
      <p className="font-medium">Oops!!</p>
      <ul className="list-inside list-disc">
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    </div>
  );
}
