import { useState, useContext, useEffect } from "react"
import { AppContext } from "../AppContext"
import Icon from '../images/icon.png'
import Minus from '../images/minus.png'
import Plus from '../images/plus.png'
import CloseIcon from '../images/close.png'
import Copy from '../images/copy.png'
const am = ['Сигареты', 'Стики Акос', 'Стики Глоуб', 'Стики Фит', '5']

export const List = () => {
    const send_request = async (http, object) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(object)
        };
        const response = await fetch(http, requestOptions);
        const arr = await response.json()
        return arr
    }
    window.onbeforeunload = async () => {
        await send_request('/make_draft', { author: localStorage.getItem('login') || login, products: Object.values(selectedProducts) })
    }
    const { login, setLogin } = useContext(AppContext)
    const [group, setGroup] = useState(1)
    const [groupp, setGroupp] = useState(1)
    const [flag, setFlag] = useState(false)
    const [flag2, setFlag2] = useState(false)
    const [flag3, setFlag3] = useState(false)
    const [flag4, setFlag4] = useState(false)
    const [count, setCount] = useState(0);
    const [allRequests, setAllRequests] = useState([] || send_request('/return_all_requests').array)
    const [request, setRequest] = useState(null)
    const [products, setProducts] = useState({ products: [] || send_request('/return_all_products').array, value: 0 })
    const [requests, setRequests] = useState([] || send_request('/return_request_from_user', { author: localStorage.getItem('login') || login }).array)
    const [selectedProducts, setSelectedProducts] = useState({})
    useEffect(() => {
        const func = async () => {
            const array = await send_request('/return_all_products', {})
            const mp = array.array
            const req = await send_request('/return_request_from_user', { author: localStorage.getItem('login') || login })
            const mpreq = req.array
            const allreq = await send_request('/return_all_requests', {})
            const arrreq = allreq.array
            setProducts({ products: mp, value: count })
            setRequests(mpreq)
            setAllRequests(arrreq)
        }
        func()
    }, [])
    useEffect(() => {
        const func = async () => {
            const array = await send_request('/get_draft', { author: localStorage.getItem('login') || login })
            let val = {}
            for (let i = 0; i < array.products.length; ++i) {
                val[array.products[i].name] = array.products[i]
            }
            setSelectedProducts(val)
        }
        func()
    }, [])
    useEffect(() => {
        setTimeout(() => {
            const func = async () => {
                await send_request('/make_draft', { author: localStorage.getItem('login') || login, products: Object.values(selectedProducts) })
                const array = await send_request('/return_all_products', {})
                const mp = array.array
                const req = await send_request('/return_request_from_user', { author: localStorage.getItem('login') || login })
                const mpreq = req.array
                const allreq = await send_request('/return_all_requests', {})
                const arrreq = allreq.array
                setProducts({ products: mp, value: count })
                setRequests(mpreq)
                setAllRequests(arrreq)
            }
            func()
            setCount(count + 1);
        }, 60000);
    }, [count]);
    useEffect(() => {
        if (request) {
            document.querySelector('#blur1').style.filter = 'blur(12px)'
            document.querySelector('#blur2').style.filter = 'blur(12px)'
            document.querySelector('#blur3').style.filter = 'blur(12px)'
            document.querySelector('#adminmenu').style.filter = 'blur(12px)'
        } else {
            document.querySelector('#blur1').style.filter = 'blur(0px)'
            document.querySelector('#blur2').style.filter = 'blur(0px)'
            document.querySelector('#blur3').style.filter = 'blur(0px)'
            document.querySelector('#adminmenu').style.filter = 'blur(0px)'
        }
    }, [request])
    return (
        <div className="w-[100vw] h-[100vh] bg-neutral-100 overflow-y-scroll">
            <button id='blur1' className="absolute z-[100000000] w-[10vw] h-[5vh] bg-neutral-300 text-sm lg:text-base rounded-lg mt-[20px] right-[20px] font-medium ease-in-out duration-300 hover:scale-[1.1] hover:cursor-pointer" onClick={() => {
                localStorage.removeItem('login')
                setLogin(null)
            }}>
                Log out
            </button>
            <div id='blur2' className="sm:pl-[40px] lg:pl-[100px] pt-[10px]">
                <div className="flex gap-x-[10px]">
                    <img src={Icon} className={!flag ? "invert opacity-[0.9] scale-[0.75] pt-[3px] ease-in-out duration-300 hover:opacity-[1] hover:cursor-pointer hover:scale-[0.80]" :
                        "opacity-[0.9] invert scale-[0.75] pt-[3px] rotate-90 ease-in-out duration-300 hover:opacity-[1] hover:cursor-pointer hover:scale-[0.80]"
                    } onClick={() => {
                        setFlag(!flag)
                        if (document.querySelector('#first').style.height === '75px') {
                            document.querySelector('#first').style.height = '0px'
                            document.querySelector('#second').style.height = '0px'
                            document.querySelector('#second').style.borderBottomWidth = '0px'
                            document.querySelector('#third').style.height = '0px'
                        } else {
                            document.querySelector('#first').style.height = '75px'
                            document.querySelector('#second').style.height = '50px'
                            document.querySelector('#second').style.borderBottomWidth = '2px'
                            document.querySelector('#third').style.height = '50px'
                        }
                    }} />
                    <p className="text-neutral-700 font-medium leading-[50px] xl:text-[2rem] sm:text-[1.5rem]">Добавить товар</p>
                </div>
                <div id='first' className="h-[0px] overflow-hidden items-center ml-[60px] flex w-[80%] mt-[30px] gap-x-[20px] flex-start">
                    <div className={group !== 1 ? "rounded-full text-[0.5rem] md:text-[1rem] w-[20px] h-[20px] md:w-[40px] md:h-[40px] bg-neutral-200 text-center leading-[20px] md:leading-[40px] font-bold ease-in-out duration-300 hover:cursor-pointer hover:opacity-[0.9] hover:w-[100px] md:hover:w-[200px]" :
                        "rounded-full text-[0.5rem] md:text-[1rem] w-[20px] h-[20px] md:w-[40px] md:h-[40px] bg-lime-600 text-center leading-[20px] md:leading-[40px] font-bold ease-in-out duration-300 hover:cursor-pointer hover:opacity-[0.9] hover:w-[100px] md:hover:w-[200px]"
                    } onClick={() => { setGroup(1) }} onMouseEnter={(e) => {
                        e.target.innerHTML = 'Сигареты'
                    }} onMouseLeave={(e) => e.target.innerHTML = '1'}>1</div>
                    <div className={group !== 2 ? "rounded-full text-[0.5rem] md:text-[1rem] w-[20px] h-[20px] md:w-[40px] md:h-[40px] bg-neutral-200 text-center leading-[20px] md:leading-[40px] font-bold ease-in-out duration-300 hover:cursor-pointer hover:opacity-[0.9] hover:w-[100px] md:hover:w-[200px]" :
                        "rounded-full text-[0.5rem] md:text-[1rem] w-[20px] h-[20px] md:w-[40px] md:h-[40px] bg-lime-600 text-center leading-[20px] md:leading-[40px] font-bold ease-in-out duration-300 hover:cursor-pointer hover:opacity-[0.9] hover:w-[100px] md:hover:w-[200px]"
                    } onClick={() => { setGroup(2) }} onMouseEnter={(e) => {
                        e.target.innerHTML = 'Стики Акос'
                    }} onMouseLeave={(e) => e.target.innerHTML = '2'}>2</div>
                    <div className={group !== 3 ? "rounded-full text-[0.5rem] md:text-[1rem] w-[20px] h-[20px] md:w-[40px] md:h-[40px] bg-neutral-200 text-center leading-[20px] md:leading-[40px] font-bold ease-in-out duration-300 hover:cursor-pointer hover:opacity-[0.9] hover:w-[100px] md:hover:w-[200px]" :
                        "rounded-full text-[0.5rem] md:text-[1rem] w-[20px] h-[20px] md:w-[40px] md:h-[40px] bg-lime-600 text-center leading-[20px] md:leading-[40px] font-bold ease-in-out duration-300 hover:cursor-pointer hover:opacity-[0.9] hover:w-[100px] md:hover:w-[200px]"
                    } onClick={() => { setGroup(3) }} onMouseEnter={(e) => {
                        e.target.innerHTML = 'Стики Глоуб'
                    }} onMouseLeave={(e) => e.target.innerHTML = '3'}>3</div>
                    <div className={group !== 4 ? "rounded-full text-[0.5rem] md:text-[1rem] w-[20px] h-[20px] md:w-[40px] md:h-[40px] bg-neutral-200 text-center leading-[20px] md:leading-[40px] font-bold ease-in-out duration-300 hover:cursor-pointer hover:opacity-[0.9] hover:w-[100px] md:hover:w-[200px]" :
                        "rounded-full text-[0.5rem] md:text-[1rem] w-[20px] h-[20px] md:w-[40px] md:h-[40px] bg-lime-600 text-center leading-[20px] md:leading-[40px] font-bold ease-in-out duration-300 hover:cursor-pointer hover:opacity-[0.9] hover:w-[100px] md:hover:w-[200px]"
                    } onClick={() => { setGroup(4) }} onMouseEnter={(e) => {
                        e.target.innerHTML = 'Стики Фит'
                    }} onMouseLeave={(e) => e.target.innerHTML = '4'}>4</div>
                    <div className={group !== 5 ? "rounded-full text-[0.5rem] md:text-[1rem] w-[20px] h-[20px] md:w-[40px] md:h-[40px] bg-neutral-200 text-center leading-[20px] md:leading-[40px] font-bold ease-in-out duration-300 hover:cursor-pointer hover:opacity-[0.9] hover:w-[100px] md:hover:w-[200px]" :
                        "rounded-full text-[0.5rem] md:text-[1rem] w-[20px] h-[20px] md:w-[40px] md:h-[40px] bg-lime-600 text-center leading-[20px] md:leading-[40px] font-bold ease-in-out duration-300 hover:cursor-pointer hover:opacity-[0.9] hover:w-[100px] md:hover:w-[200px]"
                    } onClick={() => { setGroup(5) }}>5</div>
                    <p className="text-neutral-700 text-sm lg:text-lg font-medium leading-[50px] lg:leading-[50px]">Выберите группу</p>
                </div>
                <input id='second' className="h-[0px] text-sm md:text-base overflow-hidden ml-[58px] pl-[2px] w-[60%] mt-[20px] bg-transparent outline-none border-b-[0px] border-b-neutral-200 rounded-sm text-neutral-700" placeholder="Наименование товара здесь..." />
                <div id='third' className="h-[0px] scale-[0.5] ml-[30px] md:scale-[1] overflow-hidden md:ml-[58px] bg-neutral-300 w-[100px] mt-[20px] text-center leading-[50px] font-medium rounded-full cursor-pointer ease-in-out duration-300 hover:animate-pulse" onClick={() => {
                    const func = async () => {
                        if (document.querySelector('#second').value !== '') {
                            await send_request('/make_product', {
                                "name": document.querySelector('#second').value,
                                "group": group,
                                "author": localStorage.getItem('login') || login
                            })
                            const ans = await send_request('/return_all_products', {})
                            setProducts({ products: ans.array, value: count + 1 })
                            document.querySelector('#second').value = ''
                        }
                    }
                    func()
                }} >Отправить</div>
            </div>
            <div id='blur3' className="w-[100vw] sm:pl-[40px] lg:pl-[100px] pt-[10px]">
                <div className="flex gap-x-[10px]">
                    <img src={Icon} className={!flag2 ? "invert opacity-[0.9] scale-[0.75] pt-[3px] ease-in-out duration-300 hover:opacity-[1] hover:cursor-pointer hover:scale-[0.80]" :
                        "invert opacity-[0.9] scale-[0.75] pt-[3px] rotate-90 ease-in-out duration-300 hover:opacity-[1] hover:cursor-pointer hover:scale-[0.80]"
                    } onClick={() => {
                        setFlag2(!flag2)
                        if (document.querySelector('#first2').style.height === '75px') {
                            document.querySelector('#first2').style.height = '0px'
                            document.querySelector('#third2').style.height = '0px'
                            document.querySelector('#send').style.height = '0px'
                        } else {
                            document.querySelector('#first2').style.height = '75px'
                            document.querySelector('#third2').style.height = '400px'
                            document.querySelector('#send').style.height = '50px'
                        }
                    }} />
                    <p className="text-neutral-700 font-medium leading-[50px] xl:text-[2rem] sm:text-[1.5rem]">Составить заявку</p>
                </div>
                <div id='first2' className="h-[0px] overflow-hidden items-center ml-[60px] flex w-[80%] mt-[30px] gap-x-[20px] flex-start">
                    <div className={groupp !== 1 ? "rounded-full text-[0.5rem] md:text-[1rem] w-[20px] h-[20px] md:w-[40px] md:h-[40px] bg-neutral-200 text-center leading-[20px] md:leading-[40px] font-bold ease-in-out duration-300 hover:cursor-pointer hover:opacity-[0.9] hover:w-[100px] md:hover:w-[200px]" :
                        "rounded-full text-[0.5rem] md:text-[1rem] w-[20px] h-[20px] md:w-[40px] md:h-[40px] bg-lime-600 text-center leading-[20px] md:leading-[40px] font-bold ease-in-out duration-300 hover:cursor-pointer hover:opacity-[0.9] hover:w-[100px] md:hover:w-[200px]"
                    } onClick={() => { setGroupp(1) }} onMouseEnter={(e) => {
                        e.target.innerHTML = 'Сигареты'
                    }} onMouseLeave={(e) => e.target.innerHTML = '1'}>1</div>
                    <div className={groupp !== 2 ? "rounded-full text-[0.5rem] md:text-[1rem] w-[20px] h-[20px] md:w-[40px] md:h-[40px] bg-neutral-200 text-center leading-[20px] md:leading-[40px] font-bold ease-in-out duration-300 hover:cursor-pointer hover:opacity-[0.9] hover:w-[100px] md:hover:w-[200px]" :
                        "rounded-full text-[0.5rem] md:text-[1rem] w-[20px] h-[20px] md:w-[40px] md:h-[40px] bg-lime-600 text-center leading-[20px] md:leading-[40px] font-bold ease-in-out duration-300 hover:cursor-pointer hover:opacity-[0.9] hover:w-[100px] md:hover:w-[200px]"
                    } onClick={() => { setGroupp(2) }} onMouseEnter={(e) => {
                        e.target.innerHTML = 'Стики Акос'
                    }} onMouseLeave={(e) => e.target.innerHTML = '2'}>2</div>
                    <div className={groupp !== 3 ? "rounded-full text-[0.5rem] md:text-[1rem] w-[20px] h-[20px] md:w-[40px] md:h-[40px] bg-neutral-200 text-center leading-[20px] md:leading-[40px] font-bold ease-in-out duration-300 hover:cursor-pointer hover:opacity-[0.9] hover:w-[100px] md:hover:w-[200px]" :
                        "rounded-full text-[0.5rem] md:text-[1rem] w-[20px] h-[20px] md:w-[40px] md:h-[40px] bg-lime-600 text-center leading-[20px] md:leading-[40px] font-bold ease-in-out duration-300 hover:cursor-pointer hover:opacity-[0.9] hover:w-[100px] md:hover:w-[200px]"
                    } onClick={() => { setGroupp(3) }} onMouseEnter={(e) => {
                        e.target.innerHTML = 'Стики Глоуб'
                    }} onMouseLeave={(e) => e.target.innerHTML = '3'}>3</div>
                    <div className={groupp !== 4 ? "rounded-full text-[0.5rem] md:text-[1rem] w-[20px] h-[20px] md:w-[40px] md:h-[40px] bg-neutral-200 text-center leading-[20px] md:leading-[40px] font-bold ease-in-out duration-300 hover:cursor-pointer hover:opacity-[0.9] hover:w-[100px] md:hover:w-[200px]" :
                        "rounded-full text-[0.5rem] md:text-[1rem] w-[20px] h-[20px] md:w-[40px] md:h-[40px] bg-lime-600 text-center leading-[20px] md:leading-[40px] font-bold ease-in-out duration-300 hover:cursor-pointer hover:opacity-[0.9] hover:w-[100px] md:hover:w-[200px]"
                    } onClick={() => { setGroupp(4) }} onMouseEnter={(e) => {
                        e.target.innerHTML = 'Стики Фит'
                    }} onMouseLeave={(e) => e.target.innerHTML = '4'}>4</div>
                    <div className={groupp !== 5 ? "rounded-full text-[0.5rem] md:text-[1rem] w-[20px] h-[20px] md:w-[40px] md:h-[40px] bg-neutral-200 text-center leading-[20px] md:leading-[40px] font-bold ease-in-out duration-300 hover:cursor-pointer hover:opacity-[0.9] hover:w-[100px] md:hover:w-[200px]" :
                        "rounded-full text-[0.5rem] md:text-[1rem] w-[20px] h-[20px] md:w-[40px] md:h-[40px] bg-lime-600 text-center leading-[20px] md:leading-[40px] font-bold ease-in-out duration-300 hover:cursor-pointer hover:opacity-[0.9] hover:w-[100px] md:hover:w-[200px]"
                    } onClick={() => { setGroupp(5) }}>5</div>
                    <p className="text-neutral-700 text-sm lg:text-lg font-medium leading-[50px] lg:leading-[50px]">Выберите группу</p>
                </div>
                <div className="ml-[0px] sm:ml-[-40px] lg:ml-[-100px] flex justify-center w-[100vw]">
                    <div id="third2" className="w-[600px] md:w-[800px] scale-[0.5] sm:scale-[0.7] md:scale-[1] h-[0px] ml-auto mr-auto bg-neutral-200 rounded-md mt-[-50px] md:mt-[20px] overflow-hidden">
                        <p className="pl-[5%] pt-[10px] font-medium">Выберите товар</p>
                        <input id="search" className="w-[90%] outline-none bg-transparent ml-[5%] border-b-[2px] border-b-black" placeholder="Имя товара?" onChange={() => {
                            setProducts({ ...products, value: count })
                        }} />
                        <div id='map' className="overflow-y-scroll h-[80%]">
                            {products.products.map((element) => {
                                if (element.group === groupp && element.name.search(document.querySelector('#search').value) !== -1) {
                                    if (Object.values(selectedProducts).find((val) => val._id === element._id)) {
                                        return (<div className="pl-[5%] flex items-center text-center bg-slate-500 h-[60px] rounded-md mt-[10px] w-[60%] ml-auto mr-auto leading-[50px] font-medium">
                                            <div className="rounded-full w-[20px] flex items-center h-[20px] ease-in-out duration-300 bg-neutral-200 border-[1px] border-black hover:scale-[1.1] hover:cursor-pointer" onClick={(e) => {
                                                let node = e.target
                                                if (e.target.id === 'in') {
                                                    node = node.parentNode
                                                }
                                                if (node.childNodes.length === 0) {
                                                    console.log(node.parentNode)
                                                    setSelectedProducts({ ...selectedProducts, [element.name]: { ...element, count: parseInt(node.parentNode.childNodes[3].value) } })
                                                } else {
                                                    setSelectedProducts(current => {
                                                        const copy = { ...current };
                                                        delete copy[element.name];
                                                        return copy;
                                                    });
                                                }
                                            }}>
                                                <div id='in' className="rounded-full ml-auto mr-auto w-[10px] h-[10px] ease-in-out duration-300 bg-neutral-400" />
                                            </div>
                                            <p className="ml-[20px] w-[60%] h-[60px] text-neutral-300 overflow-x-scroll">{element.name}</p>
                                            <img className="opacity-[0.5] scale-[0.5] ease-in-out duration-300 hover:cursor-pointer hover:opacity-[1]" src={Minus} onClick={(e) => {
                                                if (e.target.parentNode.childNodes[0].childNodes.length !== 0) {
                                                    const value = parseInt(e.target.parentNode.childNodes[3].value)
                                                    if (value - 1 >= 1) {
                                                        e.target.parentNode.childNodes[3].value = String(value - 1)
                                                    }
                                                    setSelectedProducts({ ...selectedProducts, [element.name]: { ...element, count: value - 1 } })
                                                }
                                            }} />
                                            <input id="number" type="number" className="bg-transparent w-[30px] h-[30px] outline-none border-neutral-700 border-[2px] rounded-md text-black text-center font-mono" defaultValue="1" />
                                            <img className="opacity-[0.5] scale-[0.5] ease-in-out duration-300 hover:cursor-pointer hover:opacity-[1]" src={Plus} onClick={(e) => {
                                                if (e.target.parentNode.childNodes[0].childNodes.length !== 0) {
                                                    const value = parseInt(e.target.parentNode.childNodes[3].value)
                                                    e.target.parentNode.childNodes[3].value = String(value + 1)
                                                    setSelectedProducts({ ...selectedProducts, [element.name]: { ...element, count: value + 1 } })
                                                }
                                            }} />
                                        </div>)
                                    } else {
                                        return (<div className="pl-[5%] flex items-center text-center bg-slate-400 h-[60px] rounded-md mt-[10px] w-[60%] ml-auto mr-auto leading-[50px] font-medium">
                                            <div className="rounded-full w-[20px] flex items-center h-[20px] ease-in-out duration-300 bg-neutral-200 border-[1px] border-black hover:scale-[1.1] hover:cursor-pointer" onClick={(e) => {
                                                let node = e.target
                                                if (e.target.id === 'in') {
                                                    node = node.parentNode
                                                }
                                                if (node.childNodes.length === 0) {
                                                    setSelectedProducts({ ...selectedProducts, [element.name]: { ...element, count: parseInt(e.target.parentNode.childNodes[3].value) } })
                                                } else {
                                                    setSelectedProducts(current => {
                                                        const copy = { ...current };
                                                        delete copy[element.name];
                                                        return copy;
                                                    });
                                                }
                                            }}>
                                            </div>
                                            <p className="ml-[20px] w-[60%] h-[60px] overflow-x-scroll">{element.name}</p>
                                            <img className="opacity-[0.5] scale-[0.5] ease-in-out duration-300 hover:cursor-pointer hover:opacity-[1]" src={Minus} onClick={(e) => {
                                                if (e.target.parentNode.childNodes[0].childNodes.length !== 0) {
                                                    const value = parseInt(e.target.parentNode.childNodes[3].value)
                                                    if (value - 1 >= 1) {
                                                        e.target.parentNode.childNodes[3].value = String(value - 1)
                                                    }
                                                    setSelectedProducts({ ...selectedProducts, [element.name]: { ...element, count: value - 1 } })
                                                }
                                            }} />
                                            <input id="number" type="number" className="bg-transparent w-[30px] h-[30px] outline-none border-neutral-700 border-[2px] rounded-md text-black text-center font-mono" defaultValue="1" />
                                            <img className="opacity-[0.5] scale-[0.5] ease-in-out duration-300 hover:cursor-pointer hover:opacity-[1]" src={Plus} onClick={(e) => {
                                                if (e.target.parentNode.childNodes[0].childNodes.length !== 0) {
                                                    const value = parseInt(e.target.parentNode.childNodes[3].value)
                                                    e.target.parentNode.childNodes[3].value = String(value + 1)
                                                    setSelectedProducts({ ...selectedProducts, [element.name]: { ...element, count: value + 1 } })
                                                }
                                            }} />
                                        </div>)
                                    }
                                }
                            })}
                        </div>
                    </div>
                </div>
                <div className="ml-[0px] sm:ml-[-40px] lg:ml-[-100px] flex justify-center w-[100vw]">
                    <div id='send' className="h-[0px] mt-[-50px] scale-[0.75] md:scale-[1] overflow-hidden ml-auto mr-auto bg-neutral-300 w-[100px] md:mt-[20px] text-center leading-[50px] font-medium rounded-full cursor-pointer ease-in-out duration-300 hover:animate-pulse hover:scale-[1.1]" onClick={() => {
                        const func = async () => {
                            if (Object.getOwnPropertyNames(selectedProducts).length !== 0) {
                                await send_request('/make_request', {
                                    "author": localStorage.getItem('login') || login,
                                    "products": Object.values(selectedProducts)
                                })
                                await send_request('/delete_draft', { author: localStorage.getItem('login') || login })
                                setSelectedProducts({})
                                const array = await send_request('/return_all_products', {})
                                const mp = array.array
                                const req = await send_request('/return_request_from_user', { author: localStorage.getItem('login') || login })
                                const mpreq = req.array
                                const allreq = await send_request('/return_all_requests', {})
                                const arrreq = allreq.array
                                setProducts({ products: mp, value: count })
                                setRequests(mpreq)
                                setAllRequests(arrreq)
                            }
                        }
                        func()
                    }} >Составить</div>
                </div>
                <div className="flex gap-x-[10px]">
                    <img src={Icon} className={!flag3 ? "invert opacity-[0.9] scale-[0.75] pt-[3px] ease-in-out duration-300 hover:opacity-[1] hover:cursor-pointer hover:scale-[0.80]" :
                        "invert opacity-[0.9] scale-[0.75] pt-[3px] rotate-90 ease-in-out duration-300 hover:opacity-[1] hover:cursor-pointer hover:scale-[0.80]"
                    } onClick={() => {
                        setFlag3(!flag3)
                        if (document.querySelector('#third3').style.height === '400px') {
                            document.querySelector('#third3').style.height = '0px'
                        } else {
                            document.querySelector('#third3').style.height = '400px'
                        }
                    }} />
                    <p className="text-neutral-700 font-medium leading-[50px] xl:text-[2rem] sm:text-[1.5rem]">Отправленные заявки</p>
                </div>
                <div className="ml-[0px] sm:ml-[-40px] lg:ml-[-100px] flex justify-center w-[100vw]">
                    <div id="third3" className="w-[600px] md:w-[800px] scale-[0.5] sm:scale-[0.7] md:scale-[1] h-[0px] ml-auto mr-auto bg-neutral-200 rounded-md mt-[-50px] md:mt-[20px] overflow-hidden">
                        <p className="pl-[5%] pt-[10px] font-medium">Заявки</p>
                        <div id='map' className="overflow-y-scroll h-[90%]">
                            {requests.toReversed().map((element, index) => {
                                const date = new Date(element.time)
                                const time = date.toLocaleString("en-GB", { timeZone: "Europe/Moscow" });
                                return (<div className="flex w-[60%] mt-[20px] ml-auto mr-auto bg-neutral-700 h-[75px] items-center rounded-md">
                                    <p className="text-lime-600 font-medium ml-[30px] mr-[30px] hover:cursor-pointer hover:border-b-[3px]" onClick={() => {
                                        console.log(element)
                                        setRequest(element)
                                    }}>Заявка #{element.id} от {time}</p>
                                </div>)
                            })}
                        </div>
                    </div>
                </div>
            </div>
            {
                request ? <div className="z-[1000000000000] absolute m-auto top-0 left-0 right-0 bottom-0 w-[80vw] h-[80vh] bg-neutral-200 rounded-md border-[5px] border-lime-800">
                    <div className="w-[150px] ml-auto mr-[0px]">
                        <img src={Copy} className="inline-block relative scale-[0.5] opacity-[0.5] ease-in-out duration-300 hover:cursor-pointer hover:opacity-[1]" onClick={() => {
                            let text = ''
                            request.products.map((element) => {
                                text += (element.name + ' - ' + element.count + '\n')
                            })
                            navigator.clipboard.writeText(text)

                        }} />
                        <img src={CloseIcon} className="inline-block scale-[0.5] ease-in-out duration-300 opacity-[0.5] hover:cursor-pointer hover:opacity-[1]" onClick={() => {
                            setRequest(null)
                        }} />
                    </div>
                    <p className="text-center font-bold text-xl">Информация о заявке</p>
                    <p className="text-center font-bold text-3xl">#{request.id}</p>
                    <div className="w-[80%] h-[80%] ml-auto mr-auto">
                        <p className="font-medium text-center mt-[30px]">Автор: {request.author}</p>
                        <p className="font-medium text-center mt-[30px]">Дата и время (По Москве): {new Date(request.time).toLocaleString("en-GB", { timeZone: "Europe/Moscow" })}</p>
                        <p className="font-medium text-center mt-[30px]">Выбранная группа: {am[request.products[0].group - 1]}</p>
                        <p className="font-medium text-center mt-[30px]">Выбранные продукты:</p>
                        <div className="w-[80%] h-[30%] ml-auto mr-auto overflow-y-scroll">
                            {request.products.map((element) => {
                                return (
                                    <div className="flex flex-col items-center justify-center w-[90%] h-[40px] mt-[30px] ml-auto mr-auto rounded-md bg-neutral-800">
                                        <div className="flex">
                                            <p className="text-slate-200 ml-[10px]">{element.name} - {element.count}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div> : <div />
            }
            {
                ((login === 'admin' || localStorage.getItem('login') === 'admin') || (login === 'tester' || localStorage.getItem('login') === 'tester')) ? <div id='adminmenu' className="sm:pl-[40px] lg:pl-[100px] mt-[70px]">
                    <div className="flex gap-x-[10px]">
                        <img src={Icon} className={!flag4 ? "invert opacity-[0.9] object-contain scale-[0.75] pt-[3px] ease-in-out duration-300 hover:opacity-[1] hover:cursor-pointer hover:scale-[0.80]" :
                            "invert opacity-[0.9] object-contain scale-[0.75] pt-[3px] rotate-90 ease-in-out duration-300 hover:opacity-[1] hover:cursor-pointer hover:scale-[0.80]"
                        } onClick={() => {
                            setFlag4(!flag4)
                            if (document.querySelector('#shownadmin').style.height === '400px') {
                                document.querySelector('#shownadmin').style.height = '0px'
                            } else {
                                document.querySelector('#shownadmin').style.height = '400px'
                            }
                        }} />
                        <p className="text-neutral-700 font-medium leading-[50px] xl:text-[2rem] sm:text-[1.5rem]">Заявки всех людей (функция доступна только администратору)</p>
                    </div>
                    <div className="ml-[0px] sm:ml-[-40px] lg:ml-[-100px] flex justify-center w-[100vw]">
                        <div id="shownadmin" className="w-[600px] md:w-[800px] scale-[0.5] sm:scale-[0.7] md:scale-[1] h-[0px] ml-auto mr-auto bg-neutral-200 rounded-md mt-[-50px] md:mt-[20px] overflow-hidden">
                            <p className="pl-[5%] pt-[10px] font-medium">Заявки</p>
                            <div id='map' className="overflow-y-scroll h-[90%]">
                                {allRequests.toReversed().map((element, index) => {
                                    const date = new Date(element.time)
                                    const time = date.toLocaleString("en-GB", { timeZone: "Europe/Moscow" });
                                    return (<div className="flex w-[80%] mt-[20px] ml-auto mr-auto bg-neutral-700 h-[75px] md:h-[50px] items-center rounded-md">
                                        <p className="text-lime-600 text-xs font-medium ml-[30px] mr-[30px] pr-[20px] hover:cursor-pointer border-r-[3px] hover:border-b-[3px]" onClick={() => {
                                            console.log(element)
                                            setRequest(element)
                                        }}>Заявка #{element.id} от {time}</p>
                                        <p className="text-lime-600 text-xs font-mono ml-[30px] mr-[30px]" >От пользователя {element.author}</p>
                                    </div>)
                                })}
                            </div>
                        </div>
                    </div>
                </div> : <div />
            }
            <div className="w-[100vw] h-[100px]" />
        </div >
    )
}