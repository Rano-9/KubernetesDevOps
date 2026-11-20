import { useState, useEffect } from 'react'

interface Todo {
  id: number
  todo: string
}

const API_URL = import.meta.env.VITE_API_URL || ''

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState('')
  const [flashMessage, setFlashMessage] = useState<string | null>(null)

  useEffect(() => {
    console.log("TEST")
    fetchTodos()
  }, [])

  async function fetchTodos() {
    try {
      console.log(API_URL)
      const response = await fetch(`${API_URL}/todos`)
      if (!response.ok) throw new Error('Failed to fetch todos')
      console.log(response)
      const data: Todo[] = await response.json()
      setTodos(data)
    } catch (error) {
      console.error('Error fetching todos:', error)
    }
  }

  async function handleSubmit(e : React.SubmitEvent) {
    e.preventDefault()
    if (!inputValue.trim()) return

    try {
      const formData = new FormData()
      formData.append('todo', inputValue)

      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to add todo')

      const data: Todo[] = await response.json()
      setTodos(data)
      setInputValue('')
      setFlashMessage('Todo added successfully!')
      setTimeout(() => setFlashMessage(null), 3000)
    } catch (error) {
      console.error('Error adding todo:', error)
      setFlashMessage('Failed to add todo.')
      setTimeout(() => setFlashMessage(null), 3000)
    }
  }

  return (
    <main className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <header className="mb-3">
            <h1 style={{ textAlign: 'center' }} className="h3 mb-0">
              Todo App
            </h1>
          </header>

          {flashMessage && (
            <div className="alert alert-info" role="alert">
              {flashMessage}
            </div>
          )}

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 text-center">
              <img
                src={`${API_URL}/share/placeholder.jpg`}
                alt="Shared server image"
                className="img-fluid rounded shadow-sm"
                style={{ maxWidth: '320px' }}
              />

              <form className="mt-4" onSubmit={(e) => handleSubmit(e)}>
                <div className="mb-3">
                  <label htmlFor="todo-input" className="form-label">
                    Todo
                  </label>
                  <input
                    id="todo-input"
                    type="text"
                    className="form-control"
                    placeholder="Write your todo"
                    maxLength={140}
                    required
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>

              <div>
                <hr />
                {todos.map((todo, index) => (
                  <div key={todo.id}>
                    <p id={String(todo.id)} style={{ textAlign: 'left' }}>
                      {todo.todo}
                    </p>
                    {index < todos.length - 1 && <hr />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
