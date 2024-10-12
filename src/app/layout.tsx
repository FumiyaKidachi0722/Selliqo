const Layout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <div>
          <header>
            <h1>My E-Commerce Platform</h1>
          </header>
          <main>{children}</main>
          <footer>
            <p>Footer content here</p>
          </footer>
        </div>
      </body>
    </html>
  );
};

export default Layout;
