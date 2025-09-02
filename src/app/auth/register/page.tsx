"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function Register() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: '',
    phone: '',
    password: '',
    form: ''
  });
  const [touched, setTouched] = useState({
    email: false,
    phone: false,
    password: false
  });
  const router = useRouter();

 // اعتبارسنجی ایمیل
 const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// اعتبارسنجی شماره تلفن
const validatePhone = (phone: string) => {
  if (!phone) return true; // اختیاری
  const re = /^09\d{9}$/;
  return re.test(phone);
};
 // اعتبارسنجی رمز عبور
 const passwordRequirements = {
  length: password.length >= 8,
  uppercase: /[A-Z]/.test(password),
  lowercase: /[a-z]/.test(password),
  number: /\d/.test(password),
  specialChar: /[@$!%*?&]/.test(password),
};
  // اعتبارسنجی کلی فرم
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const newErrors = {
      email: '',
      phone: '',
      password: '',
      form: ''
    };

    if (touched.email && !email) {
      newErrors.email = 'ایمیل الزامی است';
    } else if (touched.email && !validateEmail(email)) {
      newErrors.email = 'فرمت ایمیل نامعتبر است';
    }
    if (touched.phone && !phone ) {
      newErrors.phone = ' شماره تلفن الزامی است';
    } else if(touched.phone && !validatePhone(phone)){
      newErrors.phone = 'فرمت شماره تلفن نامعتبر است (مثال: 09123456789)';

    }

    if (touched.password && !Object.values(passwordRequirements).every(Boolean)) {
      newErrors.password = 'رمز عبور شرایط لازم را ندارد';
    }

    setErrors(newErrors);
  }, [email, phone, password, touched]);

  // بررسی تماس کاربر با فیلد
  const handleBlur = (field: 'email' | 'phone' | 'password') => {
    setTouched({ ...touched, [field]: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // اعتبارسنجی نهایی قبل از ارسال
    const finalValidation = {
      email: !email ? 'ایمیل الزامی است' : !validateEmail(email) ? 'فرمت ایمیل نامعتبر است' : '',
      phone: phone && !validatePhone(phone) ? 'فرمت شماره تلفن نامعتبر است' : '',
      password: !Object.values(passwordRequirements).every(Boolean) ? 'رمز عبور شرایط لازم را ندارد' : '',
      form: ''
    };

    setErrors(finalValidation);
    setTouched({
      email: true,
      phone: true,
      password: true
    });
    if (finalValidation.email || finalValidation.phone || finalValidation.password) {
      return;
    }
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, phone, password }),
      });

      if (response.ok) {
        router.push('/auth/login');
      } else {
        const data = await response.json();
        setErrors({...errors, form: data.message || 'ثبت‌نام ناموفق بود'});
      }
    } catch (err) {
      console.log(err)
      setErrors({...errors, form: 'خطایی در ثبت‌نام رخ داد'});
    }
  };
   
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">ثبت‌نام</h2>
        
        {errors.form && (
          <div className="p-3 bg-red-50 text-red-600 rounded-md text-center">
            {errors.form}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              ایمیل
            </label>
            <input
             id="email"
             name="email"
             type="email"
             required
             className={`mt-1 block w-full px-3 py-2 border ${
               errors.email ? 'border-red-500' : 'border-gray-300'
             } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             onBlur={() => handleBlur('email')}
           />
           {errors.email && (
             <p className="mt-1 text-sm text-red-600">{errors.email}</p>
           )}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              شماره تلفن 
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="09*********"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={() => handleBlur('phone')}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              رمز عبور
            </label>
            <input
             id="password"
             name="password"
             type="password"
             required
             className={`mt-1 block w-full px-3 py-2 border ${
               errors.password ? 'border-red-500' : 'border-gray-300'
             } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             onBlur={() => handleBlur('password')}
            />
            <div className="mt-2 text-xs">
              <p className="font-medium mb-1">الزامات رمز عبور:</p>
              <ul className="space-y-1">
                <li className={`flex items-center ${passwordRequirements.length ? 'text-green-500' : 'text-red-500'}`}>
                  <span className="ml-1">حداقل 8 کاراکتر</span>
                </li>
                <li className={`flex items-center ${passwordRequirements.uppercase ? 'text-green-500' : 'text-red-500'}`}>
                  <span className="ml-1">حداقل یک حرف بزرگ انگلیسی (A-Z)</span>
                </li>
                <li className={`flex items-center ${passwordRequirements.lowercase ? 'text-green-500' : 'text-red-500'}`}>
                  <span className="ml-1">حداقل یک حرف کوچک انگلیسی (a-z)</span>
                  </li>
                <li className={`flex items-center ${passwordRequirements.number ? 'text-green-500' : 'text-red-500'}`}>
                  <span className="ml-1">حداقل یک عدد (0-9)</span>
                </li>
                <li className={`flex items-center ${passwordRequirements.specialChar ? 'text-green-500' : 'text-red-500'}`}>
                  <span className="ml-1">حداقل یک کاراکتر ویژه (@ $ ! % * ? &)</span>
                </li>
              </ul>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              ثبت‌نام
            </button>
          </div>
        </form>
        
        <div className="text-center">
          <Link href="/auth/login" className="text-sm text-indigo-600 hover:text-indigo-500">
            قبلاً ثبت‌نام کرده‌اید؟ وارد شوید
          </Link>
        </div>
      </div>
    </div>
  );
}