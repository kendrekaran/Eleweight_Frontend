
import React, { useEffect, useState } from 'react';
import { fetchExercises } from './ExerciseApi';

const ExerciseList = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getExercises = async () => {
      try {
        const exerciseData = await fetchExercises();
        setExercises(exerciseData);
      } catch (error) {
        console.error('Failed to load exercises:', error);
      } finally {
        setLoading(false);
      }
    };

    getExercises();
  }, []);

  if (loading) return <div>Loading exercises...</div>;

  return (
    <div>
      <h2>Exercise List</h2>
      <ul>
        {exercises.map((exercise) => (
          <li key={exercise.id}>
            <h3>{exercise.name}</h3>
            <p>Target Muscle: {exercise.target}</p>
            <p>Body Part: {exercise.bodyPart}</p>
            {exercise.gifUrl && <img src="https://i.pinimg.com/originals/22/6f/8b/226f8bed78eb03d988c67bbe2bfff9e0.gif" alt={`${exercise.name} demonstration`} />}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExerciseList;
