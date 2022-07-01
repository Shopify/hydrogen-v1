export function TodoItem({metafield, index}) {
  const id = metafield.id.split('/').pop();
  return (
    <div style={{display: 'flex', alignItems: 'center'}}>
      {/* update todo */}
      <form
        id={`update-form-${id}`}
        style={{display: 'flex', alignItems: 'center'}}
        method="post"
        action="/api/todo"
      >
        <p style={{marginRight: '1rem'}}>{index}.</p>

        {/* hidden fields passing required data to the api/admin/shop */}
        <input type="text" hidden name="action" defaultValue="updateTodo" />
        <input type="text" hidden name="key" defaultValue={metafield.key} />

        <label htmlFor={`todo-${id}`}>Todo item text</label>
        <input
          id={`todo-${id}`}
          type="textarea"
          name="value"
          required
          minLength={4}
          defaultValue={metafield.value}
          style={{width: 400}}
        />

        <button
          type="submit"
          style={{backgroundColor: 'MidnightBlue', color: 'white'}}
        >
          Update
        </button>
      </form>

      {/* delete todo */}
      <form id="delete-todo" action="/api/todo" method="post">
        {/* hidden fields passing required data to the api/admin/shop */}
        <input type="text" hidden name="action" defaultValue="deleteTodo" />
        <input type="text" hidden name="id" defaultValue={metafield.id} />

        <button
          type="submit"
          style={{backgroundColor: 'FireBrick', color: 'white'}}
        >
          Delete
        </button>
      </form>
    </div>
  );
}
