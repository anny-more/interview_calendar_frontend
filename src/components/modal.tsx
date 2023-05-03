import { useEffect, useState } from "react";
import styled from "styled-components";
import { timeSlots } from "../modules/const";

const Modal = styled.div<{visible: Boolean}>`
    visibility: ${props => props.visible ? 'visible' : 'hidden'};
    position: fixed;
    top: 0;
    width: max-content;  
    height: max-content;
    margin: 20px;
    background-color: white;
    border-radius: 10px;
    z-index: 2;
`;
const ModalForm = styled.form`
    max-width: 100vw;
    width: 720px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 20px;
`;
const Message = styled.div<{color: String}>`
    height: 60px;
    width: 100%;
    color: ${props => props.color};
    text-align: center;
    margin-top: 15px;
`; 
export default function Form({visible, setVisible} : {visible: Boolean, setVisible: Function}) {
    const [newEvent, setNewEvent] = useState({date: '', time: ''});
    const [isDisabled, setStatus] = useState(true);
    const [response, setResponse] = useState('');

    type ResponseType = 'error' | 'ok' | '';
    type MessageType = {[key in ResponseType]: String};
    
    const message: MessageType = {
        'ok': 'Встреча добавлена!',
        'error': 'Не удалось добавить встречу!',
        '': ''
    }

    const onSubmit = (event: { preventDefault: () => void; }) => {
        const data = {date_interview: newEvent.date, slot: newEvent.time};
        setNewEvent({date: '', time: ''});

        fetch(`${process.env.REACT_APP_API_URL}/api/addSlot`, {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => setResponse('ok'))
        .catch(() => setResponse('error'));
        event.preventDefault();
    }
    useEffect(() => {
        (newEvent.date && newEvent.time) ? setStatus(false) : setStatus(true);
        setResponse('');
    }, [newEvent.date, newEvent.time] 
    );
  
    return (
            <Modal visible={visible}>
                <Message color={(response === 'ok') ?'green' : 'red'}>{response  && message[response as ResponseType]}</Message>
                <ModalForm onSubmit={onSubmit}>
                <h5>Добавить встречу</h5>
                    <label>
                        Дата
                        <br/>
                        <input type='date' value={newEvent.date} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}/>
                    </label>
                    <br/>
                    <label>
                    Время
                    <br/>
                        <select value={newEvent.time} onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}>
                            {timeSlots.map(item => {
                                return (
                                    <option value={item}>{item}</option>
                                )
                            }) }
                        </select>
                    </label>
                    <br/>
                    
                    <button onClick={() => {setResponse(''); setVisible(false) }}>Отмена</button>
                    <button disabled={isDisabled} type='submit'>Добавить</button>
                </ModalForm>
            </Modal>
    );
}
