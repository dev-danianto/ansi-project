import { useLocation, Link } from "react-router-dom";

export default function EmailConfirmationPage() {
  const location = useLocation();
  const email = location.state?.email || "your email";

  return (
    <div className="mt-30 flex items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Check your email</h2>
          <p className="text-sm text-gray-600 mt-2">
            We've sent a confirmation email to <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-600 mt-4">
            Click the link in the email to verify your account and complete the
            registration process.
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mt-6">
          <p className="text-sm text-blue-800">
            If you don't see the email in your inbox, please check your spam
            folder.
          </p>
        </div>

        <div className="mt-8">
          <Link
            to="/login"
            className="text-blue-500 font-medium hover:underline"
          >
            Return to login
          </Link>
        </div>
      </div>
    </div>
  );
}
