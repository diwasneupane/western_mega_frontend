import React, { useState, useEffect } from 'react'
import { Maximize2, Minimize2, Smartphone, RotateCcw, X, Home, Signal, Wifi, Battery, GraduationCap, Tablet } from 'lucide-react'
import App from '../App'

const MobilePrototypeFrame = () => {
    const [isFullscreen, setIsFullscreen] = useState(() => {
        return window.prototypeFullscreen || false
    })
    const [deviceType, setDeviceType] = useState(() => {
        return window.prototypeDevice || 'iphone'
    })
    const [showPrototype, setShowPrototype] = useState(true)

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
            frame: 'rounded-[42px] bg-gradient-to-b from-slate-200 via-white to-slate-100 p-3 shadow-2xl border-2 border-slate-300',
            screen: 'rounded-[36px] overflow-hidden bg-gradient-to-b from-blue-50 to-white relative border border-slate-200',
            notch: true,
            color: 'from-blue-500 to-purple-600',
            statusHeight: 44,
            icon: Smartphone
        },
        android: {
            name: 'Pixel 8 Pro',
            width: 393,
            height: 720,
            frame: 'rounded-[32px] bg-gradient-to-b from-slate-800 via-slate-900 to-black p-3 shadow-2xl border border-slate-600',
            screen: 'rounded-[26px] overflow-hidden relative bg-gradient-to-b from-slate-100 to-white border border-slate-300',
            notch: false,
            color: 'from-green-500 to-emerald-600',
            statusHeight: 32,
            icon: Smartphone
        },
        tablet: {
            name: 'iPad Air',
            width: 600,
            height: 800,
            frame: 'rounded-[32px] bg-gradient-to-b from-slate-50 via-white to-blue-50 p-4 shadow-2xl border-2 border-blue-200',
            screen: 'rounded-[24px] overflow-hidden relative bg-gradient-to-b from-blue-50 via-white to-slate-50 border border-blue-100',
            notch: false,
            color: 'from-blue-500 to-cyan-500',
            statusHeight: 28,
            icon: Tablet
        }
    }

    const currentDevice = devices[deviceType]

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
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-2xl z-[100] flex items-center justify-center shadow-lg">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    </div>

                    {/* Status Bar with black text on white background */}
                    <div className="absolute top-0 left-0 right-0 h-11 flex items-center justify-between px-6 pt-2 text-black z-[99] bg-white/90 backdrop-blur-sm">
                        <div className="text-sm font-bold">
                            {timeString}
                        </div>
                        <div className="flex items-center space-x-1">
                            <Signal className="w-3.5 h-3.5 text-black" />
                            <Wifi className="w-3.5 h-3.5 text-black" />
                            <Battery className="w-6 h-3.5 text-green-600" />
                            <span className="text-xs font-bold text-black">89%</span>
                        </div>
                    </div>
                </>
            )
        }

        if (device.name.includes('Pixel')) {
            return (
                <div className="absolute top-0 left-0 right-0 h-8 bg-white/95 backdrop-blur-sm flex items-center justify-between px-4 text-black z-[99] border-b border-slate-200">
                    <div className="text-sm font-bold">
                        {timeString}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Signal className="w-3 h-3 text-black" />
                        <Wifi className="w-3 h-3 text-black" />
                        <Battery className="w-5 h-3 text-green-600" />
                        <span className="text-xs font-bold text-black">89%</span>
                    </div>
                </div>
            )
        }

        if (device.name.includes('iPad')) {
            return (
                <div className="absolute top-0 left-0 right-0 h-7 bg-white/95 backdrop-blur-sm flex items-center justify-between px-6 text-black z-[99] border-b border-blue-100">
                    <div className="text-sm font-bold">
                        {timeString}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Signal className="w-3.5 h-3.5 text-black" />
                        <Wifi className="w-3.5 h-3.5 text-black" />
                        <Battery className="w-6 h-3.5 text-green-600" />
                        <span className="text-xs font-bold text-black">89%</span>
                    </div>
                </div>
            )
        }

        return null
    }

    const DeviceFrame = ({ children, style }) => (
        <div className="relative group">
            <div
                className={`${currentDevice.frame} relative transform hover:scale-[1.02] transition-all duration-700 backdrop-blur-sm`}
                style={style}
            >
                {/* iPhone Physical Details */}
                {deviceType === 'iphone' && (
                    <>
                        <div className="absolute -left-1.5 top-16 w-2 h-12 bg-gradient-to-r from-slate-400 to-slate-300 rounded-l-lg shadow-lg" />
                        <div className="absolute -left-1.5 top-32 w-2 h-8 bg-gradient-to-r from-slate-400 to-slate-300 rounded-l-lg shadow-lg" />
                        <div className="absolute -right-1.5 top-20 w-2 h-16 bg-gradient-to-l from-slate-400 to-slate-300 rounded-r-lg shadow-lg" />
                        <div className="absolute -left-1.5 top-10 w-1.5 h-4 bg-gradient-to-r from-slate-500 to-slate-400 rounded-l-md shadow-md" />
                    </>
                )}

                {deviceType === 'android' && (
                    <>
                        <div className="absolute -right-1.5 top-24 w-2 h-16 bg-gradient-to-l from-slate-700 to-slate-600 rounded-r-lg shadow-lg" />
                        <div className="absolute -right-1.5 top-48 w-2 h-10 bg-gradient-to-l from-slate-700 to-slate-600 rounded-r-lg shadow-lg" />
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-slate-800 rounded-full shadow-inner" />
                    </>
                )}

                {deviceType === 'tablet' && (
                    <>
                        <div className="absolute -right-2 top-32 w-2.5 h-20 bg-gradient-to-l from-slate-300 to-slate-200 rounded-r-lg shadow-lg" />
                        <div className="absolute -right-2 top-60 w-2.5 h-12 bg-gradient-to-l from-slate-300 to-slate-200 rounded-r-lg shadow-lg" />
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-slate-300 rounded-full shadow-inner" />
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-slate-200 rounded-full shadow-inner" />
                    </>
                )}

                {children}

                {/* Enhanced glow effect */}
                <div className={`absolute -inset-6 bg-gradient-to-r ${currentDevice.color} opacity-0 group-hover:opacity-30 rounded-[60px] blur-2xl transition-all duration-1000 -z-10`} />
            </div>
        </div>
    )

    if (!showPrototype) {
        return <App />
    }

    if (isFullscreen) {
        const maxDeviceHeight = Math.min(currentDevice.height + 32, window.innerHeight * 0.95)
        const maxDeviceWidth = currentDevice.width + 32

        return (
            <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-gradient-to-br from-cyan-200 to-blue-200 rounded-full blur-2xl animate-pulse delay-1000" />
                    <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full blur-3xl animate-pulse delay-500" />
                </div>

                {/* Top Controls Bar */}
                <div className="absolute top-6 left-6 right-6 z-[10000] flex items-center justify-between">
                    {/* Device Info */}
                    <div className="bg-white/80 backdrop-blur-2xl rounded-2xl px-6 py-3 border border-white/50 shadow-xl">
                        <p className="font-bold text-slate-800">{currentDevice.name}</p>
                        <p className="text-sm text-slate-600">{currentDevice.width} × {currentDevice.height}</p>
                    </div>

                    {/* Center Controls */}
                    <div className="flex items-center bg-white/80 backdrop-blur-2xl rounded-2xl px-2 py-2 border border-white/50 shadow-xl space-x-2">
                        {Object.entries(devices).map(([key, device]) => {
                            const IconComponent = device.icon
                            return (
                                <button
                                    key={key}
                                    onClick={() => setDeviceType(key)}
                                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-all flex items-center space-x-2 ${deviceType === key
                                        ? `bg-gradient-to-r ${device.color} text-white shadow-lg transform scale-105`
                                        : 'text-slate-700 hover:bg-slate-100 hover:scale-105'
                                        }`}
                                >
                                    <IconComponent className="w-4 h-4" />
                                    <span className="hidden md:inline">{device.name.split(' ')[0]}</span>
                                </button>
                            )
                        })}
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setIsFullscreen(false)}
                            className="p-3 bg-white/80 hover:bg-white/90 rounded-2xl text-slate-700 backdrop-blur-2xl transition-all border border-white/50 shadow-xl hover:scale-110"
                            title="Exit Fullscreen"
                        >
                            <Minimize2 className="w-5 h-5" />
                        </button>

                        <button
                            onClick={() => setShowPrototype(false)}
                            className="p-3 bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 rounded-2xl text-white backdrop-blur-2xl transition-all shadow-xl hover:scale-110"
                            title="Exit Demo"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Device Display */}
                <div className="flex items-center justify-center min-h-screen pt-24 pb-8 px-8">
                    <DeviceFrame
                        style={{
                            width: maxDeviceWidth,
                            height: maxDeviceHeight
                        }}
                    >
                        <div
                            className={`${currentDevice.screen} isolate`}
                            style={{
                                width: currentDevice.width,
                                height: Math.min(currentDevice.height, window.innerHeight * 0.95 - 32)
                            }}
                        >
                            <StatusBar device={currentDevice} />

                            <div
                                className="absolute inset-0"
                                style={{
                                    paddingTop: currentDevice.statusHeight,
                                    contain: 'layout style paint size',
                                    overflow: 'hidden',
                                    isolation: 'isolate',
                                    height: '100%',
                                    background: 'linear-gradient(to bottom, #f8fafc, #ffffff)'
                                }}
                            >
                                <div
                                    className="w-full h-full overflow-y-auto overflow-x-hidden"
                                    style={{
                                        WebkitOverflowScrolling: 'touch',
                                        scrollbarWidth: 'none',
                                        msOverflowStyle: 'none',
                                        padding: '0 8px 8px 8px',
                                        height: '100%',
                                        maxHeight: '100%'
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
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Premium Header */}
            <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-10 shadow-lg">
                <div className="max-w-7xl mx-auto px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl ring-4 ring-blue-100">
                                <GraduationCap className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                    Western Mega College
                                </h1>
                                <p className="text-sm text-slate-600 font-medium">Premium Mobile Experience</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setIsFullscreen(true)}
                                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl text-sm font-semibold hover:from-slate-700 hover:to-slate-800 transition-all shadow-xl hover:scale-105 hover:shadow-2xl"
                            >
                                <Maximize2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Fullscreen</span>
                            </button>

                            <button
                                onClick={() => setShowPrototype(false)}
                                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white rounded-2xl text-sm font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 transition-all shadow-xl hover:scale-105 hover:shadow-2xl"
                            >
                                <Home className="w-4 h-4" />
                                <span className="hidden sm:inline">Exit Demo</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Premium Device Selection */}
                <div className="flex justify-center mb-12">
                    <div className="flex items-center bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-2 border border-slate-200/50 ring-1 ring-slate-100">
                        {Object.entries(devices).map(([key, device]) => {
                            const IconComponent = device.icon
                            return (
                                <button
                                    key={key}
                                    onClick={() => setDeviceType(key)}
                                    className={`px-8 py-4 text-sm font-semibold rounded-2xl transition-all duration-500 ${deviceType === key
                                        ? `bg-gradient-to-r ${device.color} text-white shadow-2xl scale-110 transform`
                                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50 hover:scale-105'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <IconComponent className="w-5 h-5" />
                                        <div className="text-left">
                                            <div className="hidden sm:block">{device.name}</div>
                                            <div className="sm:hidden">{device.name.split(' ')[0]}</div>
                                            <div className={`text-xs ${deviceType === key ? 'text-white/80' : 'text-slate-500'}`}>
                                                {device.width} × {device.height}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Device Preview */}
                <div className="flex justify-center">
                    <div className="relative">
                        <DeviceFrame
                            style={{
                                width: currentDevice.width + 32,
                                height: currentDevice.height + 32
                            }}
                        >
                            <div
                                className={`${currentDevice.screen} isolate`}
                                style={{
                                    width: currentDevice.width,
                                    height: currentDevice.height
                                }}
                            >
                                <StatusBar device={currentDevice} />

                                <div
                                    className="absolute inset-0"
                                    style={{
                                        paddingTop: currentDevice.statusHeight,
                                        contain: 'layout style paint size',
                                        overflow: 'hidden',
                                        isolation: 'isolate',
                                        height: '100%',
                                        background: 'linear-gradient(to bottom, #f8fafc, #ffffff)'
                                    }}
                                >
                                    <div
                                        className="w-full h-full overflow-y-auto overflow-x-hidden"
                                        style={{
                                            WebkitOverflowScrolling: 'touch',
                                            scrollbarWidth: 'none',
                                            msOverflowStyle: 'none',
                                            padding: '0 8px 8px 8px',
                                            height: '100%',
                                            maxHeight: '100%'
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

                        {/* Premium Floating Controls */}
                        <div className="absolute -right-24 top-1/2 transform -translate-y-1/2 space-y-4 hidden xl:flex xl:flex-col">
                            <button
                                onClick={() => setIsFullscreen(true)}
                                className="w-18 h-18 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-3xl shadow-2xl hover:from-slate-700 hover:to-slate-800 transition-all duration-500 flex items-center justify-center hover:scale-110 transform group"
                                title="Fullscreen Mode"
                            >
                                <Maximize2 className="w-7 h-7 group-hover:scale-110 transition-transform" />
                            </button>

                            <button
                                className="w-18 h-18 bg-gradient-to-br from-blue-600 to-purple-700 text-white rounded-3xl shadow-2xl hover:from-blue-500 hover:to-purple-600 transition-all duration-500 flex items-center justify-center hover:scale-110 transform group"
                                title="Refresh App"
                                onClick={() => window.location.reload()}
                            >
                                <RotateCcw className="w-7 h-7 group-hover:rotate-180 transition-transform duration-500" />
                            </button>

                            <button
                                onClick={() => setShowPrototype(false)}
                                className="w-18 h-18 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-3xl shadow-2xl hover:from-red-400 hover:to-pink-500 transition-all duration-500 flex items-center justify-center hover:scale-110 transform group"
                                title="Exit Demo"
                            >
                                <X className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>

                        {/* Enhanced Device Info */}
                        <div className="text-center mt-10">
                            <p className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                {currentDevice.name}
                            </p>
                            <p className="text-slate-600 text-sm mt-2 font-medium">
                                {currentDevice.width} × {currentDevice.height} pixels • Premium Display
                            </p>
                            <div className="flex justify-center mt-4">
                                <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${currentDevice.color} animate-pulse shadow-xl`} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MobilePrototypeFrame