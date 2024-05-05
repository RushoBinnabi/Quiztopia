import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './App.css';
import Navbar from './NavBar';

const ReviewSet = () => {
    const navigate = useNavigate();
    const { setID } = useParams();
    const [set, setSet] = useState({});
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [descriptions, setDescriptions] = useState({});
    const [showDescription, setShowDescription] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:9000/getSet', { params: { setID } })
            .then(data => setSet(data.data))
            .catch((e) => alert('Error in getting set'))
    })



    const currentCard = () => { if (set.flashcards) { return set.flashcards[currentCardIndex] } else { return '' } };

    const handleDescriptionChange = (e) => {
        setDescriptions({
            ...descriptions,
            [currentCard()._id]: e.target.value
        });
    };

    const handleNextCard = () => {
        console.log(currentCardIndex < set.flashcards.length - 1)
        if (currentCardIndex < set.flashcards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
            setShowDescription(false);
        }
        else if (window.confirm("Do you want to go back (click no to restart)")) {
            navigate(`/viewCardSet/${setID}`);
        } else {
            console.log("reseting");
            handleReset();
        }
    };

    const handleShowDescription = () => {
        setShowDescription(true);
    };

    const handleSkipCard = () => {
        setShowDescription(false);
        handleNextCard();
    };

    const handleReset = () => {
        setDescriptions({});
        setShowDescription(false);
        setCurrentCardIndex(0);
    };

    const handleCorrectDescription = () => {
        if (descriptions[currentCard()._id] === currentCard().definition) {
            console.log(`correct ${JSON.stringify(currentCard())}`)
            // TODO: how do we do profficiency
            axios.patch('http://localhost:9000/updateProfficiency', { flashcardID: currentCard()._id, profficiency: currentCard().profficiency + 1 })

        }
        handleNextCard();
    };

    return (
        <div className='background'>
            <Navbar />
            <h1>Review Set: {set.title}</h1>
            <p>{set.description}</p>
            <div className='center'>
                <p>{currentCard().term}</p>
                {!showDescription ? (
                    <div className='center'>
                        <label>
                            Description:
                            <input
                                type="text"
                                value={descriptions[currentCard()._id] || ''}
                                onChange={handleDescriptionChange}
                            />
                        </label>
                        <button className='loginButtonSpacing' onClick={handleCorrectDescription}>Correct Description</button>
                        <button className='loginButtonSpacing' onClick={handleNextCard}>Next Card</button>
                        <button className='loginButtonSpacing' onClick={handleShowDescription}>Show Description</button>
                    </div>
                ) : (
                    <div className='center'>
                        <p>Correct Description: {currentCard().definition}</p>
                        <button className='loginButtonSpacing' onClick={handleSkipCard}>Skip Card</button>
                    </div>
                )}
            </div>
            <button className='loginButtonSpacing' onClick={handleReset}>Restart</button>
        </div>
    );
};

export default ReviewSet;
