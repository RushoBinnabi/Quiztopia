import { React, useState, useEffect } from 'react';
import Template from "./Template";
import axios from 'axios';
import './App.css';

const CreateCard = (set_id) => {
    const [term, setCardTerm] = useState('');
    const [definition, setCardDef] = useState('');
    const [proficiency, setProficiency] = useState(0);
    const [cardSets, setCardSets] = useState([]);
    
    const handleCreateCard = (event) => {
        event.preventDefault();

        setProficiency(0); // New cards always start with a profficiency of 0

        axios.post('http://localhost:9000/addCard', { term, definition, proficiency, set_id })
            .catch((err) => alert('Error in Create Flash Card'))
    };



    return Template("Create Flash Card",
        <form className='background' onSubmit={handleCreateCard}>
            <label className='center'>
                Term:
                <input
                type="text"
                value={term}
                onChange={(e) => setCardTerm (e.target.value)}
                />
            </label>
            <br />
            <label className='center'>
                Definition:
                <input
                type="text"
                value={definition}
                onChange={(e) => setCardDef (e.target.value)}
                />
            </label>
            <br />
            <label className='center'>
                Profficiency Level:
                <input
                    type="text"
                    value={proficiency}
                    disabled
                    />
            </label>
            <br />
            <label className='center'>
                Flash Card Sets:
                
            </label>
            <div>
                <button className='loginButtonSpacing' type="button" onClick={(event) => handleCreateCard(event)}>
                Add To Set
                </button>
            </div>
        </form>
    );
}
export default CreateCard;
