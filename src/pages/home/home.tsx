import './home.css';
// interface HomePageProps {};
const name = localStorage.getItem('name');
const home = () => {
  return (
    <div className="container-home">
      <div className="title-content">
        <h1 className="h1-left text-color-1">Bienvenido</h1>
        <h1 className="h1-right text-color-2">{name}</h1>
      </div>
      <p className="paragraph">
        ¡Bienvenido a nuestro sistema de asignación de tareas! Aquí podrás
        asignar y gestionar tareas de manera eficiente en tan solo unos pocos
        clics. Simplifica tu vida y aumenta la productividad de tu equipo con
        nuestra plataforma.
      </p>
      <div className="btn-section">
        <button className="home-btn btn-color-1">Tus tareas</button>
        <button className="home-btn btn-color-2">Lista de Tareas</button>
      </div>
    </div>
  );
};

export default home;
