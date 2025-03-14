import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import {MultiSelectInput} from '@cdo/apps/code-studio/pd/workshop_dashboard/WorkshopFormTemplate/components/MultiSelectInput';

const mockOptions = [
  {
    id: '1',
    searchText: ['Option 1', 'First option'],
    label: 'Option 1',
    secondaryLabel: 'First option description',
  },
  {
    id: '2',
    searchText: ['Option 2', 'Second option'],
    label: 'Option 2',
  },
  {
    id: '3',
    searchText: ['Option 3', 'Third option'],
    label: 'Option 3',
    secondaryLabel: 'Third option description',
  },
];

describe('MultiSelectInput', () => {
  const defaultProps = {
    label: 'Test Label',
    options: mockOptions,
    selectedOptions: [],
    setSelectedOptions: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    const mockScrollIntoView = jest.fn();
    window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;
  });

  const getInputElement = () => screen.getByRole('searchbox');
  const getMenuElement = () => screen.getByRole('listbox');
  const getOptionFromDropdown = optionText => {
    const listbox = screen.getByRole('listbox');
    return within(listbox).getByText(optionText).closest('[role="option"]');
  };

  it('renders with default props', () => {
    render(<MultiSelectInput {...defaultProps} />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();

    expect(screen.getByPlaceholderText('Filter options')).toBeInTheDocument();
  });

  it('opens dropdown menu on input click', async () => {
    const user = userEvent.setup();
    render(<MultiSelectInput {...defaultProps} />);

    const input = getInputElement();
    await user.click(input);

    // Check if dropdown menu is opened
    const listbox = getMenuElement();
    expect(listbox).toBeInTheDocument();

    // Check if all options are displayed
    const options = within(listbox).getAllByRole('option');
    expect(options).toHaveLength(3);

    // Check for options within the listbox
    expect(getOptionFromDropdown('Option 1')).toBeInTheDocument();
    expect(getOptionFromDropdown('Option 2')).toBeInTheDocument();
    expect(getOptionFromDropdown('Option 3')).toBeInTheDocument();
  });

  it('opens dropdown menu on arrow down or up', async () => {
    const user = userEvent.setup();
    render(<MultiSelectInput {...defaultProps} />);

    await user.tab();
    await user.keyboard('{ArrowDown}');

    // Check if dropdown menu is opened
    const listbox = getMenuElement();
    expect(listbox).toBeInTheDocument();

    // Check if all options are displayed
    const options = within(listbox).getAllByRole('option');
    expect(options).toHaveLength(3);

    // Check for options within the listbox
    expect(getOptionFromDropdown('Option 1')).toBeInTheDocument();
    expect(getOptionFromDropdown('Option 2')).toBeInTheDocument();
    expect(getOptionFromDropdown('Option 3')).toBeInTheDocument();
  });

  it('filters options based on search text', async () => {
    const user = userEvent.setup();
    render(<MultiSelectInput {...defaultProps} />);

    const input = getInputElement();
    await user.click(input);
    await user.type(input, 'First');

    // Check if only matching option is displayed
    const listbox = getMenuElement();
    const options = within(listbox).getAllByRole('option');
    expect(options).toHaveLength(1);

    expect(within(listbox).getByText('Option 1')).toBeInTheDocument();
    expect(within(listbox).queryByText('Option 2')).not.toBeInTheDocument();
    expect(within(listbox).queryByText('Option 3')).not.toBeInTheDocument();
  });

  it('selects an option on click', async () => {
    const mockSetSelectedOptions = jest.fn();
    const user = userEvent.setup();

    render(
      <MultiSelectInput
        {...defaultProps}
        setSelectedOptions={mockSetSelectedOptions}
      />
    );

    const input = getInputElement();
    await user.click(input);

    // Get the option from the dropdown specifically
    const listbox = getMenuElement();
    const option1 = within(listbox)
      .getByText('Option 1')
      .closest('[role="option"]');
    await user.click(option1);

    // Check if setSelectedOptions was called with correct argument
    expect(mockSetSelectedOptions).toHaveBeenCalledWith(['1']);
  });

  it('selects a focused option on Enter or Space', async () => {
    const mockSetSelectedOptions = jest.fn();
    const user = userEvent.setup();

    render(
      <MultiSelectInput
        {...defaultProps}
        setSelectedOptions={mockSetSelectedOptions}
      />
    );

    const input = getInputElement();
    await user.click(input);

    // focus on first menu option
    await user.keyboard('{ArrowDown}');

    // press Enter
    await user.keyboard('{Enter}');

    expect(mockSetSelectedOptions).toHaveBeenCalledWith(['1']);

    // focus on second menu option
    await user.keyboard('{ArrowDown}');

    // press Space
    await user.keyboard(' ');

    expect(mockSetSelectedOptions).toHaveBeenCalledWith(['2']);
  });

  it('renders selected options as tags', () => {
    render(<MultiSelectInput {...defaultProps} selectedOptions={['1', '3']} />);

    // Check if tags are rendered
    // Look for the tag container first
    const multiSelectContainer = screen.getByRole('combobox');
    expect(
      within(multiSelectContainer).getByText('Option 1')
    ).toBeInTheDocument();
    expect(
      within(multiSelectContainer).getByText('Option 3')
    ).toBeInTheDocument();

    // The Tags component should render buttons to remove the tags
    const closeButtons = screen.getAllByRole('button', {name: /remove/i});
    expect(closeButtons).toHaveLength(2);
  });

  it('removes option when tag close button is clicked', async () => {
    const mockSetSelectedOptions = jest.fn();
    const user = userEvent.setup();

    render(
      <MultiSelectInput
        {...defaultProps}
        selectedOptions={['1', '3']}
        setSelectedOptions={mockSetSelectedOptions}
      />
    );

    // Find the close button for Option 1
    const closeButton = screen.getByRole('button', {name: /remove option 1/i});
    await user.click(closeButton);

    // Check if setSelectedOptions was called with correct argument
    expect(mockSetSelectedOptions).toHaveBeenCalledWith(['3']);
  });

  it('clears all selected options when clear all button is clicked', async () => {
    const mockSetSelectedOptions = jest.fn();
    const user = userEvent.setup();

    render(
      <MultiSelectInput
        {...defaultProps}
        selectedOptions={['1', '3']}
        setSelectedOptions={mockSetSelectedOptions}
      />
    );

    // Find the clear all button
    const clearButton = screen.getByRole('button', {
      name: /clear all selected options/i,
    });
    await user.click(clearButton);

    // Check if setSelectedOptions was called with empty array
    expect(mockSetSelectedOptions).toHaveBeenCalledWith([]);
  });

  it('selects first option on Enter key when filtering', async () => {
    const mockSetSelectedOptions = jest.fn();
    const user = userEvent.setup();

    render(
      <MultiSelectInput
        {...defaultProps}
        setSelectedOptions={mockSetSelectedOptions}
      />
    );

    const input = getInputElement();
    await user.click(input);
    await user.type(input, 'First');
    await user.keyboard('{Enter}');

    // Check if setSelectedOptions was called with correct argument
    expect(mockSetSelectedOptions).toHaveBeenCalledWith(['1']);
  });

  it('closes dropdown on Escape key', async () => {
    const user = userEvent.setup();
    render(<MultiSelectInput {...defaultProps} />);

    const input = getInputElement();
    await user.click(input);

    // Check if dropdown is open
    expect(getMenuElement()).toBeInTheDocument();

    await user.keyboard('{Escape}');

    // Check if dropdown is closed
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('removes last selected option on Backspace when input is empty', async () => {
    const mockSetSelectedOptions = jest.fn();
    const user = userEvent.setup();

    render(
      <MultiSelectInput
        {...defaultProps}
        selectedOptions={['1', '3']}
        setSelectedOptions={mockSetSelectedOptions}
      />
    );

    const input = getInputElement();
    await user.click(input);
    await user.keyboard('{Backspace}');

    // Check if setSelectedOptions was called to remove the last option
    expect(mockSetSelectedOptions).toHaveBeenCalledWith(['1']);
  });

  it('does not remove last selected option on Backspace when input is not empty', async () => {
    const mockSetSelectedOptions = jest.fn();
    const user = userEvent.setup();

    render(
      <MultiSelectInput
        {...defaultProps}
        selectedOptions={['1', '3']}
        setSelectedOptions={mockSetSelectedOptions}
      />
    );

    const input = getInputElement();
    await user.click(input);
    await user.type(input, 'a');
    await user.keyboard('{Backspace}');

    // Check if setSelectedOptions was called to remove the last option
    expect(mockSetSelectedOptions).not.toHaveBeenCalled();
  });

  it('displays empty state message when no options match search', async () => {
    const user = userEvent.setup();
    render(
      <MultiSelectInput
        {...defaultProps}
        emptyStateMessage="Custom empty message"
      />
    );

    const input = getInputElement();
    await user.click(input);
    await user.type(input, 'nonexistent option');

    // Check if empty state message is displayed
    expect(screen.getByText('Custom empty message')).toBeInTheDocument();
  });

  it('toggles option selection when already selected', async () => {
    const mockSetSelectedOptions = jest.fn();
    const user = userEvent.setup();

    render(
      <MultiSelectInput
        {...defaultProps}
        selectedOptions={['1']}
        setSelectedOptions={mockSetSelectedOptions}
      />
    );

    const input = getInputElement();
    await user.click(input);

    // Get the option from the dropdown specifically
    const option1 = getOptionFromDropdown('Option 1');
    await user.click(option1);

    // Check if setSelectedOptions was called to remove the option
    expect(mockSetSelectedOptions).toHaveBeenCalledWith([]);
  });

  it('focuses input when clicking on the label', async () => {
    const user = userEvent.setup();
    render(<MultiSelectInput {...defaultProps} />);

    const label = screen.getByText('Test Label');
    await user.click(label);

    // Check if input is focused
    expect(getInputElement()).toHaveFocus();
  });

  it('sets correct aria attributes for accessibility', () => {
    render(<MultiSelectInput {...defaultProps} id="test-multiselect" />);

    const combobox = screen.getByRole('combobox');
    expect(combobox).toHaveAttribute(
      'aria-controls',
      'test-multiselect-listbox'
    );
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
    expect(combobox).toHaveAttribute('aria-haspopup', 'listbox');

    const input = getInputElement();
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
    expect(input).toHaveAttribute('aria-controls', 'test-multiselect-listbox');
    expect(input).toHaveAttribute('aria-labelledby', 'test-multiselect-label');
  });

  it('updates aria-expanded when dropdown opens', async () => {
    const user = userEvent.setup();
    render(<MultiSelectInput {...defaultProps} />);

    const combobox = screen.getByRole('combobox');
    expect(combobox).toHaveAttribute('aria-expanded', 'false');

    const input = getInputElement();
    await user.click(input);

    expect(combobox).toHaveAttribute('aria-expanded', 'true');
  });

  it('uses custom id when provided', () => {
    render(<MultiSelectInput {...defaultProps} id="custom-id" />);

    const input = getInputElement();
    expect(input).toHaveAttribute('id', 'custom-id');
  });
});
