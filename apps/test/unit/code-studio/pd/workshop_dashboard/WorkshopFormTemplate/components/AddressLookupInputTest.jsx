import {render, screen, waitFor, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {Provider} from 'react-redux';

import {AddressLookupInput} from '@cdo/apps/code-studio/pd/workshop_dashboard/WorkshopFormTemplate/components/SessionsEditor/components/AddressLookupInput';

const mockSuggest = jest.fn();
const mockAutofillCoreInstance = {suggest: mockSuggest};
jest.mock('@mapbox/search-js-react', () => ({
  useAddressAutofillCore: jest.fn(() => mockAutofillCoreInstance),
}));

jest.mock('@mapbox/search-js-core', () => ({
  SessionToken: jest.fn().mockImplementation(() => ({id: 'mock-session-id'})),
}));

const mockRef = React.createRef();
jest.mock('@cdo/apps/util/hooks/useOutsideClick', () => ({
  __esModule: true,
  default: jest.fn(() => mockRef),
}));

// mock redux store
const initialState = {mapbox: {mapboxAccessToken: 'test-token'}};
const store = {getState: () => initialState, subscribe: () => {}};

// AddressLookupInput does not manage its own state
const ComponentWithState = (props = {}) => {
  const [state, setState] = useState(props.value ?? '');
  const handleChange = event => {
    setState(event.target.value);
    props.onChange(event);
  };
  return (
    <Provider store={store}>
      <AddressLookupInput {...props} value={state} onChange={handleChange} />
    </Provider>
  );
};

ComponentWithState.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

describe('AddressLookupInput Component', () => {
  let mockOnChange;
  let user;
  const defaultProps = {
    label: 'Location Address',
    name: 'locationAddress',
    size: 's',
    className: 'test-class',
    onChange: jest.fn(),
    value: '',
    errorMessage: undefined,
    // not mocking useDebounce or using fake timers because userEvent uses timers
    // to simulate keyboard interaction. instead reducing debounce delay to speed
    // up tests
    debounceDelay: 300,
  };

  const renderComponent = (props = {}) =>
    render(<ComponentWithState {...defaultProps} {...props} />);

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();
    mockOnChange = jest.fn();
    defaultProps.onChange = mockOnChange;
    mockSuggest.mockResolvedValue({suggestions: []});
  });

  it('renders the TextField with correct initial props', () => {
    renderComponent({value: 'Initial Value'});
    const input = screen.getByLabelText('Location Address');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('Initial Value');
    expect(input).toHaveAttribute('name', 'locationAddress');
    expect(input).toHaveAttribute(
      'placeholder',
      'Enter a location to see results'
    );
    expect(input).toHaveAttribute('role', 'combobox');
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
    expect(input).toHaveAttribute('aria-controls', 'mock-session-id');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).not.toHaveAttribute('aria-activedescendant');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument(); // No suggestions initially
  });

  it('calls onChange prop when typing in the input', async () => {
    renderComponent();
    const input = screen.getByLabelText('Location Address');
    const newValue = 'New York';
    await act(async () => {
      await userEvent.type(input, newValue);
    });
    expect(mockOnChange).toHaveBeenCalledTimes(newValue.length);
  });

  it('calls mapbox suggest after debounce', async () => {
    mockSuggest.mockResolvedValue({
      suggestions: [{full_address: '123 Main St'}],
    });

    renderComponent({value: '123'}); // Initial render doesn't trigger suggest

    expect(mockSuggest).not.toHaveBeenCalled();

    const input = screen.getByLabelText('Location Address');
    await act(async () => {
      await userEvent.type(input, ' Main');
    });

    // Wait for the debounced effect and API call
    await waitFor(() => {
      expect(mockSuggest).toHaveBeenCalledTimes(1);
      expect(mockSuggest).toHaveBeenCalledWith('123 Main', {
        sessionToken: expect.objectContaining({id: 'mock-session-id'}),
      });
    });
  });

  it('displays suggestions when API returns results', async () => {
    const suggestions = [
      {full_address: '123 Main St, Chicago, IL'},
      {full_address: '123 South Parkway, Denver, CO'},
    ];
    mockSuggest.mockResolvedValue({suggestions});

    renderComponent();

    const input = screen.getByLabelText('Location Address');
    await act(async () => {
      await userEvent.type(input, '123');
    });

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    const listItems = screen.getAllByRole('option');
    expect(listItems).toHaveLength(2);
    expect(listItems[0]).toHaveTextContent('123 Main St, Chicago, IL');
    expect(listItems[1]).toHaveTextContent('123 South Parkway, Denver, CO');
    expect(screen.getByLabelText('Location Address')).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });

  it('does not display suggestions if input value exactly matches a suggestion', async () => {
    const suggestions = [{full_address: 'Exact Match Address'}];
    mockSuggest.mockResolvedValue({suggestions});

    renderComponent();

    const input = screen.getByLabelText('Location Address');
    await act(async () => {
      await userEvent.type(input, 'Exact Match Address');
    });

    // Wait for potential API call and rendering
    await waitFor(() => {
      expect(mockSuggest).toHaveBeenCalledWith(
        'Exact Match Address',
        expect.any(Object)
      );
    });

    // Even though suggest was called, the list should not render
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Location Address')).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  it('selecting a suggestion on click, calls onChange, and hides list', async () => {
    const suggestions = [{full_address: 'Click Me Address'}];
    mockSuggest.mockResolvedValue({suggestions});

    renderComponent();
    const value = 'Click';

    const input = screen.getByLabelText('Location Address');
    await act(async () => {
      await userEvent.type(input, value);
    });

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    const suggestionItem = screen.getByText('Click Me Address');
    await user.click(suggestionItem);

    expect(mockOnChange).toHaveBeenCalledTimes(value.length + 1);
    expect(mockOnChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          name: 'locationAddress',
          value: 'Click Me Address',
        }),
      })
    );

    // List should be hidden after selection
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Location Address')).toHaveAttribute(
      'aria-expanded',
      'false'
    );
    expect(screen.getByLabelText('Location Address')).toHaveFocus();
  });

  describe('Keyboard Navigation', () => {
    let input;
    const value = 'Address';
    const suggestions = [
      {full_address: 'First Address'},
      {full_address: 'Second Address'},
      {full_address: 'Third Address'},
    ];

    beforeEach(async () => {
      mockSuggest.mockResolvedValue({suggestions});
      renderComponent();
      input = screen.getByLabelText('Location Address');
      await act(async () => {
        await userEvent.type(input, value);
      });
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('navigates suggestions with ArrowDown and ArrowUp', async () => {
      await user.type(input, '{arrowdown}'); // Focus first item
      expect(input).toHaveAttribute(
        'aria-activedescendant',
        'mock-session-id-item-0'
      );
      expect(screen.getByText('First Address')).toHaveAttribute(
        'class',
        expect.stringContaining('active')
      );

      await user.type(input, '{arrowdown}'); // Focus second item
      expect(input).toHaveAttribute(
        'aria-activedescendant',
        'mock-session-id-item-1'
      );
      expect(screen.getByText('Second Address')).toHaveAttribute(
        'class',
        expect.stringContaining('active')
      );
      expect(screen.getByText('First Address')).not.toHaveAttribute(
        'class',
        expect.stringContaining('active')
      );

      await user.type(input, '{arrowup}'); // Focus first item again
      expect(input).toHaveAttribute(
        'aria-activedescendant',
        'mock-session-id-item-0'
      );
      expect(screen.getByText('First Address')).toHaveAttribute(
        'class',
        expect.stringContaining('active')
      );
      expect(screen.getByText('Second Address')).not.toHaveAttribute(
        'class',
        expect.stringContaining('active')
      );

      await user.type(input, '{arrowup}'); // Stays on first item
      expect(input).toHaveAttribute(
        'aria-activedescendant',
        'mock-session-id-item-0'
      );
    });

    it('selects suggestion with Enter key', async () => {
      await user.type(input, '{arrowdown}'); // Select first
      await user.type(input, '{enter}');

      expect(mockOnChange).toHaveBeenCalledTimes(value.length + 1);
      expect(mockOnChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({value: 'First Address'}),
        })
      );
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('selects suggestion with Space key', async () => {
      await user.type(input, '{arrowdown}'); // Select first
      await user.type(input, '{arrowdown}'); // Select second
      await user.type(input, ' '); // Select with space

      expect(mockOnChange).toHaveBeenCalledTimes(value.length + 1);
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({value: 'Second Address'}),
        })
      );
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('closes suggestions with Escape key', async () => {
      await user.type(input, '{escape}');

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });

    it('closes suggestions with Tab key', async () => {
      await user.type(input, '{tab}');

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });
  });
});
