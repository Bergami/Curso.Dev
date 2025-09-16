function HomePage() {
  return (
    <div className="container">
      <h1>Welcome to Curso.dev</h1>
      <p>Learn about the latest technologies and improve your skills.</p>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #6a11cb, #2575fc);
          color: #fff;
          font-family: Arial, sans-serif;
          text-align: center;
        }
        h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        p {
          font-size: 1.5rem;
          max-width: 600px;
        }
      `}</style>
    </div>
  );
}

export default HomePage;