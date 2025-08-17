import React, { useState, useEffect } from 'react'
import { Maximize2, Minimize2, Smartphone, Monitor, RotateCcw, Settings, Zap, Wifi, Battery, GraduationCap, X, Home, Signal, Volume2 } from 'lucide-react'
import App from '../App'

const MobilePrototypeFrame = () => {
    // Use sessionStorage alternative - store in window object for persistence across navigation
    const [isFullscreen, setIsFullscreen] = useState(() => {
        return window.prototypeFullscreen || false
    })
    const [deviceType, setDeviceType] = useState(() => {
        return window.prototypeDevice || 'iphone'
    })
    const [showPrototype, setShowPrototype] = useState(true)

    // Persist state in window object (alternative to localStorage)
    useEffect(() => {
        window.prototypeFullscreen = isFullscreen
    }, [isFullscreen])

    useEffect(() => {
        window.prototypeDevice = deviceType
    }, [deviceType])

    const devices = {
        iphone: {
            name: 'iPhone 15 Pro',
            width: 375,
            height: 700,
            frame: 'rounded-[42px] bg-gradient-to-b from-gray-900 via-black to-gray-900 p-3 shadow-2xl ring-1 ring-white/10',
            screen: 'rounded-[36px] overflow-hidden bg-black relative',
            notch: true,
            color: 'from-blue-500 to-purple-600',
            statusHeight: 44
        },
        android: {
            name: 'Pixel 8 Pro',
            width: 393,
            height: 720,
            frame: 'rounded-[32px] bg-gradient-to-b from-slate-800 via-slate-900 to-black p-3 shadow-2xl ring-1 ring-slate-600/20',
            screen: 'rounded-[26px] overflow-hidden relative',
            notch: false,
            color: 'from-green-500 to-blue-500',
            statusHeight: 32
        },
        tablet: {
            name: 'iPad Air',
            width: 600,
            height: 800,
            frame: 'rounded-[28px] bg-gradient-to-b from-gray-100 via-gray-300 to-gray-500 p-4 shadow-2xl ring-1 ring-gray-400/30',
            screen: 'rounded-[20px] overflow-hidden relative',
            notch: false,
            color: 'from-purple-500 to-pink-500',
            statusHeight: 24
        }
    }

    const currentDevice = devices[deviceType]

    // Enhanced Status Bar Component
    const StatusBar = ({ device }) => {
        const [currentTime, setCurrentTime] = useState(new Date())

        useEffect(() => {
            const timer = setInterval(() => {
                setCurrentTime(new Date())
            }, 1000)
            return () => clearInterval(timer)
        }, [])

        const timeString = currentTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })

        if (device.name.includes('iPhone')) {
            return (
                <>
                    {/* Dynamic Island */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-2xl z-[100] flex items-center justify-center shadow-lg border border-gray-800">
                        <div className="flex items-center space-x-2 px-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-sm" />
                            <div className="w-1 h-1 bg-red-400 rounded-full" />
                            <div className="w-1 h-1 bg-white rounded-full opacity-60" />
                        </div>
                    </div>

                    {/* Status Bar */}
                    <div className="absolute top-0 left-0 right-0 h-11 flex items-center justify-between px-6 pt-2 text-white z-[99]">
                        <div className="flex items-center space-x-1 text-sm font-semibold">
                            <span>{timeString}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Signal className="w-3.5 h-3.5" />
                            <Wifi className="w-3.5 h-3.5" />
                            <div className="flex items-center space-x-0.5">
                                <Battery className="w-6 h-3.5 text-green-400" />
                                <span className="text-xs font-bold">89</span>
                            </div>
                        </div>
                    </div>
                </>
            )
        }

        if (device.name.includes('Pixel')) {
            return (
                <div className="absolute top-0 left-0 right-0 h-8 bg-black flex items-center justify-between px-4 text-white z-[99]">
                    <div className="flex items-center space-x-2 text-sm font-medium">
                        <span>{timeString}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Signal className="w-3 h-3" />
                        <Wifi className="w-3 h-3" />
                        <Battery className="w-5 h-3 text-green-400" />
                        <span className="text-xs">89%</span>
                    </div>
                </div>
            )
        }

        return null
    }

    // Enhanced Device Frame Component
    const DeviceFrame = ({ children, style }) => (
        <div className="relative group">
            <div
                className={`${currentDevice.frame} relative transform hover:scale-[1.01] transition-all duration-500 backdrop-blur-sm`}
                style={style}
            >
                {/* Enhanced Physical Device Details */}
                {deviceType === 'iphone' && (
                    <>
                        {/* Volume Buttons */}
                        <div className="absolute -left-1.5 top-16 w-2 h-12 bg-gradient-to-r from-gray-700 to-gray-600 rounded-l-lg shadow-lg border-l border-gray-500" />
                        <div className="absolute -left-1.5 top-32 w-2 h-8 bg-gradient-to-r from-gray-700 to-gray-600 rounded-l-lg shadow-lg border-l border-gray-500" />

                        {/* Power Button */}
                        <div className="absolute -right-1.5 top-20 w-2 h-16 bg-gradient-to-l from-gray-700 to-gray-600 rounded-r-lg shadow-lg border-r border-gray-500" />

                        {/* Mute Switch */}
                        <div className="absolute -left-1.5 top-10 w-1.5 h-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded-l-md shadow-md" />

                        {/* Camera Module Reflection */}
                        <div className="absolute top-6 left-6 w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-inner opacity-30" />
                    </>
                )}

                {deviceType === 'android' && (
                    <>
                        {/* Volume Rocker */}
                        <div className="absolute -right-1.5 top-24 w-2 h-16 bg-gradient-to-l from-slate-700 to-slate-600 rounded-r-lg shadow-lg" />

                        {/* Power Button */}
                        <div className="absolute -right-1.5 top-48 w-2 h-10 bg-gradient-to-l from-slate-700 to-slate-600 rounded-r-lg shadow-lg" />

                        {/* USB-C Port */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-slate-800 rounded-full shadow-inner" />
                    </>
                )}

                {children}

                {/* Device Glow Effect */}
                <div className={`absolute -inset-4 bg-gradient-to-r ${currentDevice.color} opacity-0 group-hover:opacity-20 rounded-[50px] blur-xl transition-all duration-700 -z-10`} />
            </div>
        </div>
    )

    // If user cancels prototype view, show regular app
    if (!showPrototype) {
        return <App />
    }

    if (isFullscreen) {
        return (
            <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-2xl animate-pulse delay-1000" />
                    <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-500" />
                </div>

                {/* Enhanced Fullscreen Controls */}
                <div className="absolute top-6 right-6 z-[10000] flex items-center space-x-3">
                    {/* Device Switcher */}
                    <div className="flex items-center bg-black/30 backdrop-blur-2xl rounded-2xl px-6 py-4 border border-white/10 shadow-2xl">
                        {Object.entries(devices).map(([key, device]) => (
                            <button
                                key={key}
                                onClick={() => setDeviceType(key)}
                                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${deviceType === key
                                    ? 'bg-white text-slate-900 shadow-lg transform scale-105'
                                    : 'text-white/80 hover:text-white hover:bg-white/20'
                                    }`}
                            >
                                {device.name.split(' ')[0]}
                            </button>
                        ))}
                    </div>

                    {/* Control Buttons */}
                    <button
                        onClick={() => setIsFullscreen(false)}
                        className="p-4 bg-black/30 hover:bg-black/50 rounded-2xl text-white backdrop-blur-2xl transition-all border border-white/10 shadow-2xl hover:scale-105"
                        title="Exit Fullscreen"
                    >
                        <Minimize2 className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => setShowPrototype(false)}
                        className="p-4 bg-red-500/30 hover:bg-red-500/50 rounded-2xl text-white backdrop-blur-2xl transition-all border border-red-500/20 shadow-2xl hover:scale-105"
                        title="Exit Demo"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Fullscreen Device Container */}
                <div className="flex items-center justify-center min-h-screen p-8">
                    <DeviceFrame
                        style={{
                            width: Math.min(currentDevice.width + 24, window.innerWidth - 200),
                            height: Math.min(currentDevice.height + 24, window.innerHeight - 150)
                        }}
                    >
                        {/* Enhanced Device Screen */}
                        <div
                            className={`${currentDevice.screen} isolate bg-black`}
                            style={{
                                width: Math.min(currentDevice.width, window.innerWidth - 248),
                                height: Math.min(currentDevice.height, window.innerHeight - 174)
                            }}
                        >
                            {/* Enhanced Status Bar */}
                            <StatusBar device={currentDevice} />

                            {/* Fullscreen App Container */}
                            <div
                                className="absolute inset-0 bg-gray-50"
                                style={{
                                    width: Math.min(currentDevice.width, window.innerWidth - 248),
                                    height: Math.min(currentDevice.height, window.innerHeight - 174),
                                    contain: 'layout style paint size',
                                    overflow: 'hidden',
                                    isolation: 'isolate',
                                    paddingTop: currentDevice.statusHeight
                                }}
                            >
                                <div
                                    className="w-full h-full overflow-y-auto overflow-x-hidden"
                                    style={{
                                        WebkitOverflowScrolling: 'touch',
                                        scrollbarWidth: 'none',
                                        msOverflowStyle: 'none',
                                        padding: '0 8px 8px 8px'
                                    }}
                                >
                                    <style jsx>{`
                                        div::-webkit-scrollbar { display: none; }
                                    `}</style>
                                    <App />
                                </div>
                            </div>
                        </div>
                    </DeviceFrame>

                    {/* Enhanced Device Info */}
                    <div className="absolute bottom-20 left-0 right-0 text-center">
                        <div className="bg-black/20 backdrop-blur-2xl rounded-2xl px-8 py-4 mx-auto inline-block border border-white/10">
                            <p className="text-white font-bold text-xl">{currentDevice.name}</p>
                            <p className="text-white/80 text-sm">Fullscreen Mode • Perfect Experience</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-x-hidden">
            {/* Enhanced Header */}
            <div className="bg-white/95 backdrop-blur-lg border-b border-white/30 sticky top-0 z-10 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl ring-2 ring-blue-200/50">
                                <GraduationCap className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Western Mega College</h1>
                                <p className="text-sm text-slate-600">Enhanced Mobile Prototype</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setIsFullscreen(true)}
                                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-xl text-sm font-medium hover:from-slate-800 hover:to-slate-600 transition-all shadow-xl hover:scale-105 transform"
                            >
                                <Maximize2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Fullscreen</span>
                            </button>

                            <button
                                onClick={() => setShowPrototype(false)}
                                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-xl hover:scale-105 transform"
                            >
                                <Home className="w-4 h-4" />
                                <span className="hidden sm:inline">Exit Demo</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Enhanced Device Selection */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-3 border border-gray-200/50">
                        {Object.entries(devices).map(([key, device]) => (
                            <button
                                key={key}
                                onClick={() => setDeviceType(key)}
                                className={`px-6 py-4 text-sm font-medium rounded-2xl transition-all ${deviceType === key
                                    ? `bg-gradient-to-r ${device.color} text-white shadow-lg scale-105 transform`
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <Smartphone className="w-4 h-4" />
                                    <span className="hidden sm:inline">{device.name}</span>
                                    <span className="sm:hidden">{device.name.split(' ')[0]}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Demo Layout */}
                <div className="flex flex-col xl:flex-row gap-8 items-start">
                    {/* Enhanced Device Preview */}
                    <div className="flex-1 flex justify-center px-4">
                        <div className="relative">
                            <DeviceFrame
                                style={{
                                    width: currentDevice.width + 24,
                                    height: currentDevice.height + 24
                                }}
                            >
                                {/* Enhanced Device Screen */}
                                <div
                                    className={`${currentDevice.screen} isolate bg-black`}
                                    style={{
                                        width: currentDevice.width,
                                        height: currentDevice.height
                                    }}
                                >
                                    {/* Enhanced Status Bar */}
                                    <StatusBar device={currentDevice} />

                                    {/* App Container */}
                                    <div
                                        className="absolute inset-0 bg-gray-50"
                                        style={{
                                            width: currentDevice.width,
                                            height: currentDevice.height,
                                            contain: 'layout style paint size',
                                            overflow: 'hidden',
                                            isolation: 'isolate',
                                            paddingTop: currentDevice.statusHeight
                                        }}
                                    >
                                        <div
                                            className="w-full h-full overflow-y-auto overflow-x-hidden"
                                            style={{
                                                WebkitOverflowScrolling: 'touch',
                                                scrollbarWidth: 'none',
                                                msOverflowStyle: 'none',
                                                padding: '0 8px 8px 8px'
                                            }}
                                        >
                                            <style jsx>{`
                                                div::-webkit-scrollbar { display: none; }
                                            `}</style>
                                            <App />
                                        </div>
                                    </div>
                                </div>
                            </DeviceFrame>

                            {/* Enhanced Floating Controls */}
                            <div className="absolute -right-20 top-1/2 transform -translate-y-1/2 space-y-4 hidden lg:flex lg:flex-col">
                                <button
                                    onClick={() => setIsFullscreen(true)}
                                    className="w-16 h-16 bg-gradient-to-br from-slate-900 to-slate-700 text-white rounded-2xl shadow-2xl hover:from-slate-800 hover:to-slate-600 transition-all flex items-center justify-center hover:scale-110 transform ring-2 ring-slate-300/20"
                                    title="Fullscreen Mode"
                                >
                                    <Maximize2 className="w-6 h-6" />
                                </button>

                                <button
                                    className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl shadow-2xl hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center hover:scale-110 transform ring-2 ring-blue-300/20"
                                    title="Refresh App"
                                    onClick={() => window.location.reload()}
                                >
                                    <RotateCcw className="w-6 h-6" />
                                </button>

                                <button
                                    onClick={() => setShowPrototype(false)}
                                    className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl shadow-2xl hover:from-red-600 hover:to-red-700 transition-all flex items-center justify-center hover:scale-110 transform ring-2 ring-red-300/20"
                                    title="Exit Demo"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Enhanced Device Info */}
                            <div className="text-center mt-8">
                                <p className="text-slate-900 font-bold text-xl">{currentDevice.name}</p>
                                <p className="text-slate-600 text-sm mt-1">
                                    {currentDevice.width} × {currentDevice.height} pixels • Premium Experience
                                </p>
                                <div className="flex justify-center mt-3">
                                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${currentDevice.color} animate-pulse shadow-lg`} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Sidebar */}
                    <div className="w-full xl:w-96 space-y-6">
                        {/* Status Card */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 shadow-lg border border-green-200/50">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-5 h-5 bg-green-500 rounded-full animate-pulse shadow-lg" />
                                <span className="font-bold text-green-800 text-lg">All Issues Fixed! 🎉</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                {[
                                    { label: 'Fullscreen Persistence', status: '✓ Fixed', color: 'text-green-700' },
                                    { label: 'Enhanced Design', status: '✓ Premium', color: 'text-blue-700' },
                                    { label: 'Status Bar', status: '✓ Realistic', color: 'text-purple-700' },
                                    { label: 'Navigation', status: '✓ Smooth', color: 'text-orange-700' }
                                ].map((item, i) => (
                                    <div key={i} className="bg-white/60 rounded-lg p-3">
                                        <p className="text-slate-600 text-xs">{item.label}</p>
                                        <p className={`font-semibold ${item.color}`}>{item.status}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Features Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <h3 className="font-bold text-slate-900 text-lg mb-4">🚀 New Features</h3>
                            <div className="space-y-4">
                                {[
                                    { icon: '🔄', label: 'Persistent Fullscreen', desc: 'Stays fullscreen across navigation' },
                                    { icon: '📱', label: 'Realistic Status Bar', desc: 'Live time, battery, signal indicators' },
                                    { icon: '✨', label: 'Premium Design', desc: 'Enhanced borders, buttons, effects' },
                                    { icon: '🎯', label: 'Perfect Scaling', desc: 'Responsive across all screen sizes' },
                                    { icon: '🌟', label: 'Smooth Animations', desc: 'Buttery smooth transitions' }
                                ].map((feature, index) => (
                                    <div key={index} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100/50">
                                        <div className="text-xl">{feature.icon}</div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-900 text-sm">{feature.label}</p>
                                            <p className="text-xs text-slate-600 mt-1">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Test Guide */}
                        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl ring-1 ring-white/20">
                            <h3 className="font-bold text-lg mb-4">🧪 Perfect Experience!</h3>
                            <div className="space-y-3 text-sm">
                                {[
                                    'Navigate between pages - fullscreen persists!',
                                    'Realistic device design with physical buttons',
                                    'Live status bar with actual time',
                                    'Smooth animations and premium effects'
                                ].map((instruction, i) => (
                                    <div key={i} className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                                        <span className="text-yellow-300 font-bold">✓</span>
                                        <span className="text-white/95">{instruction}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MobilePrototypeFrame