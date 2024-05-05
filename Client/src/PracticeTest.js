import React, { useState } from 'react';
import './App.css';

const PracticeTestSet = ({ flashcards }) => {
    const [score, setScore] = useState(0);

    const handleAnswer = (term, correctDefinition) => {
        const userDefinition = prompt(`Term: ${term}\nEnter Description:`);
        if (userDefinition && userDefinition.trim().toLowerCase() === correctDefinition.toLowerCase()) {
            setScore(score + 1);
            alert('Correct!');
        } else {
            alert(`Incorrect. The correct description is: ${correctDefinition}`);
        }
    };

    return (
        <div className='background'>
            <h1>Practice Test with Answer</h1>
            {flashcards.map((flashcard, index) => (
                <div className='center' key={index}>
                    <p><strong>Term:</strong> {flashcard.term}</p>
                    <button className='loginButtonSpacing' onClick={() => handleAnswer(flashcard.term, flashcard.definition)}>Submit Answer</button>
                    <p><strong>Definition:</strong> {flashcard.definition}</p>
                </div>
            ))}
            <h2>Score: {score}/{flashcards.length}</h2>
        </div>
    );
};

export default PracticeTestSet;
