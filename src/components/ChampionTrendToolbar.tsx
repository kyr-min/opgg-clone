import React from 'react';
import styled from "styled-components";
import { ChampionTrendItemCss } from './ChampionTrendHeader';

const ChampionTrendToolbar = styled.div `
    ${ChampionTrendItemCss};
    & > div{
        flex:1;
        background-color: white;
        border: 1px solid #e9eff4;
        padding: 10px 0;
        font-weight: bold;

        cursor: pointer;
        font-size: 12px;
        &:not(:first-child) {
            border-left: none;
        }
        &.select {
            color: black;
            font-weight: bold;
        }
    }

`;

export default ChampionTrendToolbar;