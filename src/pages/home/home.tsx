import React from 'react';
import TaskCard from '../../components/shared/card/TaskCard';

// interface HomePageProps {};

const home = () => {
  return (
    <div>
      home
      <div
        style={{
          padding: 5,
          width: '300px',
          height: '300px',
          backgroundColor: '#e3e3e3',
        }}
      >
        <TaskCard />
      </div>
    </div>
  );
};

export default home;
