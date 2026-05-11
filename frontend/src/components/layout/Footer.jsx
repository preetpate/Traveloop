const Footer = () => {
  return (
    <footer className="bg-card/50 backdrop-blur-lg border-t border-border mt-auto shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-secondary text-sm">
            © 2024 Traveloop. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-text-secondary">
            <a href="#" className="hover:text-primary transition-all duration-150">Privacy</a>
            <a href="#" className="hover:text-primary transition-all duration-150">Terms</a>
            <a href="#" className="hover:text-primary transition-all duration-150">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
