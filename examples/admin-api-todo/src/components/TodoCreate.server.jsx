export function TodoCreate() {
  return (
    <form
      id="create-form"
      style={{display: 'flex', alignItems: 'center'}}
      action="/api/todo"
      method="post"
    >
      <p style={{marginRight: '1rem'}}>+&nbsp;</p>

      {/* hidden fields passing required data to the api/admin/shop */}
      <input hidden type="text" name="action" defaultValue="createTodo"></input>

      <label htmlFor="create-todo">New todo item input</label>
      <input
        id="create-todo"
        type="textarea"
        name="value"
        defaultValue=""
        required
        minLength={4}
        style={{width: 400}}
      />

      <button type="submit" style={{backgroundColor: 'Teal', color: 'white'}}>
        Create
      </button>
    </form>
  );
}
