export function SidebarToggle({open = false, color = 'rgb(0, 0, 0)'}) {
  return (
    <>
      <input
        id="header__checkbox"
        type="checkbox"
        style={{display: 'none'}}
        defaultChecked={open}
      />
      <label id="header__toggle" htmlFor="header__checkbox">
        <svg
          id="header__toggle__icon"
          aria-hidden="true"
          fill={color}
          height="30"
          width="30"
        >
          <rect
            id="header__toggle__icon__top"
            height="3"
            width="30"
            x="0"
            y="7"
          />

          <rect
            id="header__toggle__icon__bottom"
            height="3"
            width="30"
            x="0"
            y="20"
          />
        </svg>
      </label>
    </>
  );
}
