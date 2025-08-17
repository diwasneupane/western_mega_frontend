import React, { useState } from 'react'
import { Maximize2, Minimize2, Smartphone, Monitor, RotateCcw, Settings, Zap, Wifi, Battery } from 'lucide-react'
import App from '../App'

const MobilePrototypeFrame = () => {
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [deviceType, setDeviceType] = useState('iphone')

    const devices = {
        iphone: {
            name: 'iPhone 15 Pro',
            width: 320,
            height: 640,
            frame: 'rounded-[32px] bg-gradient-to-b from-gray-800 to-black p-1.5 shadow-2xl',
            screen: 'rounded-[28px] overflow-hidden bg-black',
            notch: true,
            color: 'from-blue-500 to-purple-600'
        },
        android: {
            name: 'Pixel 8',
            width: 340,
            height: 680,
            frame: 'rounded-[24px] bg-gradient-to-b from-slate-700 to-slate-900 p-1.5 shadow-2xl',
            screen: 'rounded-[20px] overflow-hidden',
            notch: false,
            color: 'from-green-500 to-blue-500'
        },
        tablet: {
            name: 'iPad Mini',
            width: 480,
            height: 720,
            frame: 'rounded-[20px] bg-gradient-to-b from-gray-300 to-gray-500 p-2 shadow-2xl',
            screen: 'rounded-[16px] overflow-hidden',
            notch: false,
            color: 'from-purple-500 to-pink-500'
        }
    }

    const currentDevice = devices[deviceType]

    if (isFullscreen) {
        return (
            <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                {/* Compact Fullscreen Controls */}
                <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
                    <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5">
                        {Object.entries(devices).map(([key, device]) => (
                            <button
                                key={key}
                                onClick={() => setDeviceType(key)}
                                className={`px-2 py-1 text-xs font-medium rounded-full transition-all ${deviceType === key
                                    ? 'bg-white text-slate-900'
                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {device.name.split(' ')[0]}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setIsFullscreen(false)}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all"
                    >
                        <Minimize2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Centered Device */}
                <div className="flex items-center justify-center min-h-screen p-6">
                    <div className="relative">
                        <div
                            className={`${currentDevice.frame} relative transform hover:scale-[1.02] transition-transform duration-300`}
                            style={{
                                width: currentDevice.width + (deviceType === 'tablet' ? 16 : 12),
                                height: currentDevice.height + (deviceType === 'tablet' ? 16 : 12)
                            }}
                        >
                            {/* Status Indicators */}
                            {deviceType === 'iphone' && (
                                <>
                                    <div className="absolute -right-0.5 top-16 w-0.5 h-8 bg-gray-600 rounded-r" />
                                    <div className="absolute -left-0.5 top-12 w-0.5 h-6 bg-gray-600 rounded-l" />
                                    <div className="absolute -left-0.5 top-20 w-0.5 h-12 bg-gray-600 rounded-l" />
                                </>
                            )}

                            {/* Screen */}
                            <div
                                className={`${currentDevice.screen} relative`}
                                style={{
                                    width: currentDevice.width,
                                    height: currentDevice.height
                                }}
                            >
                                {/* Dynamic Island */}
                                {currentDevice.notch && (
                                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-black rounded-full z-10 flex items-center justify-center">
                                        <div className="flex items-center space-x-1">
                                            <div className="w-1 h-1 bg-green-400 rounded-full" />
                                            <div className="w-1 h-1 bg-white rounded-full" />
                                        </div>
                                    </div>
                                )}

                                <div className="w-full h-full">
                                    <App />
                                </div>
                            </div>
                        </div>

                        {/* Device Label */}
                        <div className="absolute -bottom-8 left-0 right-0 text-center">
                            <p className="text-white/80 text-sm font-medium">{currentDevice.name}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Compact Header */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-white/20">
                <div className="max-w-7xl mx-auto px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 bg-gradient-to-br ${currentDevice.color} rounded-lg flex items-center justify-center shadow-sm`}>
                                <Smartphone className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-slate-900">Western Mega College</h1>
                                <p className="text-xs text-slate-600">Mobile Student Portal</p>
                            </div>
                        </div>

                        {/* Compact Controls */}
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center bg-white rounded-lg shadow-sm p-1">
                                {Object.entries(devices).map(([key, device]) => (
                                    <button
                                        key={key}
                                        onClick={() => setDeviceType(key)}
                                        className={`px-2 py-1 text-xs font-medium rounded transition-all ${deviceType === key
                                            ? `bg-gradient-to-r ${device.color} text-white shadow-sm`
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                            }`}
                                    >
                                        {device.name.split(' ')[0]}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setIsFullscreen(true)}
                                className="flex items-center space-x-1 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors shadow-sm"
                            >
                                <Maximize2 className="w-3 h-3" />
                                <span>Expand</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="grid lg:grid-cols-5 gap-6">
                    {/* Device Preview - Takes more space */}
                    <div className="lg:col-span-3 flex justify-center">
                        <div className="relative">
                            {/* Device Frame */}
                            <div
                                className={`${currentDevice.frame} relative transform hover:scale-[1.02] transition-all duration-300`}
                                style={{
                                    width: currentDevice.width + (deviceType === 'tablet' ? 16 : 12),
                                    height: currentDevice.height + (deviceType === 'tablet' ? 16 : 12)
                                }}
                            >
                                {/* Physical Details */}
                                {deviceType === 'iphone' && (
                                    <>
                                        <div className="absolute -right-0.5 top-16 w-0.5 h-8 bg-gray-600 rounded-r" />
                                        <div className="absolute -left-0.5 top-12 w-0.5 h-6 bg-gray-600 rounded-l" />
                                        <div className="absolute -left-0.5 top-20 w-0.5 h-12 bg-gray-600 rounded-l" />
                                    </>
                                )}

                                {/* Screen */}
                                <div
                                    className={`${currentDevice.screen} relative`}
                                    style={{
                                        width: currentDevice.width,
                                        height: currentDevice.height
                                    }}
                                >
                                    {/* Dynamic Island */}
                                    {currentDevice.notch && (
                                        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-black rounded-full z-10 flex items-center justify-center">
                                            <div className="flex items-center space-x-1">
                                                <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
                                                <div className="w-1 h-1 bg-white rounded-full" />
                                            </div>
                                        </div>
                                    )}

                                    <div className="w-full h-full">
                                        <App />
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="absolute -right-12 top-1/2 transform -translate-y-1/2 space-y-2">
                                <button
                                    onClick={() => setIsFullscreen(true)}
                                    className="w-8 h-8 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800 transition-colors flex items-center justify-center"
                                    title="Fullscreen"
                                >
                                    <Maximize2 className="w-3 h-3" />
                                </button>

                                <button
                                    className="w-8 h-8 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                                    title="Refresh"
                                    onClick={() => window.location.reload()}
                                >
                                    <RotateCcw className="w-3 h-3" />
                                </button>
                            </div>

                            {/* Device Info */}
                            <div className="text-center mt-4">
                                <p className="text-slate-900 font-medium text-sm">{currentDevice.name}</p>
                                <p className="text-slate-500 text-xs">
                                    {currentDevice.width} × {currentDevice.height}px
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Status Card */}
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-white/20">
                            <div className="flex items-center space-x-2 mb-3">
                                <Zap className="w-4 h-4 text-green-500" />
                                <span className="font-medium text-slate-900 text-sm">Live Demo</span>
                            </div>
                            <div className="space-y-2 text-xs text-slate-600">
                                <div className="flex items-center justify-between">
                                    <span>Framework</span>
                                    <span className="font-medium">React + Vite</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Styling</span>
                                    <span className="font-medium">Tailwind CSS</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Responsive</span>
                                    <div className="flex items-center space-x-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                                        <span className="font-medium">Mobile First</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-white/20">
                            <h3 className="font-medium text-slate-900 text-sm mb-3">Key Features</h3>
                            <div className="space-y-2">
                                {[
                                    { icon: Smartphone, label: 'Touch Optimized', color: 'text-blue-500' },
                                    { icon: Settings, label: 'Student Portal', color: 'text-purple-500' },
                                    { icon: Wifi, label: 'Real-time Data', color: 'text-green-500' },
                                    { icon: Battery, label: 'Efficient Code', color: 'text-yellow-500' }
                                ].map((feature, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <feature.icon className={`w-3 h-3 ${feature.color}`} />
                                        <span className="text-xs text-slate-600">{feature.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-4 text-white shadow-sm">
                            <h3 className="font-medium text-sm mb-3">Prototype Stats</h3>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <div className="text-xl font-bold opacity-90">12+</div>
                                    <div className="opacity-70">Components</div>
                                </div>
                                <div>
                                    <div className="text-xl font-bold opacity-90">5+</div>
                                    <div className="opacity-70">Pages</div>
                                </div>
                                <div>
                                    <div className="text-xl font-bold opacity-90">100%</div>
                                    <div className="opacity-70">Responsive</div>
                                </div>
                                <div>
                                    <div className="text-xl font-bold opacity-90">Live</div>
                                    <div className="opacity-70">Interactive</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MobilePrototypeFrame