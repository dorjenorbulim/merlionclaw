export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="text-6xl mb-6">🪷</div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Subhuti AI Coach
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Buddhist-informed AI coaching with persistent memory,<br />
          daily accountability, and mindfulness-based burnout recovery
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="/checkin"
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition"
          >
            Start Daily Check-in
          </a>
          <a
            href="/about"
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          What Makes Subhuti Different
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold mb-2">Persistent Memory</h3>
            <p className="text-gray-600">
              Your AI coach remembers past conversations, tracks your commitments, 
              and notices patterns across weeks and months.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-4xl mb-4">🪷</div>
            <h3 className="text-xl font-semibold mb-2">Buddhist Wisdom</h3>
            <p className="text-gray-600">
              Grounded in the Three Pillars: Wisdom, Compassion, and Skillful Means. 
              Non-attachment with deep engagement.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Burnout Recovery</h3>
            <p className="text-gray-600">
              WHO ICD-11 aligned assessments, daily mindfulness practices, 
              and accountability for sustainable change.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50 rounded-lg px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">1</div>
            <h3 className="text-lg font-semibold mb-2">Daily Check-in</h3>
            <p className="text-gray-600 text-sm">
              2-3 minute mindfulness check-in with your AI coach
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">2</div>
            <h3 className="text-lg font-semibold mb-2">AI Coaching</h3>
            <p className="text-gray-600 text-sm">
              Buddhist-informed coaching with persistent memory
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">3</div>
            <h3 className="text-lg font-semibold mb-2">Daily Nudges</h3>
            <p className="text-gray-600 text-sm">
              Mindfulness micro-practices throughout your day
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">4</div>
            <h3 className="text-lg font-semibold mb-2">Weekly Reports</h3>
            <p className="text-gray-600 text-sm">
              Track progress on burnout recovery and mindfulness
            </p>
          </div>
        </div>
      </section>

      {/* For SMEs */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          For Forward-Thinking Companies
        </h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Burnout costs $1T/year in productivity loss. Subhuti AI Coach helps your team 
          build resilience, reduce stress, and thrive.
        </p>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6">
            <div className="text-3xl font-bold text-indigo-600 mb-2">$400</div>
            <div className="text-gray-600">per participant/year</div>
          </div>
          <div className="text-center p-6">
            <div className="text-3xl font-bold text-indigo-600 mb-2">20%</div>
            <div className="text-gray-600">avg. burnout reduction</div>
          </div>
          <div className="text-center p-6">
            <div className="text-3xl font-bold text-indigo-600 mb-2">8-12</div>
            <div className="text-gray-600">week pilot program</div>
          </div>
        </div>
        <div className="text-center mt-8">
          <a
            href="/contact"
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition"
          >
            Request Pilot Program
          </a>
        </div>
      </section>

      {/* Testimonial Placeholder */}
      <section className="py-16 bg-indigo-50 rounded-lg px-8 text-center">
        <blockquote className="text-xl text-gray-700 italic mb-4">
          "Subhuti AI Coach helped me recognize my burnout patterns and develop 
          sustainable mindfulness practices. The persistent memory makes it feel 
          like talking to a coach who truly knows me."
        </blockquote>
        <cite className="text-gray-600 not-italic">
          — Early Beta Tester, Tech Company Founder
        </cite>
      </section>
    </div>
  );
}
