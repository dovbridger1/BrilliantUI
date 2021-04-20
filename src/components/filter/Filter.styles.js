import {
    brigher_background,
    main_text_color,
    link_hover_color,
    email_text_area_bg,
    email_container_background,
} from '../misc/StyleConsts';
import styled from 'styled-components';
import { contentReady } from '@syncfusion/ej2-schedule';
import { getStartEndHours } from '@syncfusion/ej2-schedule';

const FILTER_WIDTH = 400;
const common_menu_list_style = {
    zIndex: 1001,
    backgroundColor: brigher_background,
    borderRadius: '10px',
};

const option_style = (provided, state) => ({
    ...provided,
    color: 'white',
    backgroundColor: 'transparent',
    ':hover': {
        backgroundColor: link_hover_color,
    },
});
const control_style = {
    // none of react-select's styles are passed to <Control />
    width: `${FILTER_WIDTH}px`,
    color: 'red',
    //   border: '1px solid green',
    zIndex: 1002,
};
export const main_menu_style = {
    menuList: (provided, state) => ({
        ...provided,
        ...common_menu_list_style,
        zIndex: 1001,
        position: 'absolute',
        left: '-120px',
        top: '50px',
        width: '120px',
    }),
    menu: (provided, state) => ({
        backgroundColor: 'transparent',
    }),
    control: () => ({
        ...control_style,
        position: 'absolute',
        left: '-20px',
        top: '-15px',
    }),
    option: option_style,
    indicatorsContainer: () => ({
        display: 'none',
    }),
};

export const sub_menu_style = {
    menuList: (provided, state) => ({
        ...provided,
        ...common_menu_list_style,
        position: 'relative',
        left: '0',
        marginLeft: '2px',
        top: '70px',
        width: 'max-content',
    }),
    menu: (provided, state) => ({
        ...provided,
        backgroundColor: 'transparent',
    }),
    control: () => ({
        backgroundColor: email_container_background,
        position: 'absolute',
        top: '50px',
    }),
    input: () => ({
        color: main_text_color,
    }),
    option: option_style,
};
export const FilterStyle = styled.div`
    //   border: 2px solid yellow;
    min-width: 300px;
    display: flex;
    align-items: center;
    position: relative;
    left: 0;
    top: 0;
    .filter_label {
        text-align: center;
        background-color: var(--email-text-area-bg);
        color: var(--unread-text-color);
        font-size: 16px;
        margin: 10px 20px;
        border-radius: 10px;
        width: 100px;
        height: 30px;
        padding-top: 10px;
        &:hover {
            cursor: pointer;
        }
    }
`;