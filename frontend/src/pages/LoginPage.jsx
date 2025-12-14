import React, {useState} from "react"
import {Link, useNavigate} from "react-router-dom"
// import { useDispatch } from "react-redux";
import Button from "../components/Button";
import Logo from "../components/Logo";
import Input from "../components/Input";
import { useForm } from "react-hook-form";


function Login() {
    const navigate = useNavigate()
    // const dispatch = useDispatch()

    const {register, handleSubmit} = useForm()
    const [error, setError] = useState("")
    const [role, setRole] = useState("student") // 'student' or 'teacher'

    const login = async () =>{
        setError("")
        navigate("/assessment")
    }

  return (
    <div className="flex items-center justify-center min-h-screen w-full p-4">
        <div className="flex w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Left Side - Image */}
            <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white w-full">
                    <div className="max-w-sm text-center">
                        <h1 className="text-4xl font-bold mb-4">Welcome!</h1>
                        <p className="text-lg text-white/90">
                            Access your account and continue your learning journey
                        </p>
                    </div>
                </div>
                {/* Decorative shapes */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48"></div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
                <div className="w-full max-w-md">
                    <div className="mb-6 flex justify-center">
                        <span className="inline-block w-full max-w-[120px]">
                            <Logo width="100%"/>
                        </span>
                    </div>
                    
                    <div className="flex flex-col items-center">
                        <div className="mb-4 w-full flex justify-center">
                            <div className="inline-flex bg-gray-200 rounded-full p-1 shadow-sm">
                                <button
                                    type="button"
                                    onClick={() => setRole('student')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${role === 'student' ? 'bg-white text-indigo-600 shadow' : 'text-gray-600'}`}
                                >
                                    Student
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('teacher')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${role === 'teacher' ? 'bg-white text-indigo-600 shadow' : 'text-gray-600'}`}
                                >
                                    Teacher
                                </button>
                            </div>
                        </div>

                        <h2 className="text-center text-2xl md:text-3xl font-bold leading-tight text-gray-900 mb-2">
                            Sign in as {role === 'student' ? 'Student' : 'Teacher'}
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-500 mb-6 max-w-[380px]">
                            Use your {role === 'student' ? 'student' : 'teacher'} credentials to access the dashboard.
                        </p>

                        <p className="mt-2 text-center text-base text-gray-600 mb-6">
                            Don&apos;t have any account?&nbsp;
                            <Link
                                to="/signup"
                                className="font-medium text-primary transition-all duration-200 hover:underline"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </div>

                    {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                    <form onSubmit={handleSubmit(login)} className="mt-8">
                        <div className="space-y-5">
                            <Input
                                label="Email :"
                                placeholder="Enter your email"
                                type="email"
                                {...register("email", {
                                    required: true, 
                                    validate:{
                                        matchPattern: (value) => /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(value) || "Email Address must be valid"
                                    }
                                })}  
                            />

                            <Input
                                label="Password :"
                                placeholder="Enter your password"
                                type="password"
                                {...register("password", {
                                    required: true
                                })}
                            />

                            <Button
                                type="submit"
                                className="w-full"
                            >
                                Sign in
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
};

export default Login;
