import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Navbar from './NavBar';

function ViewSet() {
    const [set, setSet] = useState("");
    const [flashcards, setFlashcards] = useState([]);
    const [term, setTerm] = useState('');
    const [definition, setDefinition] = useState('');

    const { setID } = useParams();

    useEffect(() => {
        const setValue = { setID };
        axios.get('http://localhost:9000/getSet', { params: setValue })
            .then((res) => {
                setSet(res.data.set);
                setFlashcards(res.data.flashcards)
            })
            .catch((err) => {
                alert("Error getting set: " + err);
            })
    }, [setID])

    const handleAddCard = () => {
        axios.post('http://localhost:9000/addCard', {
            setID, 
            term, 
            definition 
        })
            .then((res) => {
                if (res.data) {
                    const setValue = { setID };
                    axios.get('http://localhost:9000/getSet', { params: setValue })
                    .then((res) => {
                        setFlashcards(res.data.flashcards)
                    })
                    .catch((err) => {
                        alert("Error getting set: " + err);
                    });
                    alert("Great Success");
                }
            })
            .catch((err) => {
                alert("Error adding card: " + err);
            })

        setTerm('');
        setDefinition('');
    };


    return (
        <div className='background'>
            <Navbar/>
            <h1>{set.title}</h1>
            <h3>{set.description}</h3>
            <h2>Cards:</h2>
            <ul>
                {flashcards.map((card) => (
                    <li key={card._id}>
                        <strong>Term:</strong> {card.term} <br/><strong>Definition:</strong> {card.definition}
                    </li>
                ))}
            </ul>
            <h2>Add Card:</h2>
            <label>
                Term:
                <input 
                  type="text" 
                  value={term} 
                  onChange={(e) => setTerm(e.target.value)} 
                />
            </label>
            <br/>
            <label>
                Definition:
                <input 
                  type="text" 
                  value={definition} 
                  onChange={(e) => setDefinition(e.target.value)} 
                />
            </label>
            <br/>
            <button 
              className='loginButtonSpacing' 
              onClick={handleAddCard}
            >
              Add Card
            </button>
            <br />
            <Link to={`/ReviewSet/${setID}`}>Review Set</Link>
        </div>
    );
}

export default ViewSet;
