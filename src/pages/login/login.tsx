import { ChangeEvent, FormEvent, useState } from "react"

type Props = {}

const login = (props: Props) => {
  // const [username, setUsername] = useState<string>('gaaa')
  // const [password, setPassword] = useState<string>('gaa')
  const [data, setData] = useState({})


  const sendForm = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Formulario enviado');
    
  }
  const handleLogin = (e:ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setData({
      ...data, [name]:value
    })
    console.log(data)
  }
  return (
    <div>
      <form onSubmit={sendForm}>
        <input type="text"  onChange={handleLogin} name="username"/>
        <input type="password" onChange={handleLogin} name="password"/>
        <button type="submit">Ingresar</button>
      </form>
    </div>
  )
}

export default login