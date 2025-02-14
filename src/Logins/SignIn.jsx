import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react'

const SignIn = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const token = localStorage.getItem('token');

      useEffect(() => {
        if (token) {
          navigate("/home");
        }
      }, [token, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsLoading(true)
        axios.post('http://localhost:3000/login', { email, password })
            .then(result => {
                if (result.status === 200) {
                    const { token, message, user } = result.data
                    if (message === "Login Successful") {
                        localStorage.setItem('token', token)
                        localStorage.setItem('userName', user.name)
                        localStorage.setItem('userEmail', user.email)
                        navigate("/home")
                    } else {
                        setErrorMessage(message)
                    }
                } else {
                    setErrorMessage("Unexpected response status.")
                }
            })
            .catch(error => {
                console.log("Login Error:", error)
                setErrorMessage("Login failed. Please check your credentials")
            })
            .finally(() => setIsLoading(false))
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
            {/* Left Panel - Image */}
            <div className="hidden lg:flex lg:w-1/2 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-sky-500/20 backdrop-blur-sm z-10" />
                <img
                    src="https://images.unsplash.com/photo-1517963628607-235ccdd5476c?q=80&w=2942&auto=format&fit=crop"
                    alt="Background"
                    className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-20" />
                <div className="absolute bottom-10 left-10 text-white z-30 max-w-lg">
                    <h2 className="text-5xl font-bold mb-4 leading-tight">Welcome Back to Better Health</h2>
                    <p className="text-lg opacity-90">
                        Continue your fitness journey with Eleweight's personalized tracking and insights.
                    </p>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                    <div className="space-y-1 text-center mb-6">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                            <img
                                src="https://pbs.twimg.com/media/Gbg0yNhaQAAGV47?format=png&name=small"
                                alt="Eleweight Logo"
                                className="w-12 h-12"
                            />
                        </div>
                        <h1 className="text-2xl font-bold">Sign In to Eleweight</h1>
                        <p className="text-gray-600">Enter your credentials to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            {/* Email Input */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {errorMessage && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                                <p>{errorMessage}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Logging in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </button>

                        {/* Register Link */}
                        <div className="text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-blue-600 hover:underline">
                                Register now
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignIn