// import { useAuth } from "@getmocha/users-service/react";
import { useMutation } from "@tanstack/react-query";
import { Link, Navigate, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/react-app/lib/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoginBody, LoginResponseData } from "../types/auth";import { toast } from "react-toastify";
import { setUser } from "@/react-app/lib/features/auth/authSlice";
import TextInput from "../components/input/TextInput";
import { login } from "../api/auth";


import { useEffect, useState } from "react";
//styles
import { Music, Sparkles, Users } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [            , setHasLoggedIn] = useState(false);
  // Validation Schema
  const schema = z.object({
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  type LoginFormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    watch,
    // setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const email = watch("email");
  const password = watch("password");

  const formIsFilled = email && password;

  const mutation = useMutation({
    mutationFn: (payload: LoginBody) => {
      return login(payload);
    },
    onSuccess: (data: LoginResponseData) => {
      const token = data.tokens.access.token;
      const user = data.user;
      localStorage.setItem("tkn", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.removeItem("email");

      console.log("Login successful:", user);

      setHasLoggedIn(true);
      dispatch(setUser(user));
      toast.success("Logged in successfully");

      const userRole = user.role.toLowerCase();

      // Navigate based on role
      switch (userRole) {
        case "manager":
        case "admin":
        case "user":
          navigate("/admin");
          break;
        default:
          toast.error("Unauthorized access. Contact support.");
          break;
      }
    },
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = (data: LoginFormValues) => {
    const payload = {
      email: data.email,
      password: data.password,
    };

    mutation.mutate(payload);
    // return <Navigate to="/admin" replace />;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-md w-full mx-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Logo and title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-4 shadow-lg">
              {/* <Music className="w-8 h-8 text-white" /> */}
              {/* {logo} */}
              <img src="https://ik.imagekit.io/twoobakery/posts/Logo.png" alt="RichList Logo" className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">RichList Admin</h1>
            <p className="text-blue-100 text-sm">Manage your premium nightlife empire</p>
          </div>

          {/* Features list */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3 text-white">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-500/30 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-sm">Venue & Event Management</span>
            </div>
            <div className="flex items-center space-x-3 text-white">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500/30 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-sm">Real-time Booking Analytics</span>
            </div>
            <div className="flex items-center space-x-3 text-white">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-500/30 rounded-lg flex items-center justify-center">
                <Music className="w-4 h-4" />
              </div>
              <span className="text-sm">Revenue Tracking</span>
            </div>
          </div>

          {/* Login button */}
          {/* <button
            onClick={redirectToLogin}
            className="w-full bg-gradient-toa-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Continue with Google
          </button> */}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              type="email"
              label="Email address"
              placeholder="Enter email address"
              register={register("email")}
              errorMessage={errors.email?.message ?? ""}
              loading={mutation.isPending}
            />

            <TextInput
              type="password"
              label="Password"
              placeholder="Enter your password"
              isPassword={true}
              register={register("password")}
              errorMessage={errors.password?.message ?? ""}
              loading={mutation.isPending}
            />

            <div>
              <button
                type="submit"
                disabled={!formIsFilled || mutation.isPending}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span>{mutation.isPending ? "Loading..." : "Sign in"}</span>
              </button>
              {/* <button
                type="submit"
                disabled={!formIsFilled || mutation.isPending}
                className="flex items-center justify-center w-full rounded-md theme-bg-accent theme-text-on-accent px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <span>{mutation.isPending ? "Loading..." : "Sign in"}</span>
              </button> */}

              <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Link to="/auth/forgot-password" className="theme-text-primary text-xs">
                  Forgot password?
                </Link>

                {/* <p className="theme-text-primary text-xs">
                  Don't have an account?
                  <Link to="/auth/register" className="ml-1">
                    Register
                  </Link>
                </p> */}
              </div>
            </div>
          </form>

          <p className="text-center text-blue-100 text-xs mt-6">
            Secure admin access for authorized personnel only
          </p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
