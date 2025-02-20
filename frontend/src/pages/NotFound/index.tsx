const NotFound = () => {
  return (
    <div className="flex items-center justify-center bg-transparent mt-60 mb-60">      
      <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-lg shadow-lg w-96 text-center">
        <h1 className="text-7xl text-red-600 font-bold">404</h1>
        <h2 className="text-4xl text-red-600 font-bold">NOT FOUND</h2>
        <p className="text-lg">A página não foi encontrada ou não existe.</p>
      </div>
    </div>
  );
};

export default NotFound;
