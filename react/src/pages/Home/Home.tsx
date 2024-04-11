import React, {useEffect, useRef, useState} from 'react'
import Loader from "../../components/Loader/Loader";
import TextPhotoInput from "../../components/TextPhotoInput/TextPhotoInput";
import Button from "../../components/Button/Button";
import {LuMapPin} from "react-icons/lu";
import RadioButtons from "../../components/RadioButtons/RadioButtons";
import Histogram from "../../components/Histogram/Histogram";
import Map from "../../components/Map/Map";
import axios from "axios";

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

type Showplace = {
    point: google.maps.LatLngLiteral,
    prob: number,
    label: string,
    categories: string[],
    photos: string[]
}

type Category = {
    prob: number,
    label: string,
}


const Home = () => {

    const [query, setQuery] = useState<string>("")
    const [photoModeEnabled, setPhotoModeEnabled] = useState<boolean>(false)

    const [error, setError] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const [center, setCenter] = useState<google.maps.LatLngLiteral>()
    const [showplaces, setShowplaces] = useState<Showplace[]>([])
    const [categories, setCategories] = useState<Category[]>([])

    const [cityId, setCityId] = useState<number>(0)

    const histRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (showplaces.length) {
             setCenter(
            showplaces.map(el => el.point).reduce((prev, curr) => {
                return {
                    lat: prev.lat + curr.lat / showplaces.length,
                    lng: prev.lng + curr.lng / showplaces.length
                }
            }, {lat: 0, lng: 0}))
        } else {
            setCenter(undefined)
        }
    }, [showplaces]);

    const handleProcess = () => {
        setError('')
        setLoading(true)
        if (photoModeEnabled) {
            axios.post('/model/photo', {
                'image': query,
                'city_id': cityId
            }).then(response => {
                setLoading(false)
                if (response.status === 200) {
                    setTimeout(() => {
                        histRef.current?.scrollIntoView({behavior: 'smooth'})
                    }, 100)
                    if (response.data.error === false) {
                        setError(response.data.message)
                    }
                    setCategories(response.data.categories)
                    setShowplaces(response.data.objects)
                }
            })
        } else {
            axios.post('/model/text', {
                'text': query,
                'city_id': cityId
            }).then(response => {
                setLoading(false)
                if (response.status === 200) {
                    setTimeout(() => {
                        histRef.current?.scrollIntoView({behavior: 'smooth'})
                    }, 100)
                    if (response.data.error === false) {
                        setError(response.data.message)
                    }
                    setCategories(response.data.categories)
                    setShowplaces(response.data.objects)
                }
            })
        }
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
                    <RadioButtons id="radio" label="Выберите город" values={cities} onChange={(v: string) => setCityId(parseInt(v))}/>
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
            <div className="Home__Response">
                <div className="Home__Histograms" ref={histRef}>
                    <div className="Home__Categories">
                        <Histogram title="Распределение по категориям" values={categories}/>
                    </div>
                    <div className="Home__Objects">
                        <Histogram title="Распределение по объектам" values={showplaces}/>
                    </div>

                </div>
                <div className="Home__Map">
                    {center && (
                        <Map center={center} points={showplaces.map(el => el.point)}/>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Home
