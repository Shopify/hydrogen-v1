import {mountWithProviders} from '../../../utilities/tests/shopifyMount.js';
import {BaseButton} from '../BaseButton.client.js';

describe('BaseButton', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders a button', () => {
    const component = mountWithProviders(<BaseButton>Base Button</BaseButton>);

    expect(component).toContainReactComponent('button', {
      children: 'Base Button',
    });
  });

  it('allows passthrough props', () => {
    const component = mountWithProviders(
      <BaseButton className="bg-blue-600">Base Button</BaseButton>
    );

    expect(component.find('button')).toHaveReactProps({
      className: 'bg-blue-600',
    });
  });

  describe('given an on click event handler', () => {
    it('calls the on click event handler', () => {
      const mockOnClick = jest.fn();
      const mouseEvent = new MouseEvent('click', {cancelable: true});

      const component = mountWithProviders(
        <BaseButton onClick={mockOnClick}>Base Button</BaseButton>
      );

      component.find('button')?.trigger('onClick', mouseEvent);

      expect(mockOnClick).toBeCalledWith(mouseEvent);
    });

    it('calls the given default on click behaviour', () => {
      const mockDefaultOnClick = jest.fn();
      const mouseEvent = new MouseEvent('click', {cancelable: true});

      const component = mountWithProviders(
        <BaseButton onClick={() => {}} defaultOnClick={mockDefaultOnClick}>
          Base Button
        </BaseButton>
      );

      component.find('button')?.trigger('onClick', mouseEvent);

      expect(mockDefaultOnClick).toBeCalledWith(mouseEvent);
    });

    describe('and event preventDefault is called', () => {
      it('calls the on click event handler without calling the default on click behaviour', () => {
        const mockOnClick = jest.fn((event) => {
          event.preventDefault();
        });
        const mockDefaultOnClick = jest.fn();
        const mouseEvent = new MouseEvent('click', {cancelable: true});

        const component = mountWithProviders(
          <BaseButton onClick={mockOnClick} defaultOnClick={mockDefaultOnClick}>
            Base Button
          </BaseButton>
        );

        component.find('button')?.trigger('onClick', mouseEvent);

        expect(mockOnClick).toHaveBeenCalledWith(mouseEvent);
        expect(mockDefaultOnClick).not.toBeCalled();
      });
    });

    describe('and the on click handler returns false', () => {
      it('calls the on click event handler without calling the default on click behaviour', () => {
        const mockOnClick = jest.fn(() => false);
        const mockDefaultOnClick = jest.fn();
        const mouseEvent = new MouseEvent('click', {cancelable: true});

        const component = mountWithProviders(
          <BaseButton onClick={mockOnClick} defaultOnClick={mockDefaultOnClick}>
            Base Button
          </BaseButton>
        );

        component.find('button')?.trigger('onClick', mouseEvent);

        expect(mockOnClick).toBeCalledWith(mouseEvent);
        expect(mockDefaultOnClick).not.toBeCalled();
      });
    });
  });
});
