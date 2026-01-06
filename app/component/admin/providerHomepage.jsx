import Link from "next/link";

export default function ProviderDashboardHome() {
  return (
    <main className="min-h-screen bg-gray-100">

      {/* HEADER */}
      {/* <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-600">
            Provider Dashboard
          </h1>
          <button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full text-sm font-semibold transition">
            Logout
          </button>
        </div>
      </header> */}

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-6 py-10">

        {/* WELCOME */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-2">
            Welcome 👋
          </h2>
          <p className="text-gray-600">
            Find work, complete tasks, and earn money with confidence.
          </p>
        </div>

        {/* STATS */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">Total Earnings</p>
            <h3 className="text-3xl font-bold mt-2 text-green-600">
              ₹24,500
            </h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">Available Jobs</p>
            <h3 className="text-3xl font-bold mt-2 text-blue-600">18</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">Active Jobs</p>
            <h3 className="text-3xl font-bold mt-2 text-yellow-500">3</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">Completed Jobs</p>
            <h3 className="text-3xl font-bold mt-2 text-green-600">15</h3>
          </div>
        </div>

        {/* AVAILABLE JOBS */}
        <div className="bg-white rounded-2xl shadow mb-12">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="text-xl font-semibold">
              Available Jobs
            </h3>
          <Link href={'/admin/work-list-filter'} > <button className="text-blue-600 hover:underline text-sm font-medium">
              View All
            </button> </Link> 
          </div>

          <div className="divide-y">
            {[
              { title: "Mobile App UI Design", budget: "₹5,000" },
              { title: "Backend API Development", budget: "₹8,000" },
              { title: "SEO Optimization", budget: "₹3,500" },
            ].map((job, index) => (
              <div
                key={index}
                className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div>
                  <h4 className="font-semibold">{job.title}</h4>
                  <p className="text-sm text-gray-500">
                    Posted 1 day ago
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-green-600 font-bold">
                    {job.budget}
                  </span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition">
                    Accept Job
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIVE JOBS */}
        <div className="bg-white rounded-2xl shadow mb-12">
          <div className="p-6 border-b">
            <h3 className="text-xl font-semibold">
              Active Jobs
            </h3>
          </div>

          <div className="divide-y">
            {[
              { title: "Landing Page Design", progress: "60%" },
              { title: "WordPress Fixes", progress: "30%" },
            ].map((job, index) => (
              <div
                key={index}
                className="p-6 flex justify-between items-center"
              >
                <div>
                  <h4 className="font-semibold">{job.title}</h4>
                  <p className="text-sm text-gray-500">
                    In progress
                  </p>
                </div>

                <span className="text-yellow-600 font-medium">
                  {job.progress}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* COMPLETED JOBS */}
        <div className="bg-white rounded-2xl shadow">
          <div className="p-6 border-b">
            <h3 className="text-xl font-semibold">
              Completed Jobs
            </h3>
          </div>

          <div className="divide-y">
            {[
              { title: "Logo Design", earning: "₹2,000" },
              { title: "Content Writing", earning: "₹1,500" },
            ].map((job, index) => (
              <div
                key={index}
                className="p-6 flex justify-between items-center"
              >
                <div>
                  <h4 className="font-semibold">{job.title}</h4>
                  <p className="text-sm text-gray-500">
                    Payment released
                  </p>
                </div>

                <span className="text-green-600 font-bold">
                  {job.earning}
                </span>
              </div>
            ))}
          </div>
        </div>

      </section>
    </main>
  );
}
