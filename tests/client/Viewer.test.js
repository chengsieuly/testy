import React from 'react';
import { mount } from 'enzyme';

import { Button, Navbar, Spinner } from '@blueprintjs/core';
import PriorityHigh from '@material-ui/icons/PriorityHigh';
import Viewer from '@/src/client/components/Viewer';
import Code from 'react-code-prettify';

describe('<Viewer />', () => {
    const getDefaultProps = () => ({
        classes: {},
        fixture: {
            id: '12345',
            data: 1,
            method: 'GET',
            url: '/test',
        },
        updateValidations: jest.fn(),
        updateTesty: jest.fn(),
        validation: undefined,
    });

    describe('mount', () => {
        const defaultProps = getDefaultProps();
        mount(<Viewer {...defaultProps} />);

        it('should set validations', () => {
            expect(defaultProps.updateValidations).toHaveBeenCalledTimes(1);
        });
    });

    describe('action bar', () => {
        let defaultProps;
        let wrapper;

        beforeEach(() => {
            defaultProps = getDefaultProps();
            wrapper = mount(<Viewer {...defaultProps} />);
        });

        it('should show method', () => {
            const nav = wrapper.find(Navbar);
            expect(nav.text()).toContain(defaultProps.fixture.method);
        });

        it('should show url', () => {
            const nav = wrapper.find(Navbar);
            expect(nav.text()).toContain(defaultProps.fixture.url);
        });

        it('should set current fixture as active when clicked on button', () => {
            const btn = wrapper.find(Button);
            btn.simulate('click');
            expect(defaultProps.updateTesty).toHaveBeenCalledTimes(1);
            expect(defaultProps.updateTesty).toHaveBeenCalledWith({ id: defaultProps.fixture.id });
        });
    });

    describe('validation status', () => {
        let wrapper;

        beforeEach(() => {
            wrapper = mount(<Viewer {...getDefaultProps()} />)
        });

        it('should show spinner when validation has not been set yet', () => {
            expect(wrapper.find(Spinner)).toHaveLength(1);
        });

        it('should show error status when it has validation errors', () => {
            wrapper.setProps({ validation: { error: 'error' }});
            expect(wrapper.find(PriorityHigh)).toHaveLength(1);
        });

        it('should not show error status when it does not have validation errors', () => {
            wrapper.setProps({ validation: null });
            expect(wrapper.find(PriorityHigh)).toHaveLength(0);
        });
    });

    describe('code block peeker', () => {
        let defaultProps;
        let wrapper;

        beforeEach(() => {
            defaultProps = getDefaultProps();
            wrapper = mount(<Viewer {...defaultProps} />).find(Code);
        });

        it('should only display one instance of code', () => {
            expect(wrapper).toHaveLength(1);
        });

        it('should display data from fixture', () => {
            expect(wrapper.text()).toContain(defaultProps.fixture.data);
        });

        it('should display handler code from fixture', () => {
            delete defaultProps.fixture.data;

            defaultProps._handler = '() => {}';

            const wrapper = mount(<Viewer {...defaultProps} />).find(Code);

            expect(wrapper.text()).toContain(defaultProps.fixture._handler);
        });
    });
});
