const Footer = () => {
    return (
      <footer className="bg-white shadow-2xs border-b border-gray-200 py-4">
        <div className="max-w-screen-xl mx-auto text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} PlatFilmes.
          </p>
        </div>
      </footer>
    );
  }
  
  export default Footer;
  