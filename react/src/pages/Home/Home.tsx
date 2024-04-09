import React from 'react'
import Loader from "../../components/Loader/Loader";
import TextPhotoInput from "../../components/TextPhotoInput/TextPhotoInput";
import Button from "../../components/Button/Button";
import { LuMapPin } from "react-icons/lu";
import Select from "../../components/Select/Select";
import RadioButtons from "../../components/RadioButtons/RadioButtons";

const Home = () => {
    return (
        <div className="Home">
            <div className="Home__Wrapper">
                <h1>Поиск <span>туристических мест</span> в городах России </h1>
                <TextPhotoInput></TextPhotoInput>
                <RadioButtons id="radio" label="Выберите город" values={ [{
                    id: '0',
                    label: 'Все города'
                }, {
                    id: '1',
                    label: 'Нижний Новгород'
                }, {
                    id: '2',
                    label: 'Ярославль'
                }, {
                    id: '3',
                    label: 'Екатеринбург'
                }, {
                    id: '4',
                    label: 'Владимир'
                }] } />
                <div className="Home__Button">
                    <Button onClick={() => {
                    }}>Построить экскурсионный маршрут <LuMapPin/></Button>
                </div>
            </div>
        </div>
    )
}

export default Home
