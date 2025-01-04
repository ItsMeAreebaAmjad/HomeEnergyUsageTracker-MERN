import React from "react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-700 text-gray-800 py-16 px-6 md:px-12">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-blue-700 mb-6">Terms of Service</h1>
        <p className="text-lg leading-relaxed mb-6">
          Welcome to Energy Tracker. By using our services, you agree to comply
          with and be bound by the following terms and conditions.
        </p>

        <h2 className="text-2xl font-semibold text-blue-600 mb-4">
          Acceptance of Terms
        </h2>
        <p className="mb-6">
          By accessing or using our services, you agree to these terms. If you
          do not agree, you may not use our services.
        </p>

        <h2 className="text-2xl font-semibold text-blue-600 mb-4">
          Modifications to Terms
        </h2>
        <p className="mb-6">
          We may revise these terms from time to time. If we do, we will provide
          notice by posting the updated terms on our website.
        </p>

        <h2 className="text-2xl font-semibold text-blue-600 mb-4">
          User Responsibilities
        </h2>
        <p className="mb-6">
          You are responsible for maintaining the confidentiality of your account
          and ensuring that all activities under your account comply with these
          terms.
        </p>

        <h2 className="text-2xl font-semibold text-blue-600 mb-4">
          Limitations of Liability
        </h2>
        <p className="mb-6">
          Energy Tracker is not liable for any damages resulting from your use of
          our services, including direct, indirect, incidental, or consequential
          damages.
        </p>

        <h2 className="text-2xl font-semibold text-blue-600 mb-4">
          Contact Information
        </h2>
        <p>
          If you have any questions about these terms, please contact us at{" "}
          <a
            href="mailto:support@energytracker.com"
            className="text-blue-500 hover:underline"
          >
            support@energytracker.com
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
