import Footer from "@/app/component/web/footer";
export default function Terms() {
  return (
    <>
    <div className="max-w-4xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>

      <p>
        Users can post jobs for free. Providers accept jobs and agree to
        a 9% commission on completed work.
      </p>
            <p className="max-w-2xl mx-auto opacity-90">
              Customers can set their own price when posting a job, starting from ₹94.
              </p>
    </div>
    <Footer />
    </>
  );
}