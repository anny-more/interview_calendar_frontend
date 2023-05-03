import React, { useEffect, useState } from 'react';
import {getWeek} from './modules/getWeek';
import styled from 'styled-components';
import Form from './components/modal';
import { timeSlots } from './modules/const';
import { deleteSlot } from './modules/deleteSlot';

const Wrapper = styled.div`
    margin: 0 auto;
    max-width: 720px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 2rem;
    color: red;
    overflov-y: scroll;
`;
const Header = styled.div`
    width: 100%;
    position: sticky;
    top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: grey;
    z-index: 1;
    border-radius: 10px;
`
const Calendar = styled.div`
    display: flex;
    flex-direction: row:
    align-items: stretch;
    justify-content: space-evenly;
    width: 100%;
    padding: 10px 0 10px 0;
`;
const Slots = styled.div`
    display: flex;
    flex-direction: row:
    align-items: stretch;
    justify-content: space-evenly;
    width: 100%;
`;
const Day = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: calc(100% / 8);
`;
const TimeSlot = styled.div<{bg : string}>`
    border: 1px solid grey;
    width: 100%;
    max-height: calc(720px / 8);
    height: calc(100vw / 8);
    overflow: hidden;
    border: solid 1px grey;
    text-align: right;
    color: lightgrey;
    background-color: ${props => props.bg};
    font-size: smaller;

`

function App (): JSX.Element {
    const [dateInfo, setDate] = useState(getWeek.setWeek());
    const [slotsData, setData] = useState([{date_interview: ''}]);
    const [visible, setModal] = useState(false);
    const [rerender, startRender] = useState(false);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/allSlots`)
        .then(res => res.json())
        .then(data => setData(data))
        .catch(err => setData([{date_interview: ''}]));
    }, [dateInfo[0].item, rerender, visible]);

    return (
        <Wrapper>
            <Form visible={visible} setVisible={setModal}/>
            <Header>
                <Calendar>
                    <div>Interview Calendar</div>
                    <button onClick={() => setModal(true)}>+</button>
                </Calendar>
            <Calendar>
                <Day></Day>
                {dateInfo.map(({item, day, date}) => {
                    return (
                        <>
                            <Day key={item.toString()}>
                                <div>{day}</div>
                                <div>{date}</div>
                            </Day>
                        </>
                    );
                })}
            </Calendar>
            <Calendar>
                <button onClick={() => {setDate(getWeek.getDayBefore());}}>Prev</button>
                <div>{dateInfo[0].month} {dateInfo[0].year}</div>
                <button onClick={() => {setDate(getWeek.getDayAfter());}}>Next</button>
            </Calendar>
            </Header>

            <Slots>
                <Day>
                {timeSlots.map(item => {
                    return (
                    <TimeSlot bg='white'>{item}</TimeSlot>
                    )})}
                </Day>
                {dateInfo.map(({item}) => {
                    return (
                        <>
                            <Day key={item.toString()}>
                               {timeSlots.map((hour) => {
                                const key = item + ' ' + hour;
                                const bg = slotsData.find(item => item.date_interview === key) ? 'SkyBlue' : 'white'
                                return (
                                    <>
                                    <TimeSlot key={key} bg={bg} onClick = {() => {
                                        if (bg == 'SkyBlue') {
                                            deleteSlot(key);
                                            startRender(!rerender);
                                        }}}></TimeSlot>
                                    </>
                                )})}
                            </Day>
                        </>
                    );
                })}
            </Slots>
        </Wrapper>
    );
}

export default App;
