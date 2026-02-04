export default function OrderStatusTimeline({ status }) {
    const statuses = ['pending', 'processing', 'shipped', 'delivered'];
    const currentStatusIndex = statuses.indexOf(status?.toLowerCase()) >= 0 ? statuses.indexOf(status?.toLowerCase()) : 0;

    return (
        <div className="py-4 sm:py-8">
            <div className="relative">
                {/* Status circles */}
                <div className="flex justify-between items-center relative z-10">
                    {statuses.map((statusName, index) => {
                        const isActive = index <= currentStatusIndex;
                        const isCompleted = index < currentStatusIndex;
                        const isCurrent = index === currentStatusIndex;

                        return (
                            <div key={statusName} className="flex flex-col items-center">
                                <div className="relative">
                                    {isCurrent && (
                                        <span className="absolute inset-0 rounded-full bg-green-400 opacity-75 animate-ping" />
                                    )}

                                    <div
                                        className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-3 sm:border-4 flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300
          ${isActive
                                                ? 'bg-green-500 border-green-500 text-white shadow-lg'
                                                : 'bg-gray-300 border-gray-300 text-gray-600'
                                            }`}
                                    >
                                        {isCompleted ? '✓' : index + 1}
                                    </div>
                                </div>

                                <span
                                    className={`text-xs sm:text-sm font-semibold capitalize mt-2 sm:mt-3 ${isActive ? 'text-gray-900' : 'text-gray-500'
                                        }`}
                                >
                                    {statusName}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Connecting lines */}
                <div className="absolute left-0 right-0 top-1/3 -translate-y-1/2 flex items-center px-5 sm:px-6">
                    {statuses.map((_, index) => {
                        if (index === statuses.length - 1) return null;
                        const isCompleted = index < currentStatusIndex;

                        return (
                            <div key={index} className="flex items-center flex-1">
                                <div className="w-5 sm:w-6"></div>
                                <div className={`flex-1 h-0.5 transition-all duration-300 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'
                                    }`}></div>
                                <div className="w-5 sm:w-6"></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}