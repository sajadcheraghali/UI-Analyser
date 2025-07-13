import { useState } from "react";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }
  
  return {
    props: {},
  };
};

export default function SubmitEvaluationPage() {
  const [formData, setFormData] = useState({
    url: "",
    feedback: "",
    usability: 5,
    design: 5,
    performance: 5,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/evaluations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setMessage("ارزیابی شما با موفقیت ثبت شد!");
        setFormData({
          url: "",
          feedback: "",
          usability: 5,
          design: 5,
          performance: 5,
        });
      } else {
        setMessage("خطا در ثبت ارزیابی");
      }
    } catch (error) {
      setMessage("خطا در ارتباط با سرور");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">ثبت ارزیابی جدید</h1>
      
      {message && (
        <div className={`mb-4 p-3 rounded ${message.includes("موفقیت") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="mb-4">
          <label className="block mb-2">آدرس وبسایت</label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">نظر شما</label>
          <textarea
            value={formData.feedback}
            onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">قابلیت استفاده: {formData.usability}</label>
          <input
            type="range"
            min="1"
            max="10"
            value={formData.usability}
            onChange={(e) => setFormData({ ...formData, usability: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">طراحی: {formData.design}</label>
          <input
            type="range"
            min="1"
            max="10"
            value={formData.design}
            onChange={(e) => setFormData({ ...formData, design: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">عملکرد: {formData.performance}</label>
          <input
            type="range"
            min="1"
            max="10"
            value={formData.performance}
            onChange={(e) => setFormData({ ...formData, performance: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isSubmitting ? "در حال ارسال..." : "ثبت ارزیابی"}
        </button>
      </form>
    </div>
  );
}