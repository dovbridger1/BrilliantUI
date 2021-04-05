import styled from 'styled-components/macro';
import {
    email_text_area_bg,
    main_text_color,
    email_container_background,
    main_bg_color,
    link_hover_color,
} from '../StyleConsts';
import { URGENT, IMPORTANT, CAN_WAIT } from '../../data_objects/Consts';
export const FeedElementStyle = styled.div`
    color: ${main_text_color};
    display: grid;
    grid-template-columns: 1fr 5fr 1fr;
    grid-template-rows: 40px 1fr;
    justify-items: flex-start;
    align-items: flex-start;
    width: 700px;
    height: max-content;
    padding: 0;
    margin: 30px 0;
    box-sizing: border-box;
    grid-template-areas:
        'time title close_button'
        '. component component';
    .element_title {
        grid-area: title;
        font-size: 24px;
        font-weight: bold;
        color: #ffffff;
    }
    .element_time {
        grid-area: time;
        font-size: 20px;
    }
    .close_button {
        grid-area: close_button;
        background-color: transparent;
        color: ${main_text_color};
        font-size: 20px;
        margin-left: auto;
    }
    .element_component {
        width: 100%;
        grid-area: component;
        margin-bottom: 10px;
    }
`;

export const FeedWrapper = styled.div`
    width: 100%;
    height: calc(100% - 60px);
    overflow: hidden;
    .simple_bar {
        height: 100%;
    }
`;

export const BrilliantFeedStyled = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
    h1 {
        color: white;
    }
`;

export const FeedComponentStyle = styled.div`
    width: 100%;
    .EmailThread {
        background-color: ${main_bg_color};
        margin: 10px;
    }

    .CalendarTask {
        margin-bottom: 5px;
        background-color: ${main_bg_color};
    }
    .EmailComposer {
        position: static;
        height: 200px;
    }
    .EmailContainer {
        height: 190px;
        overflow: hidden;
    }
    .EmailContainer * {
        background-color: transparent;
    }

    .component_area {
        background-color: ${email_text_area_bg};
        border-radius: 10px;
        width: 100%;
        padding: 5px;
    }
    .ButtonsRow {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        width: 100%;
        button {
            border: 2px solid ${main_text_color};
            color: ${main_text_color};
            background-color: transparent;
        }
    }
`;

export const IncrementalStyle = styled.div`
    .indicators {
        display: flex;
        justify-content: center;
        align-items: center;
        height: max-content;
        width: 100%;

        button {
            background-color: transparent;
            font-weight: bold;
            font-size: 20px;
            color: ${main_text_color};
            align-self: center;
            outline: none;
        }
        span {
            margin: 2px;
            width: 10px;
            height: 10px;
            border-radius: 100%;
            border: 1px solid white;
            &.selected {
                background-color: white;
            }
        }
    }
`;