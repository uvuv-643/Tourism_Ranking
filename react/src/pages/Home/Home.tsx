import React, {useState} from 'react'
import Loader from "../../components/Loader/Loader";
import TextPhotoInput from "../../components/TextPhotoInput/TextPhotoInput";
import Button from "../../components/Button/Button";
import {LuMapPin} from "react-icons/lu";
import Select from "../../components/Select/Select";
import RadioButtons from "../../components/RadioButtons/RadioButtons";

const cities = [{
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
}]


const Home = () => {

    const [query, setQuery] = useState<string>("")
    const [photoModeEnabled, setPhotoModeEnabled] = useState<boolean>(false)

    const [error, setError] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const handleProcess = () => {
        setError('')
        setLoading(true)
        setTimeout(() => [
            setLoading(false)
        ], 5000)
    }

    const handleSubmit = () => {
        if (photoModeEnabled) {
            if (query.length < 1000 || query.substring(0, 4) !== 'data') {  // bad base64 code
                console.log(query.substring(0, 4))
                setError("Ошибка при загрузке фото. Попробуйте другой формат.")
            } else {
                handleProcess()
            }
        } else {
            if (query.length > 500 || query.length <= 1) {
                setError("Запрос не должен быть пустым, а его длина не должна превышать 500 символов")
            } else {
                handleProcess()
            }
        }
    }

    return (
        <div className="Home">
            <div className="Home__Wrapper">
                <h1>Поиск <span>туристических мест</span> в городах России </h1>
                    <div className={"Home__Input" + (loading ? ' _hidden' : '')}>
                        <TextPhotoInput onChange={setQuery} onChangeMode={setPhotoModeEnabled}></TextPhotoInput>
                        <RadioButtons id="radio" label="Выберите город" values={cities}/>
                        <div className="Home__Button">
                            <Button onClick={handleSubmit}>Построить экскурсионный маршрут <LuMapPin/></Button>
                        </div>
                        {error.length > 0 && (
                            <div className="Home__Error">
                                {error}
                            </div>
                        )}
                    </div>
                {
                    loading && (
                        <div className="Home__Loader">
                            <Loader></Loader>
                        </div>
                    )
                }

            </div>
        </div>
    )
}

export default Home
