
const LoadingDots = () => {
  return (
    <div className="flex flex-col gap-2 items-center justify-center mt-4 mb-4">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-jump"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-jump-400"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-jump-800"></div>
      </div>
      <p>Carregando...</p>
    </div>

  )
}

export default LoadingDots
