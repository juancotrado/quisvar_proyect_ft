import './home.css';
// interface HomePageProps {};
const name = 'Diego';
const home = () => {
  return (
    <div className="container-home">
      <div className="title-content">
        <h1 className="h1-left">Bienvenido</h1>
        <h1 className="h1-right">{name}</h1>
      </div>
      <p className="paragraph">
        ¡Bienvenido a nuestro sistema de asignación de tareas! Aquí podrás
        asignar y gestionar tareas de manera eficiente en tan solo unos pocos
        clics. Simplifica tu vida y aumenta la productividad de tu equipo con
        nuestra plataforma.
      </p>
      <div className="btn-section">
        <button className="login-btn">Tus tareas</button>
        <button className="login-btn">Lista de Tareas</button>
      </div>
    </div>
  );
};

export default home;
