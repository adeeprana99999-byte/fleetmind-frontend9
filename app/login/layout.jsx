// app/login/layout.jsx
export default function LoginLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 p-4">
      {children}
    </div>
  );
}
