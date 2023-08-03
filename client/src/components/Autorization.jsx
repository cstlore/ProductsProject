import { useState, useContext } from "react"
import { AppContext } from "../AppContext"

export const Autorization = () => {
    const [flag, setFlag] = useState(false)
    const [error, setError] = useState(false)
    const { login, setLogin } = useContext(AppContext)
    const send_request = async () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'login': document.querySelector('#name').value,
                'password': document.querySelector('#password').value
            })
        };
        let response
        if (!flag) {
            response = await fetch('/api/login', requestOptions);
        } else {
            response = await fetch('/api/register', requestOptions);
        }
        if (response.status === 200) {
            setLogin(document.querySelector('#name').value)
            localStorage.setItem('login', document.querySelector('#name').value)
        } else {
            setError(true)
        }
    }
    if (!flag) {
        return (
            <div className="absolute w-[100vw] h-[100vh] m-0 bg-neutral-900">
                <div className="absolute m-auto left-0 right-0 w-[60vw] h-[80vh] bg-neutral-500 mt-[10vh] rounded-lg">
                    <p className="text-neutral-100 text-center text-xl pt-[20px] font-bold">Autorisation</p>
                    <div className="w-[80%] h-[50px] mt-[100px] ml-auto mr-auto">
                        <p className="text-neutral-200">Name</p>
                        <input id="name" type='email' placeholder="Name here..." className={!error ? "outline-none w-[100%] text-white bg-transparent border-b-[2px] border-b-neutral-200" :
                            "outline-none w-[100%] text-red-500 bg-transparent border-b-[2px] border-b-red-500"} onKeyDown={(e) => {
                                setError(false)
                                if (e.key === 'Enter') {
                                    document.querySelector('#password').focus()
                                }
                            }}></input>
                    </div>
                    <div className="w-[80%] h-[50px] mt-[100px] ml-auto mr-auto">
                        <p className="text-neutral-200">Password</p>
                        <input id='password' type='password' placeholder="Password here..." className={!error ? "outline-none w-[100%] text-white bg-transparent border-b-[2px] border-b-neutral-200" :
                            "outline-none w-[100%] text-red-500 bg-transparent border-b-[2px] border-b-red-500"} onKeyDown={async (e) => {
                                setError(false)
                                if (e.key === 'Enter') {
                                    send_request()
                                }
                            }}></input>
                    </div>
                    <div className="w-[250px] h-[75px] ml-auto mr-auto mt-[50px] ease-in-out duration-300 bg-neutral-200 rounded-lg text-center hover:scale-[1.05] hover:cursor-pointer" onClick={() => {
                        send_request()
                    }}>
                        <p className="pt-[25px] font-medium">Login</p>
                    </div>
                    <p className="w-[60%] pt-[10px] text-center ease-in-out duration-300 ml-auto mr-auto text-neutral-200 border-b-[2px] hover:text-neutral-300 hover:cursor-pointer hover:border-b-neutral-300" onClick={() => {
                        setFlag(true)
                    }}>Don't you have an account? Register here.</p>
                </div>
            </div>
        )
    } else {
        return (
            <div className="absolute w-[100vw] h-[100vh] m-0 bg-neutral-900">
                <div className="absolute m-auto left-0 right-0 w-[60vw] h-[80vh] bg-neutral-500 mt-[10vh] rounded-lg">
                    <p className="text-neutral-100 text-center text-xl pt-[20px] font-bold">Autorisation</p>
                    <div className="w-[80%] h-[50px] mt-[100px] ml-auto mr-auto">
                        <p className="text-neutral-200">Name</p>
                        <input id="name" type='email' placeholder="Name here..." className={!error ? "outline-none w-[100%] text-white bg-transparent border-b-[2px] border-b-neutral-200" :
                            "outline-none w-[100%] text-red-500 bg-transparent border-b-[2px] border-b-red-500"} onKeyDown={(e) => {
                                setError(false)
                                if (e.key === 'Enter') {
                                    document.querySelector('#password').focus()
                                }
                            }}></input>
                    </div>
                    <div className="w-[80%] h-[50px] mt-[100px] ml-auto mr-auto">
                        <p className="text-neutral-200">Password</p>
                        <input id='password' type='password' placeholder="Password here..." className={!error ? "outline-none w-[100%] text-white bg-transparent border-b-[2px] border-b-neutral-200" :
                            "outline-none w-[100%] text-red-500 bg-transparent border-b-[2px] border-b-red-500"} onKeyDown={async (e) => {
                                setError(false)
                                if (e.key === 'Enter') {
                                    send_request()
                                }
                            }}></input>
                    </div>
                    <div className="w-[250px] h-[75px] mt-[50px] ml-auto mr-auto ease-in-out duration-300 bg-neutral-200 rounded-lg text-center hover:scale-[1.05] hover:cursor-pointer" onClick={() => {
                        send_request()
                    }}>
                        <p className="pt-[25px] font-medium">Register</p>
                    </div>
                    <p className="w-[60%] pt-[10px] text-center ease-in-out duration-300 ml-auto mr-auto text-neutral-200 border-b-[2px] hover:text-neutral-300 hover:cursor-pointer hover:border-b-neutral-300" onClick={() => {
                        setFlag(false)
                    }}>Do you have an account? Login here.</p>
                </div>
            </div>
        )
    }
}