import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="py-8 text-center text-muted-foreground">
      <p>
        &copy; {new Date().getFullYear()} MindGenius AI. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
