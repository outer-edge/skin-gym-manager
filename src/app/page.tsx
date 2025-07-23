import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Skin Gym Pro
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Professional Membership Management System
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-4 bg-white text-purple-600 rounded-full font-semibold border-2 border-purple-600 hover:bg-purple-50 transition-all duration-200"
            >
              Admin Login
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold mb-2">Member Tracking</h3>
            <p className="text-gray-600">
              Comprehensive member profiles with visit history and purchase tracking
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Marketing Analytics</h3>
            <p className="text-gray-600">
              Track campaign ROI and member acquisition sources
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">Retention Alerts</h3>
            <p className="text-gray-600">
              AI-powered at-risk member identification and proactive outreach
            </p>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold mb-8 text-center">Key Features</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="text-green-500 text-xl">✅</div>
              <div>
                <h4 className="font-semibold">Multi-level Authentication</h4>
                <p className="text-gray-600">Admin, Staff, and View-only roles</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="text-green-500 text-xl">✅</div>
              <div>
                <h4 className="font-semibold">Risk Assessment Engine</h4>
                <p className="text-gray-600">7 factors analyzed for retention</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="text-green-500 text-xl">✅</div>
              <div>
                <h4 className="font-semibold">Campaign Attribution</h4>
                <p className="text-gray-600">Link members to marketing sources</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="text-green-500 text-xl">✅</div>
              <div>
                <h4 className="font-semibold">Real-time Dashboard</h4>
                <p className="text-gray-600">Live metrics and alerts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}